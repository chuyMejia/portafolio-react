import React from 'react'

export const Contacto = () => {
  return (

    <div className="page">
      <h1 className="heading">Contacto</h1>
      <div className='m_contact'>
        <div className='con'>
          <form className="contact" action="mailto:jesussoft95@gmail.com">
            <input type="text" placeholder="Nombre" />

            <input type="text" placeholder="Apellido" />

            <input type="email" placeholder="email" />

            <textarea placeholder="contacto" />

            <input type="submit" value="ENVIAR" />


          </form>


        </div>
        <div className='con'>
        <div className="contact-card">
              <h2>Datos de Contacto</h2>
              <p>Nombre: Jesus Alberto MejiaRamos</p>
              <p>Correo Electrónico: jesussoft95@gmail.com</p>
              <p>Teléfono: (55)71967446</p>
              <p>Dirección: Queretaro,Queretaro</p>
            </div>
        
        </div>




      </div>

    </div>
  )
}
