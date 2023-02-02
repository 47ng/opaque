import { test } from '@playwright/test'

test('signup and login', async ({ page, browserName }) => {
  const username = `alice+${browserName}@example.com`
  const password = 'correct horse battery staple'

  await page.goto('/signup')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await Promise.all([
    page.getByRole('button', { name: 'Sign up' }).click(),
    page.waitForResponse('/api/signup/record'),
  ])

  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await Promise.all([
    page.getByRole('button', { name: 'Log in' }).click(),
    page.waitForResponse('/api/login/record'),
  ])
})
