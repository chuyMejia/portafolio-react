import React from 'react'

export const Curriculum = () => {
  const pdfUrl = 'images/CV_JESUS_MEJIA_2023.pdf';
  return (
    <div className="page">
      <h1 className="heading">Curriculum</h1>
      <div className='c_index'>
        <h1>Mejia Ramos Jesus Alberto</h1>
        <p>Soy un apasionado desarrollador web con experiencia sólida en
          desarrollo y mantenimiento de sitios web y aplicaciones. Mi
          destreza incluye la creación de interfaces de usuario
          funcionales, así como la gestión eficiente de bases de datos para
          garantizar un rendimiento óptimo. Constantemente estoy
          buscando nuevas oportunidades para mejorar mis habilidades
          de esta forma ofrecer soluciones
        </p>


       
        <div className='columns'>
          <div className="column">
          <h2>EXPERIENCIA</h2>
            <h3><strong>Impulse Telecom,Queretaro:</strong> Desarrollador ‘A’</h3>
            <p>DICIEMBRE DEL 2021-PRESENTE</p>
            <ul>
              <li>Desarrollo de aplicativos bajo requerimiento</li>
              <li>Creación de objetos de bases de datos</li>
              <li>Soporte a aplicativos (troubleshooting)</li>
              <li>Consumo y creación de API’S</li>
            </ul>
            <h3><strong>Pilgrims,Querétaro</strong> Analista servidores</h3>
            <p>JUNIO DEL 2021 DICIEMBRE DEL 2021</p>
            <ul>
              <li>Migración de servidores</li>
              <li>Creacion de servidores (windows server)</li>
              <li>Protección de doble autenticación MFA</li>
              <li>Soporte a aplicativos (troubleshooting)</li>
            </ul>
            <h2>FORMACIÓN</h2>
            <h3><strong>Universidad autónoma de Querétaro(UAQ),Querétaro: título -2020</strong></h3>
            <p>Licenciado en Ingeniería de software especialidad en Base de datos.</p>
            
          </div>
          <div className="column">
          <h2>HABILIDADES TÉCNICAS</h2>
            <ul>
              <li>Lenguajes de programación:<strong>HTML,CSS,JAVASCRIPT,PHP</strong></li>
              <li>Frameworks:<strong> React,Angular,Laravel</strong></li>
              <li>Base de datos:<strong>:Oracle,MySql,MongoDb</strong></li>
              <li>Api’s:<strong>Node.js,Express,Fs,Body-Parser</strong></li>
              
              
            </ul>
            <h2>CERTIFICACIONES,CURSOS</h2>
            <ul>
              <li>ANGULAR,JAVASCRIPT<strong>(Udemy)</strong></li>
              <li>PLSQL-ORACLE<strong> (Diplomado UAQ)</strong></li>
              <li>PYTHON<strong> (Curso UAQ)</strong></li>           
            </ul>

            <h2>IDIOMAS</h2>
            <ul>
              <li> Español (Nativo)</li>
              <li> Ingles(TOEFL)</li>
              
            </ul>

            <a href={pdfUrl} download="cv_Jesus_Mejia.pdf">
              Descargar Curriculum Vitae
            </a>
        


          </div>
        </div>


        {/*    <h2>conocimiento</h2>
    <h2>educacion</h2>
    <h2>proyectos</h2>
    <h2>certificates</h2>

*/ }

      </div>


    </div>
  )
}
