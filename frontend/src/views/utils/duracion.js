export const mostrarDuracion = (duracion) => {
  if (!duracion) {
    return ''
  }

  if (duracion.months !== undefined) {
    const numero = duracion.months
    return `${numero} ${numero === 1 ? 'mes' : 'meses'}`
  }

  if (duracion.weeks !== undefined) {
    const numero = duracion.weeks
    return `${numero} ${numero === 1 ? 'semana' : 'semanas'}`
  }

  if (duracion.days !== undefined) {
    const numero = duracion.days
    return `${numero} ${numero === 1 ? 'día' : 'días'}`
  }

  return ''
}
