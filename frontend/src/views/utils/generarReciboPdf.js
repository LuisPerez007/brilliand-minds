import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import logo from '../../assets/images/logo1.png'

const generarCodigoRecibo = (idRecibo) => {
  const hoy = new Date()
  const anio = String(hoy.getFullYear()).slice(-2)
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `REC-${String(idRecibo).padStart(5, '0')}-${dia}${mes}${anio}`
}

const formatearFecha = (valor) => {
  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) {
    return new Date().toLocaleString('es-BO')
  }

  return fecha.toLocaleString('es-BO')
}

const textoCorto = (valor, limite) => {
  const texto = String(valor || 'Sin información')
  return texto.length > limite ? `${texto.slice(0, limite - 3)}...` : texto
}

export const generarReciboPdf = async (datos = {}) => {
  try {
    const idRecibo = Number(datos.id_recibo ?? 0)
    const montoPagado = Number(datos.monto_pagado ?? 0)
    const estudianteNombre = datos.estudiante_nombre || datos.estudiante || 'Sin información'
    const estudianteCi = datos.estudiante_ci || datos.ci || 'Sin información'
    const codigoRecibo = generarCodigoRecibo(idRecibo)
    const fechaPago = formatearFecha(datos.fecha_pago)
    const urlVerificacion = datos.token_verificacion
      ? `${window.location.origin}${window.location.pathname}#/verificar-recibo/${datos.token_verificacion}`
      : ''
    const qrContenido = urlVerificacion || codigoRecibo
    const qrDataUrl = await QRCode.toDataURL(qrContenido, { margin: 1, width: 180 })
    const conceptos = Array.isArray(datos.conceptos) ? datos.conceptos : []
    const ancho = 215.9
    const alto = 139.7
    const margen = 9

    const documento = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [ancho, alto] })

    documento.setFillColor(255, 255, 255)
    documento.rect(0, 0, ancho, alto, 'F')
    documento.setDrawColor(37, 99, 235)
    documento.setLineWidth(0.8)
    documento.roundedRect(4, 4, ancho - 8, alto - 8, 4, 4, 'S')
    documento.addImage(logo, 'PNG', margen, 9, 35, 23)

    documento.setTextColor(17, 24, 39)
    documento.setFontSize(15)
    documento.setFont(undefined, 'bold')
    documento.text('RECIBO DE PAGO', 107.95, 18, { align: 'center' })
    documento.setFontSize(7)
    documento.setFont(undefined, 'normal')
    documento.text('Academia de Robotica y Programacion | POTOSI', 107.95, 24, { align: 'center' })
    documento.setTextColor(75, 85, 99)
    documento.text(`Nro. ${codigoRecibo}   |   Fecha: ${fechaPago}`, 107.95, 30, {
      align: 'center',
    })
    documento.addImage(qrDataUrl, 'PNG', 178, 9, 22, 22)

    const dibujarBloque = (x, titulo, filas, anchoBloque) => {
      documento.setFillColor(239, 246, 255)
      documento.setDrawColor(147, 197, 253)
      documento.roundedRect(x, 38, anchoBloque, 27, 2, 2, 'FD')
      documento.setTextColor(30, 64, 175)
      documento.setFontSize(8)
      documento.setFont(undefined, 'bold')
      documento.text(titulo, x + 4, 44)
      documento.setTextColor(31, 41, 55)
      documento.setFontSize(7.5)
      documento.setFont(undefined, 'normal')
      filas.forEach((fila, indice) => {
        documento.text(`${fila[0]}:`, x + 4, 51 + indice * 6)
        documento.setFont(undefined, 'bold')
        documento.text(textoCorto(fila[1], 32), x + 30, 51 + indice * 6)
        documento.setFont(undefined, 'normal')
      })
    }

    dibujarBloque(
      9,
      'DATOS DEL ESTUDIANTE',
      [
        ['Nombre', estudianteNombre],
        ['CI', estudianteCi],
        ['Inscripcion', datos.id_inscripcion ?? 'Sin información'],
      ],
      94,
    )
    dibujarBloque(
      112,
      'DATOS DEL RESPONSABLE',
      [
        ['Nombre', datos.padre_tutor || 'Sin información'],
        ['CI', datos.padre_ci || 'Sin información'],
        ['Pago', 'Efectivo'],
      ],
      94,
    )

    documento.setFillColor(37, 99, 235)
    documento.roundedRect(9, 70, 197, 8, 1.5, 1.5, 'F')
    documento.setTextColor(255, 255, 255)
    documento.setFontSize(8)
    documento.setFont(undefined, 'bold')
    documento.text('CURSOS PAGADOS', 13, 75.5)
    documento.text('MONTO', 190, 75.5, { align: 'right' })

    documento.setTextColor(31, 41, 55)
    documento.setFont(undefined, 'normal')
    documento.setFontSize(7.5)
    const maxLineas = 5
    const conceptosVisibles = conceptos.slice(0, maxLineas)
    conceptosVisibles.forEach((concepto, indice) => {
      const y = 85 + indice * 7
      documento.text(textoCorto(concepto.descripcion || 'Curso', 72), 13, y)
      documento.text(`Bs. ${Number(concepto.monto || 0).toFixed(2)}`, 190, y, { align: 'right' })
      documento.setDrawColor(219, 234, 254)
      documento.line(13, y + 2, 202, y + 2)
    })
    if (conceptos.length > maxLineas) {
      documento.setFontSize(7)
      documento.setTextColor(75, 85, 99)
      documento.text(`+ ${conceptos.length - maxLineas} curso(s) adicional(es)`, 13, 121)
    }

    documento.setFillColor(254, 243, 199)
    documento.setDrawColor(245, 158, 11)
    documento.roundedRect(145, 116, 61, 11, 2, 2, 'FD')
    documento.setTextColor(120, 53, 15)
    documento.setFontSize(8)
    documento.setFont(undefined, 'bold')
    documento.text('TOTAL PAGADO', 149, 121)
    documento.setFontSize(10)
    documento.text(`Bs. ${montoPagado.toFixed(2)}`, 202, 125, { align: 'right' })

    documento.setDrawColor(75, 85, 99)
    documento.setLineWidth(0.35)
    documento.line(12, 122, 68, 122)
    documento.line(77, 122, 133, 122)
    documento.setTextColor(31, 41, 55)
    documento.setFontSize(6.5)
    documento.setFont(undefined, 'normal')
    documento.text('Entregue conforme', 40, 127, { align: 'center' })
    documento.text('Recibi conforme', 105, 127, { align: 'center' })

    documento.setTextColor(75, 85, 99)
    documento.setFontSize(6.5)
    documento.setFont(undefined, 'normal')
    documento.text(
      'Conserve este recibo como constancia de su pago. | Gracias por confiar en la Academia.',
      9,
      133,
    )

    documento.save(`${codigoRecibo}.pdf`)
    return codigoRecibo
  } catch (error) {
    console.error('Error al generar el recibo PDF:', error)
    throw new Error('No se pudo generar el recibo PDF.')
  }
}
