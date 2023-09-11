import React from 'react'
import { Link } from 'react-router-dom'
import { ListadoTrabajos } from './ListadoTrabajos'

export const Inicio = () => {
  return (
    <div className="home">
      <h1>Soy un apasionado desarrollador web con experiencia sólida en
desarrollo y mantenimiento de <strong>sitios web y aplicaciones.</strong> Mi
destreza incluye la creación de interfaces de usuario
funcionales, así como la gestión eficiente de <strong>bases de datos</strong> para
garantizar un rendimiento óptimo. Constantemente estoy
buscando nuevas oportunidades para mejorar mis habilidades
de esta forma ofrecer soluciones</h1>
      <h2 className="title">----<Link to="/contacto">CONTACTO</Link></h2>
      
      <section className="last-works">
      <h2 className="heading">Projectos</h2>
      <p><Link to="/portafolio">Ver todos los proyectos</Link> </p>
      <ListadoTrabajos limite="2"/>
      </section>
    </div>
  )
}
