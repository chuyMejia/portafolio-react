import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { trabajos } from '../data/trabajos';

export const Proyecto = () => {
    const [proyecto,setProyecto] = useState({});


    {/*recibo los paramertod*/}
    const params = useParams();

    useEffect(()=>{
        {/*uso hook que se ejecuta solo una vez []*/ }
        let proyecto = trabajos.filter(trabajo => trabajo.id === params.id );

        setProyecto(proyecto[0]);

        console.log(proyecto);
        

    },[])

  return (
    <div className="page page-work">
      <div className="mask">
               {/*<img src={'../public/images/'+trabajo.id+'.png'}></img> */} 
        <img src={"/images/"+proyecto.id+".png"}></img>

      </div>
        <h1 className= "heading">{proyecto.nombre}</h1>
        <p>{proyecto.tecnologias}</p>
        <p>{proyecto.descripcion}</p>
        <a href={"https://"+proyecto.url} target="_blank">IR AL PROYECTO</a>
  
    
  </div>
  )
}
