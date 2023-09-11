import React from 'react'
import { ListadoTrabajos } from './ListadoTrabajos';

export const Portafolio = () => {
  return (
    <div className="page">
      <h1 className= "heading">Portafolio</h1>
      <h3>Algunos de los proyectos realizados</h3>
      <ListadoTrabajos/>     
    </div>
  )
}
