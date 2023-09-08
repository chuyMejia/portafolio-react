import React from 'react'
import { Link } from 'react-router-dom'
import { ListadoTrabajos } from './ListadoTrabajos'

export const Inicio = () => {
  return (
    <div className="home">
      <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Integer finibus fermentum diam,</strong> ac dapibus leo ultricies in. Nam faucibus justo non tristique laoreet. Morbi sit amet ante finibus, rhoncus massa a, accumsan elit. Duis scelerisque vestibulum tristique. Nulla facilisi. Nam dolor odio, tincidunt eget magna a, pretium tincidunt turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut venenatis ipsum elit, sed volutpat ex tincidunt sit amet. Etiam fermentum arcu enim, non dapibus tellus lacinia sit amet.</h1>
      <h2 className="title">consectetur adipiscing elit <Link to="/contacto">CONTACTO</Link></h2>
      
      <section className="last-works">
      <h2 className="heading">Projectos</h2>
      <p>consectetur adipiscing elit. Integer finibus ferment</p>
      <ListadoTrabajos limite="2"/>
      </section>
    </div>
  )
}
