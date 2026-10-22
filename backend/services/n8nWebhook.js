export const avisarPagoAN8n = async (datosPago) => {
  const url = process.env.N8N_WEBHOOK_PAGO_URL
  const clave = process.env.N8N_WEBHOOK_KEY

  if (!url) {
    console.warn('N8N_WEBHOOK_PAGO_URL no está configurada, no se envía aviso')
    return
  }

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clave
      },
      body: JSON.stringify(datosPago),
      signal: AbortSignal.timeout(5000)
    })

    if (!respuesta.ok) {
      console.error(`Aviso de pago a n8n falló: HTTP ${respuesta.status}`)
    }
  } catch (error) {
    console.error('No se pudo avisar el pago a n8n:', error.message)
  }
}
