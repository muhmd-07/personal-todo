import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? 'e2e-test@example.com'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? 'e2e-test-password-123!'

test.describe('Authentication', () => {
  test.describe('Login page', () => {
    test('shows login form', async ({ page }) => {
      await page.goto('/login')
      await expect(page.getByRole('heading', { name: /sign in|log in/i })).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible()
    })

    test('shows error on invalid credentials', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel(/email/i).fill('notreal@example.com')
      await page.getByLabel(/password/i).fill('wrongpassword')
      await page.getByRole('button', { name: /sign in|log in/i }).click()
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 8000 })
    })

    test('has link to register page', async ({ page }) => {
      await page.goto('/login')
      await page.getByRole('link', { name: /sign up|register|create account/i }).click()
      await expect(page).toHaveURL(/register/)
    })

    test('has link to forgot password', async ({ page }) => {
      await page.goto('/login')
      await page.getByRole('link', { name: /forgot|reset/i }).click()
      await expect(page).toHaveURL(/forgot|reset/)
    })
  })

  test.describe('Register page', () => {
    test('shows registration form', async ({ page }) => {
      await page.goto('/register')
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i).first()).toBeVisible()
      await expect(page.getByRole('button', { name: /create|register|sign up/i })).toBeVisible()
    })

    test('validates required fields', async ({ page }) => {
      await page.goto('/register')
      await page.getByRole('button', { name: /create|register|sign up/i }).click()
      // Expect either HTML5 validation or error message
      const emailInput = page.getByLabel(/email/i)
      await expect(emailInput).toBeFocused()
    })

    test('shows error for short password', async ({ page }) => {
      await page.goto('/register')
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/password/i).first().fill('123')
      await page.getByRole('button', { name: /create|register|sign up/i }).click()
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Password reset', () => {
    test('shows forgot password form', async ({ page }) => {
      await page.goto('/forgot-password')
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /send|reset/i })).toBeVisible()
    })

    test('shows confirmation after submitting email', async ({ page }) => {
      await page.goto('/forgot-password')
      await page.getByLabel(/email/i).fill('someone@example.com')
      await page.getByRole('button', { name: /send|reset/i }).click()
      // Should show a success/check-email message, not an error
      await expect(page.getByText(/check|sent|email/i)).toBeVisible({ timeout: 8000 })
    })
  })

  test.describe('Protected routes', () => {
    test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login/)
    })

    test('redirects unauthenticated user from /profile to /login', async ({ page }) => {
      await page.goto('/profile')
      await expect(page).toHaveURL(/login/)
    })

    test('root / redirects somewhere (login or dashboard)', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveURL(/login|dashboard/)
    })
  })
})
