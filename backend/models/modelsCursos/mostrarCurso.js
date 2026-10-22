import dataBase from '../../db/dataBase.js'

export const mostrarCursos = async () => {
  const dataBaseCursos = await dataBase.query(`
    SELECT cu.*, 
    (pro.nombre || ' ' || pro.a_paterno) AS profesor_nombre,
    (cu.fecha_creacion + cu.duracion) AS fecha_fin
    FROM curso cu
    JOIN profesor pro ON pro.id_profesor = cu.id_profesor
    `)
  console.log(dataBaseCursos.rows)
  return dataBaseCursos.rows
}

export const mostrarCursosPorVencer = async () => {
  const informe = await dataBase.query(`
        SELECT 
          id_curso,
          nombre,
          fecha_creacion,
          duracion AS duracion_registrada,
          (fecha_creacion + duracion::INTERVAL)::DATE AS fecha_fin,
          ((fecha_creacion + duracion::INTERVAL)::DATE - CURRENT_DATE) AS dias_restantes
        FROM curso
        WHERE 
            ((fecha_creacion + duracion::INTERVAL)::DATE - CURRENT_DATE) BETWEEN 0 AND 7; 
    `)
  return informe.rows
}
