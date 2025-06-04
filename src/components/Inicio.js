import React from 'react'
import { Link } from 'react-router-dom'
import { ListadoTrabajos } from './ListadoTrabajos'

export const Inicio = () => {
  return (
    <div className="home">
      
      {/* <h1>PROYECTO FINAL</h1><h2 className="title">----<Link to="/contacto">CONTACTO</Link></h2> */}
      
      <section className="last-works">
      {/* <h2 className="heading">Projectos</h2> */}
      <h2> <strong>Materia:</strong>Programación Avanzada y BD</h2>
      <h2> <strong>Profesor:</strong>M. Francisco Paulin</h2>
      <h2> <strong>Alumno:</strong>Mejia Ramos Jesus Alberto</h2>
      <h2> <strong>Alumno:</strong>Valdes Gomez Saul</h2>
      <h2> <strong>Alumno:</strong> Polanco Euan Elias Natanael</h2>
      {/* <p><Link to="/portafolio">Ver todos los proyectos</Link> </p> */}
      {/* <ListadoTrabajos limite="2"/> */}
      </section>
    </div>
  )
}
