import React from 'react'

export const Contacto = () => {
  return (
    
    <div className="page">
      <h1 className= "heading">Contacto</h1>
      <form className="contact" action="mailto:jesussoft95@gmail.com">
        <input type="text" placeholder="Nombre"/>

        <input type="text" placeholder="Apellido"/>

        <input type="email" placeholder="email"/>

        <textarea placeholder="contacto"/>

        <input type="submit" value="ENVIAR"/>


      </form>
    </div>
  )
}
