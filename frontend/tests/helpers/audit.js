export const createAuditTracker = (page) => {
  const consoleErrors = []
  const pageErrors = []
  const httpErrors = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push({
        message: message.text(),
        url: page.url(),
      })
    }
  })

  page.on('pageerror', (error) => {
    pageErrors.push({
      message: error.message,
      url: page.url(),
    })
  })

  page.on('response', (response) => {
    const status = response.status()
    const url = response.url()

    if (status >= 500 && url.includes('localhost:5000')) {
      httpErrors.push({
        status,
        url,
      })
    }
  })

  return {
    assertNoCriticalErrors: async () => {
      const allErrors = [...consoleErrors, ...pageErrors, ...httpErrors]
      if (allErrors.length > 0) {
        const details = allErrors
          .map((error) => {
            if (error.status) {
              return `HTTP ${error.status} en ${error.url}`
            }
            return `${error.message} (${error.url})`
          })
          .join('\n')

        throw new Error(`Se detectaron errores críticos durante la auditoría:\n${details}`)
      }
    },
    getSummary: () => ({
      consoleErrors,
      pageErrors,
      httpErrors,
    }),
  }
}
