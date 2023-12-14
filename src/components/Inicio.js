import React from 'react'
import { Link } from 'react-router-dom'
import { ListadoTrabajos } from './ListadoTrabajos'

export const Inicio = () => {
  return (
    <div className="home">
      <h1>EXAMEN</h1>
      {/* <h2 className="title">----<Link to="/contacto">CONTACTO</Link></h2> */}
      
      <section className="last-works">
      {/* <h2 className="heading">Projectos</h2> */}
      <h3>En este proyecto de REACT se encuentran las respuestas del examen solisitado </h3>
      {/* <p><Link to="/portafolio">Ver todos los proyectos</Link> </p> */}
      {/* <ListadoTrabajos limite="2"/> */}
      </section>
    </div>
  )
}
