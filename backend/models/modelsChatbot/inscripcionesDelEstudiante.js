import dataBase from '../../db/dataBase.js'

export const inscripcionesDelEstudiante = async (id) => {
  const { rows } = await dataBase.query(
    `SELECT cu.id_curso, cu.nombre, ins.id_inscripcion,
       ins.fecha_inscripcion, ins.estado_pago,
       cu.costo,
       COALESCE(p.total_pagado, 0) AS total_pagado,
       COALESCE(p.num_pagos, 0)    AS num_pagos,
       p.ultimo_pago,
       CASE WHEN ins.estado_pago = 'PENDIENTE'
            THEN GREATEST(cu.costo - COALESCE(p.total_pagado, 0), 0)
            ELSE 0
       END AS deuda
      FROM inscripcion ins
      JOIN curso cu ON cu.id_curso = ins.id_curso
      LEFT JOIN (
        SELECT id_inscripcion,
              SUM(monto_pagado) AS total_pagado,
              COUNT(*)          AS num_pagos,
              MAX(fecha_pago)   AS ultimo_pago
        FROM historial_inscripciones
        WHERE id_inscripcion IS NOT NULL
        GROUP BY id_inscripcion
      ) p ON p.id_inscripcion = ins.id_inscripcion
      WHERE ins.id_estudiante = $1
      ORDER BY ins.fecha_inscripcion DESC;`,
    [id]
  )
  return rows
}
