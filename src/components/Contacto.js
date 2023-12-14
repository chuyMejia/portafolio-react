import React, { useState } from 'react';

export const Contacto = () => {
  const [nombre, setNombre] = useState('example');
  const [correo, setCorreo] = useState('example@gmail.com');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setNombre(e.target.elements.nombre.value);
    setCorreo(e.target.elements.correo.value);
  };

  return (
    <div className="page">
      <h1 className="heading">Formulario</h1>
      <div className='m_contact'>
        <div className='con'>
          <form className="contact" onSubmit={handleFormSubmit}>
            <input type="text" name="nombre" placeholder="Nombre" defaultValue={nombre} />
            <input type="email" name="correo" placeholder="Correo electrónico" defaultValue={correo} />
            <input type="submit" value="ENVIAR" />
          </form>
        </div>
        <div className='con'>
          <div className="contact-card">
            <h2>DATA</h2>
            <h3>{nombre}</h3>
            <h3>{correo}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
