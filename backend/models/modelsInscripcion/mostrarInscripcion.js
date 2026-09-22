import dataBase from '../../db/dataBase.js'

export const mostrarInscripcion = async () => {
  const datosInscripcion = await dataBase.query(`
    select ins.id_inscripcion, ins.fecha_inscripcion, 
    (es.nombre ||' '||es.a_paterno||' '||es.a_materno) as estudiante, 
    cu.nombre as curso,
    (pro.nombre||' '||pro.a_paterno||' '||pro.a_materno) as profesor,
    cu.duracion, cu.costo
    from inscripcion ins
    join curso  cu on cu.id_curso = ins.id_curso
    join estudiante es on es.id_estudiante = ins.id_estudiante
    join profesor pro on pro.id_profesor = cu.id_profesor
 `)
  return datosInscripcion.rows
}
