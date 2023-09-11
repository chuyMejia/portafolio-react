import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { trabajos } from '../data/trabajos';

export const Proyecto = () => {
    const [proyecto,setProyecto] = useState({});


    const params = useParams();

    useEffect(()=>{
        let proyecto = trabajos.filter(trabajo => trabajo.id === params.id );

        setProyecto(proyecto[0]);

        console.log(proyecto);
        

    },[params.id])

  return (
   

    <div className="page page-work">
      <div className="mask">
        <img src={"/images/"+proyecto.id+".png"} alt=""/>

      </div>
        <h1 className= "heading">{proyecto.nombre}</h1>
        <p className='detail-project'>{proyecto.tecnologias}</p>
        
        <h2>Descripción General:</h2>
        <p>{proyecto.descripcion}</p>
        
        
      {proyecto['tecnologias-detail'] && (
        <div>
          <h2>Tecnologías Detalladas:</h2>
          <ul>
            {proyecto['tecnologias-detail'].map((tecnologia, index) => (
              <li key={index}>
                <strong>{tecnologia.nombre}:</strong> {tecnologia.descripcion}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/*<a href={"https://"+proyecto.url} target="_blank">IR AL PROYECTO</a>*/}
      <a href={"https://"+proyecto.url} target="_blank" rel="noreferrer">IR AL PROYECTO</a>

  </div>
  )
}
