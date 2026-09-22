import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../../assets/images/logo1.png'

const textoCorto = (valor, limite = 58) => {
  const texto = String(valor || 'Sin información')
  return texto.length > limite ? `${texto.slice(0, limite - 3)}...` : texto
}

const formatearFecha = (valor) => {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? 'Sin fecha' : fecha.toLocaleDateString('es-BO')
}

const dibujarBordePagina = (documento) => {
  const ancho = documento.internal.pageSize.getWidth()
  const alto = documento.internal.pageSize.getHeight()
  documento.setDrawColor(37, 99, 235)
  documento.setLineWidth(0.7)
  documento.roundedRect(6, 6, ancho - 12, alto - 12, 3, 3, 'S')
}

export const generarReporteCalificacionesPdf = ({ datos = [], aprobados, reprobados }) => {
  const primeraFila = datos[0]
  const documento = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' })
  const ancho = documento.internal.pageSize.getWidth()
  const alto = documento.internal.pageSize.getHeight()
  const evaluacion = primeraFila?.evaluacion || 'Sin información'
  const curso = primeraFila?.curso || 'Sin información'
  const profesor = primeraFila?.profesor || 'Sin información'
  const descripcion = primeraFila?.descripcion || 'Sin información'
  const porcentaje = primeraFila?.porcentaje ?? 'Sin información'
  const fechaEvaluacion = formatearFecha(primeraFila?.fecha_evaluacion)

  documento.setFillColor(255, 255, 255)
  documento.rect(0, 0, ancho, alto, 'F')
  documento.addImage(logo, 'PNG', 12, 11, 34, 22)
  documento.setTextColor(17, 24, 39)
  documento.setFont(undefined, 'bold')
  documento.setFontSize(16)
  documento.text('REPORTE DE CALIFICACIONES', ancho / 2, 19, { align: 'center' })
  documento.setFont(undefined, 'normal')
  documento.setFontSize(8)
  documento.setTextColor(75, 85, 99)
  documento.text('Academia de Robotica y Programacion | POTOSI', ancho / 2, 25, {
    align: 'center',
  })
  documento.text(`Generado: ${new Date().toLocaleString('es-BO')}`, ancho / 2, 31, {
    align: 'center',
  })
  documento.setFont(undefined, 'bold')
  documento.setFontSize(9)
  documento.setTextColor(30, 64, 175)
  documento.text('Profesor:', 12, 40)
  documento.text('Curso:', 12, 46)
  documento.text('Evaluacion:', 12, 52)
  documento.text('Fecha de examen:', 12, 58)
  documento.text('Ponderacion:', 145, 40)
  documento.text('Aprobados:', 145, 46)
  documento.text('Reprobados:', 145, 52)

  documento.setTextColor(75, 85, 99)
  documento.setFontSize(8)
  documento.setFont(undefined, 'normal')
  documento.text(textoCorto(profesor, 45), 36, 40)
  documento.text(textoCorto(curso, 45), 30, 46)
  documento.text(textoCorto(evaluacion, 42), 40, 52)
  documento.text(fechaEvaluacion, 43, 58)
  documento.text(`${porcentaje}%`, 169, 40)
  documento.text(String(aprobados), 169, 46)
  documento.text(String(reprobados), 169, 52)
  documento.setFont(undefined, 'bold')
  documento.setTextColor(30, 64, 175)
  documento.text('Descripcion:', 145, 58)
  documento.setFont(undefined, 'normal')
  documento.setTextColor(75, 85, 99)
  documento.text(textoCorto(descripcion, 72), 169, 58)

  const resumenAcademico = `Resumen academico: De un total de ${datos.length} estudiantes evaluados en la materia de ${curso}, ${aprobados} ${aprobados === 1 ? 'estudiante obtuvo' : 'estudiantes obtuvieron'} una calificacion superior a 50 puntos y aprobaron la evaluacion, mientras que ${reprobados} ${reprobados === 1 ? 'estudiante no alcanzo' : 'estudiantes no alcanzaron'} la calificacion minima requerida.`
  const lineasResumen = documento.splitTextToSize(resumenAcademico, ancho - 24)
  documento.setFont(undefined, 'normal')
  documento.setTextColor(75, 85, 99)
  documento.text(lineasResumen, 12, 66)

  autoTable(documento, {
    startY: 76,
    head: [['N°', 'Estudiante', 'Nota', 'Observación']],
    body: datos.map((fila, indice) => [
      indice + 1,
      textoCorto(fila.estudiante),
      Number(fila.nota).toFixed(2),
      textoCorto(fila.observacion || 'Sin observación'),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    styles: { fontSize: 8, cellPadding: 3, textColor: [31, 41, 55] },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 78 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 130 },
    },
    margin: { left: 12, right: 12, bottom: 24 },
    didDrawPage: () => dibujarBordePagina(documento),
  })

  documento.setDrawColor(219, 234, 254)
  documento.line(12, alto - 16, ancho - 12, alto - 16)
  documento.setFontSize(7)
  documento.text('Informe generado por la Academia de Robotica y Programacion', 12, alto - 10)
  documento.save(`reporte-calificaciones-${Date.now()}.pdf`)
}
