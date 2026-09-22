import 'dotenv/config'

const requiredEnv = {
  administrador: ['ADMIN_EMAIL', 'ADMIN_PASSWORD'],
  profesor: ['PROFESOR_EMAIL', 'PROFESOR_PASSWORD'],
  estudiante: ['ESTUDIANTE_EMAIL', 'ESTUDIANTE_PASSWORD'],
}

export const hasRoleCredentials = (role) => {
  const envNames = requiredEnv[role]
  if (!envNames) return false
  return envNames.every((name) => Boolean(process.env[name]))
}

export const getCredentials = (role) => {
  const envNames = requiredEnv[role]

  if (!envNames || !hasRoleCredentials(role)) {
    return null
  }

  return {
    email: process.env[envNames[0]],
    password: process.env[envNames[1]],
  }
}

export const isControlledCrudEnabled = () =>
  String(process.env.PLAYWRIGHT_CRUD || '').trim() === '1'

export const isExtraRoleAuditEnabled = () =>
  String(process.env.PLAYWRIGHT_ROLE_AUDIT || '').trim() === '1'
