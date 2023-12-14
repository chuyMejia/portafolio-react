
import React, { useState } from 'react';

export const Servicios = () => {

  const [datos, setDatos] = useState();
  const [datos2, setDatos2] = useState([]);

  function fetchData() {
    return new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users?page=2')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error de red - ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          resolve(data);
          alert(data.data[0].email);
          setDatos(data.data[0].email);
         console.log(data.data[0].email);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function data(){

    alert('fffssjhgg');
  }

  return (
    <div className="page">
      <h1 className= "heading">Promesa async</h1>
      <h3>Integra una llamada a una API en un componente de React y muestra los datos obtenidos.</h3>
      <section className="sevices">

        <hr></hr>

        <button onClick={fetchData}>Realizar Peticion</button>
        <p>{datos}</p>
        
      

      </section>
    </div>
  )
}
