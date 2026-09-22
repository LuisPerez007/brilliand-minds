import { expect } from '@playwright/test'
import { getCredentials } from './env.js'

export const loginAs = async (page, role) => {
  const account = getCredentials(role)

  if (!account) {
    throw new Error(`Rol no soportado para auditoría: ${role}`)
  }

  await page.goto('/#/login')
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  await page.locator('input[name="email"]').fill(account.email)
  await page.locator('input[name="password"]').fill(account.password)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await page.waitForURL(
    /#\/(dashboard|admin\/estudiantes|docente\/cursos|estudiante\/preinscripciones)/,
  )
}

export const loginWithBadCredentials = async (page) => {
  await page.goto('/#/login')
  await page.locator('input[name="email"]').fill('invalid@example.invalid')
  await page.locator('input[name="password"]').fill('bad-password')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
}
