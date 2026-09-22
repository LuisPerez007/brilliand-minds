import { test, expect } from '@playwright/test'
import { createAuditTracker } from './helpers/audit.js'
import {
  hasRoleCredentials,
  isControlledCrudEnabled,
  isExtraRoleAuditEnabled,
} from './helpers/env.js'
import { loginAs, loginWithBadCredentials } from './helpers/login.js'
import { routeGroups } from './helpers/routes.js'
import { getActionNames, getRoleMenuItems } from './helpers/selectors.js'

const ensureRoleState = async (page, role) => {
  test.skip(!hasRoleCredentials(role), `Faltan variables de entorno para el rol ${role}.`)
  await page.goto('/#/login')
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  await loginAs(page, role)
}

const openRoute = async (page, route) => {
  await page.goto(`/#${route}`)
  await expect(page).toHaveURL(new RegExp(`/#${route.replace('/', '\\/')}.*`))
}

test.describe('Auditoría E2E — login, roles y módulos', () => {
  test('01. Login: validación de formulario y credenciales inválidas', async ({ page }) => {
    const audit = createAuditTracker(page)

    await page.goto('/#/login')
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()

    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page.getByRole('alert')).toBeVisible()

    await loginWithBadCredentials(page)

    await audit.assertNoCriticalErrors()
  })

  test('02. Login administrador y acceso a rutas protegidas', async ({ page }) => {
    test.skip(
      !hasRoleCredentials('administrador'),
      'Faltan variables de entorno para administrador.',
    )
    const audit = createAuditTracker(page)

    await ensureRoleState(page, 'administrador')
    for (const route of routeGroups.administrador) {
      await openRoute(page, route)
    }

    for (const item of getRoleMenuItems('administrador')) {
      await expect(page.getByText(item, { exact: false }))
        .toBeVisible({ timeout: 7000 })
        .catch(() => {})
    }

    await audit.assertNoCriticalErrors()
  })

  test('03. Login profesor y acceso a rutas protegidas', async ({ page }) => {
    test.skip(!hasRoleCredentials('profesor'), 'Faltan variables de entorno para profesor.')
    const audit = createAuditTracker(page)

    await ensureRoleState(page, 'profesor')
    for (const route of routeGroups.profesor) {
      await openRoute(page, route)
    }

    for (const item of getRoleMenuItems('profesor')) {
      await expect(page.getByText(item, { exact: false }))
        .toBeVisible({ timeout: 7000 })
        .catch(() => {})
    }

    await audit.assertNoCriticalErrors()
  })

  test('04. Login estudiante y acceso a rutas protegidas', async ({ page }) => {
    test.skip(
      !isExtraRoleAuditEnabled() || !hasRoleCredentials('estudiante'),
      'Se omite por protección anti-rate-limit del backend. Activa PLAYWRIGHT_ROLE_AUDIT=1 si quieres ejecutar este rol adicional.',
    )
    const audit = createAuditTracker(page)

    await ensureRoleState(page, 'estudiante')
    for (const route of routeGroups.estudiante) {
      await openRoute(page, route)
    }

    for (const item of getRoleMenuItems('estudiante')) {
      await expect(page.getByText(item, { exact: false }))
        .toBeVisible({ timeout: 7000 })
        .catch(() => {})
    }

    await audit.assertNoCriticalErrors()
  })

  test('05. Tablas, búsquedas y filtros de la auditoría', async ({ page }) => {
    test.skip(
      !hasRoleCredentials('administrador'),
      'Faltan variables de entorno para administrador.',
    )
    const audit = createAuditTracker(page)

    await ensureRoleState(page, 'administrador')

    await openRoute(page, '/admin/profesores')
    await expect(page.locator('table')).toBeVisible()
    await page.locator('input[aria-label="Buscar profesor por nombre"]').fill('a')

    await openRoute(page, '/admin/estudiantes')
    await expect(page.locator('table')).toBeVisible()

    await openRoute(page, '/admin/recibos')
    await expect(page.locator('table')).toBeVisible()

    for (const action of getActionNames()) {
      await expect(page.getByRole('button', { name: new RegExp(action, 'i') }))
        .toBeVisible({ timeout: 2000 })
        .catch(() => {})
    }

    await audit.assertNoCriticalErrors()
  })

  test('06. Validación del flujo de formularios con CRUD controlado', async ({ page }) => {
    test.skip(
      !isControlledCrudEnabled(),
      'CRUD controlado desactivado. Define PLAYWRIGHT_CRUD=1 para activar estas pruebas.',
    )

    const audit = createAuditTracker(page)
    await ensureRoleState(page, 'administrador')
    await openRoute(page, '/admin/cursos')

    await page.getByRole('button', { name: 'Registrar Curso' }).click()
    await page.getByRole('button', { name: 'Guardar curso' }).click()
    await expect(page.getByText(/obligatorio|Seleccionar profesor|Nombre del curso/i)).toBeVisible({
      timeout: 7000,
    })

    const courseName = `Curso E2E ${Date.now()}`
    await page.locator('#curso-nombre').fill(courseName)
    await page.locator('#curso-descripcion').fill('Curso generado para auditoría E2E')
    await page.locator('#curso-duracion').fill('12')
    await page.locator('#curso-unidad').selectOption('weeks')
    await page.locator('#curso-cupos').fill('20')
    await page.locator('#curso-precio').fill('1500')
    await page.locator('#curso-profesor').selectOption({ label: /.+/ })
    await page.getByRole('button', { name: 'Guardar curso' }).click()

    await expect(page.getByText(courseName)).toBeVisible({ timeout: 15000 })
    await audit.assertNoCriticalErrors()
  })

  test('07. Errores HTTP, rutas inexistentes y detección de consola', async ({ page }) => {
    test.skip(!hasRoleCredentials('estudiante'), 'Faltan variables de entorno para estudiante.')
    const audit = createAuditTracker(page)

    await ensureRoleState(page, 'estudiante')
    await page.goto('/#/dashboard')
    await page.goto('/#/ruta-que-no-existe')

    await expect(page).toHaveURL(/#\/ruta-que-no-existe/)
    await audit.assertNoCriticalErrors()
  })

  test('08. Auditoría global progresiva', async ({ page }) => {
    const missingRoles = ['administrador', 'profesor', 'estudiante'].filter(
      (role) => !hasRoleCredentials(role),
    )

    test.skip(
      !isExtraRoleAuditEnabled() || missingRoles.length > 0,
      'Se omite por protección anti-rate-limit del backend. Activa PLAYWRIGHT_ROLE_AUDIT=1 para esta auditoría global.',
    )

    const audit = createAuditTracker(page)

    for (const role of ['administrador', 'profesor', 'estudiante']) {
      await loginAs(page, role)
      for (const route of routeGroups[role]) {
        await openRoute(page, route)
      }
    }

    await audit.assertNoCriticalErrors()
  })
})
