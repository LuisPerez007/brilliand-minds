import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../../assets/images/logo1.png'

const textoCorto = (valor, limite = 45) => {
  const texto = String(valor || 'Sin información')
  return texto.length > limite ? `${texto.slice(0, limite - 3)}...` : texto
}

const formatearFecha = (valor) => {
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? 'Sin fecha' : fecha.toLocaleDateString('es-BO')
}

const fechaActual = () => new Date().toLocaleString('es-BO')

const dibujarBordePagina = (documento) => {
  const ancho = documento.internal.pageSize.getWidth()
  const alto = documento.internal.pageSize.getHeight()
  documento.setDrawColor(37, 99, 235)
  documento.setLineWidth(0.7)
  documento.roundedRect(6, 6, ancho - 12, alto - 12, 3, 3, 'S')
}

const crearDocumento = (titulo, subtitulo) => {
  const documento = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' })
  const ancho = documento.internal.pageSize.getWidth()

  documento.setFillColor(255, 255, 255)
  documento.rect(0, 0, ancho, documento.internal.pageSize.getHeight(), 'F')
  documento.addImage(logo, 'PNG', 12, 11, 34, 22)

  documento.setTextColor(17, 24, 39)
  documento.setFont(undefined, 'bold')
  documento.setFontSize(16)
  documento.text(titulo, ancho / 2, 19, { align: 'center' })
  documento.setFont(undefined, 'normal')
  documento.setFontSize(8)
  documento.setTextColor(75, 85, 99)
  documento.text('Academia de Robotica y Programacion | POTOSI', ancho / 2, 25, {
    align: 'center',
  })
  documento.text(`Generado: ${fechaActual()}`, ancho / 2, 31, { align: 'center' })
  documento.setFont(undefined, 'bold')
  documento.setFontSize(10)
  documento.setTextColor(30, 64, 175)
  documento.text(subtitulo, 12, 40)

  return documento
}

const finalizarDocumento = (documento, nombreArchivo) => {
  const alto = documento.internal.pageSize.getHeight()
  documento.setDrawColor(219, 234, 254)
  documento.line(12, alto - 16, documento.internal.pageSize.getWidth() - 12, alto - 16)
  documento.setFont(undefined, 'normal')
  documento.setFontSize(7)
  documento.setTextColor(75, 85, 99)
  documento.text('Informe generado por la Academia de Robotica y Programacion', 12, alto - 10)
  documento.save(nombreArchivo)
}

export const generarReporteInscripcionesPdf = ({ tipo, datos, titulo, subtitulo }) => {
  const documento = crearDocumento(titulo, subtitulo)
  const filas = Array.isArray(datos) ? datos : []
  let columnas
  let cuerpo

  if (tipo === 'inscripciones') {
    columnas = ['Fecha', 'Estudiante', 'Curso', 'Profesor', 'Duración', 'Costo']
    cuerpo = filas.map((inscripcion) => [
      formatearFecha(inscripcion.fecha_inscripcion),
      textoCorto(inscripcion.estudiante),
      textoCorto(inscripcion.curso),
      textoCorto(inscripcion.profesor),
      inscripcion.duracion?.hours
        ? `${inscripcion.duracion.hours} horas`
        : inscripcion.duracion?.days
          ? `${inscripcion.duracion.days} días`
          : inscripcion.duracion?.weeks
            ? `${inscripcion.duracion.weeks} semanas`
            : inscripcion.duracion?.months
              ? `${inscripcion.duracion.months} meses`
              : 'N/A',
      inscripcion.costo ? `Bs. ${inscripcion.costo}` : 'Sin costo',
    ])
  } else if (tipo === 'curso') {
    columnas = ['Fecha', 'Estudiante', 'Teléfono']
    cuerpo = filas.map((inscripcion) => [
      formatearFecha(inscripcion.fecha_inscripcion),
      textoCorto(inscripcion.estudiante),
      textoCorto(inscripcion.telefono_estudiante),
    ])
  } else {
    columnas = ['Curso', 'Fecha', 'Estudiante', 'Teléfono']
    cuerpo = filas
      .filter((inscripcion) => inscripcion.estudiante)
      .map((inscripcion) => [
        textoCorto(inscripcion.curso),
        formatearFecha(inscripcion.fecha_inscripcion),
        textoCorto(inscripcion.estudiante),
        textoCorto(inscripcion.telefono_estudiante),
      ])
  }

  documento.setFont(undefined, 'bold')
  documento.setFontSize(8)
  documento.setTextColor(30, 64, 175)
  documento.text(`Total de registros: ${cuerpo.length}`, 260, 40, { align: 'right' })

  autoTable(documento, {
    startY: 46,
    head: [columnas],
    body: cuerpo,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    styles: { fontSize: 8, cellPadding: 3, textColor: [31, 41, 55] },
    margin: { left: 12, right: 12, bottom: 22 },
    didDrawPage: () => dibujarBordePagina(documento),
  })

  finalizarDocumento(documento, `reporte-${tipo}-${Date.now()}.pdf`)
}
