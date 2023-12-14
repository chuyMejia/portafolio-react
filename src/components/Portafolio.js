
import { ListadoTrabajos } from './ListadoTrabajos';
import React, { useEffect, useState } from 'react'

export const Portafolio = () => {
  const [contador,setContador] = useState(0);

 function  modContador(){
      setContador(contador + 1);
  }

  return (
    <div className="page">
      <h1 className= "heading">Contador</h1>
      <h3>1.	Crea un componente funcional en React que renderice un botón y actualice un contador en el estado cada vez que se hace clic en el botón</h3>
      {/* <ListadoTrabajos/>      */}
      <hr></hr>
      <button onClick={modContador} >haz click</button><h1>{contador}</h1>

    </div>
  )
}
