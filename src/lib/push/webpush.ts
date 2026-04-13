/**
 * Web push notification sender using the Web Push Protocol.
 * Uses the native fetch API with VAPID authentication.
 */

interface PushSubscriptionRecord {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface PushPayload {
  title: string
  body?: string
  url?: string
}

/**
 * Send a push notification to a single subscription.
 * Returns true on success, false if the subscription is expired/invalid.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<boolean> {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('[push] VAPID keys not configured')
    return false
  }

  const vapidHeaders = await buildVapidHeaders(
    subscription.endpoint,
    vapidPublicKey,
    vapidPrivateKey,
  )

  const body = JSON.stringify(payload)

  try {
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        ...vapidHeaders,
        'Content-Type': 'application/json',
        'Content-Length': String(new TextEncoder().encode(body).length),
      },
      body,
    })

    // 410 Gone or 404 = subscription expired/invalid
    if (response.status === 410 || response.status === 404) {
      return false
    }

    return response.ok
  } catch (err) {
    console.error('[push] delivery failed', err)
    return false
  }
}

// ─── VAPID JWT builder ────────────────────────────────────────────────────────

async function buildVapidHeaders(
  endpoint: string,
  publicKey: string,
  privateKey: string,
): Promise<Record<string, string>> {
  const url = new URL(endpoint)
  const audience = `${url.protocol}//${url.host}`
  const subject = `mailto:${process.env.VAPID_SUBJECT ?? 'admin@example.com'}`

  const header = base64url(JSON.stringify({ alg: 'ES256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + 12 * 3600,
      sub: subject,
    }),
  )

  const signingInput = `${header}.${payload}`
  const keyBytes = base64urlDecode(privateKey)

  // Wrap raw 32-byte P-256 private key scalar in PKCS#8 DER format
  // Structure: SEQUENCE { version, AlgorithmIdentifier { ecPublicKey, prime256v1 }, OCTET STRING { ECPrivateKey } }
  const pkcs8Header = new Uint8Array([
    0x30, 0x41,                                           // SEQUENCE (65 bytes)
    0x02, 0x01, 0x00,                                     // INTEGER 0 (version)
    0x30, 0x13,                                           // SEQUENCE (19 bytes) — AlgorithmIdentifier
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, // OID id-ecPublicKey
    0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, // OID prime256v1
    0x04, 0x27,                                           // OCTET STRING (39 bytes)
    0x30, 0x25,                                           // SEQUENCE (37 bytes) — ECPrivateKey
    0x02, 0x01, 0x01,                                     // INTEGER 1 (ECPrivateKey version)
    0x04, 0x20,                                           // OCTET STRING (32 bytes) — private key
  ])
  const pkcs8Key = new Uint8Array(pkcs8Header.length + keyBytes.length)
  pkcs8Key.set(pkcs8Header)
  pkcs8Key.set(keyBytes, pkcs8Header.length)

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pkcs8Key.buffer as ArrayBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(signingInput),
  )

  const jwt = `${signingInput}.${base64url(signature)}`

  return {
    Authorization: `vapid t=${jwt},k=${publicKey}`,
  }
}

function base64url(input: string | ArrayBuffer): string {
  let bytes: Uint8Array
  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input)
  } else {
    bytes = new Uint8Array(input)
  }
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}
