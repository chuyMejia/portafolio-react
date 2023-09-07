import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { trabajos } from '../data/trabajos';

export const Proyecto = () => {
    {/*recibo los paramertod*/}
    const params = useParams();

    useEffect(()=>{
        {/*uso hook que se ejecuta solo una vez []*/ }
        

    },[])

  return (
    <div className="page">
    <h1 className= "heading">Proyecto: {params.id}</h1>
  
    
  </div>
  )
}
