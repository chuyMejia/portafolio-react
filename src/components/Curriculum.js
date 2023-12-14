import React, { useState } from 'react';

export const Curriculum = () => {
  const [arreglo, setArreglo] = useState(['elemento1','elemento2']);
  const [nuevoElemento, setNuevoElemento] = useState('');

  const agregarElemento = () => {
    setArreglo([...arreglo, nuevoElemento]);
    setNuevoElemento('');
  };

  return (
    <div className="page">
      <h1 className="heading">Listado</h1>
      <h3>2. Implementa un componente de lista en React que reciba un arreglo de elementos y los muestre en una lista.</h3>
      <hr></hr>
      <p>Escriba por favor elemento añadir a la lista</p>
      <input
        type='text'
        value={nuevoElemento}
        onChange={(e) => setNuevoElemento(e.target.value)}
      />
      <button onClick={agregarElemento}>Add</button>

      <ul>
        
        {arreglo.map((elemento, index) => (
          <li key={index}><h2>{elemento}</h2></li>
        ))}
      </ul>
    </div>
  );
};
