import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Button, Container, Row, Col, ListGroup, Form, Tabs, Tab, Card } from 'react-bootstrap';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// Registro de componentes Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function generarPDFReporte(data) {
  const doc = new jsPDF();

  doc.text("Reporte de Conteos Globales", 10, 10);

  let currentY = 20;

  if (data.titulosGlobales.length > 0) {
    autoTable(doc, {
      head: [['Título', 'Cantidad']],
      body: data.titulosGlobales,
      startY: currentY,
    });
    currentY = doc.lastAutoTable.finalY + 10;
  }

  if (data.autoresGlobales.length > 0) {
    autoTable(doc, {
      head: [['Autor', 'Cantidad']],
      body: data.autoresGlobales,
      startY: currentY,
    });
    currentY = doc.lastAutoTable.finalY + 10;
  }

  if (data.citasGlobales.length > 0) {
    autoTable(doc, {
      head: [['Cita', 'Cantidad']],
      body: data.citasGlobales,
      startY: currentY,
    });
  }

  doc.save('reporte.pdf');
}

export const Upload = () => {
  const [archivos, setArchivos] = useState([]);
  const [titulosGlobales, setTitulosGlobales] = useState({});
  const [autoresGlobales, setAutoresGlobales] = useState({});
  const [citasGlobales, setCitasGlobales] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState([]);



  const limpiarTitulo = (titulo) => {
    return titulo.replace(/[^\w\sÁÉÍÓÚÑáéíóúñ.,:;¿?¡!()-]/g, '').trim();
  };

  // Regex y extracción

/*ENTRADA

Este es un texto con referencias bibliográficas:

Smith, J. (2020). Understanding React and its applications [Libro].
Johnson, A. (2019). Advanced patterns in JavaScript. https://example.com
Williams, M. (2021). A comprehensive guide to data structures. 
Martinez, L. (2018). El desarrollo sostenible en Latinoamérica [Artículo].

Otra línea sin referencias.



*************FUNCTION  const extraerTitulosReferencias = (texto) => *************


SALIDA


[
  "Understanding React and its applications",     
  "Advanced patterns in JavaScript",             
  "A comprehensive guide to data structures",     
  "El desarrollo sostenible en Latinoamérica"     
]


*/






const extraerTitulosReferencias = (texto) => {
  const regex = /(?:\(\d{4}\)\.\s*)([^.\n\[\]]{5,}?)\s*(?=\[|https?:\/\/|\. )/gm;
  const titulos = [];
  let match;
  /**
   * 
   *  /*
  
  /(?:\(\d{4}\)\.\s*)          # Busca (4 dígitos), seguido de un punto y espacio, pero no lo captura (?:)
([^.\n\[\]]{5,}?)           # Captura texto que no tenga punto, salto línea, corchetes, al menos 5 caracteres (titulo)
\s*                         # Posibles espacios en blanco
(?=\[|https?:\/\/|\. )      # Mira hacia adelante para encontrar [ o "http(s)://" o un punto seguido de espacio
/gm                         # global + multiline



  
  
  
  */
   

  while ((match = regex.exec(texto)) !== null) {
    //Cuando usas una expresión regular con la bandera g (global), el método exec() recuerda dónde quedó la última búsqueda
    let titulo = match[1].trim();

    if (titulo && !titulo.toLowerCase().startsWith("https")) {
      titulo = limpiarTitulo(titulo); // 🧼 APLICAR LIMPIEZA
      titulos.push(titulo);
    }
  }

  return titulos;
};



/**Esta función sirve para extraer solo la parte del texto que corresponde a las referencias, descartando el resto del documento.
 * 
 * ENTRADA
 * Introducción al documento.
Aquí va el contenido principal.

REFERENCIAS BIBLIOGRÁFICAS
- Pérez, J. (2020). Libro sobre React.
- Gómez, A. (2019). Artículo sobre JavaScript.
 * 
 * SALIDA
 * 
 * REFERENCIAS BIBLIOGRÁFICAS
- Pérez, J. (2020). Libro sobre React.
- Gómez, A. (2019). Artículo sobre JavaScript.
 * 
 * 
 */
const obtenerTextoReferencias = (texto) => {
  const inicio = texto.indexOf("REFERENCIAS BIBLIOGRÁFICAS");//ENCUNTRA EL INDICE DONDE EMPIEZA EL REFERENCIAS BIBLIOGRÁFICAS
  if (inicio === -1) return '';//SI NO ENEUNTRA REGRESA VACIO
  return texto.slice(inicio);// LO PARTE SOLO PARA ANLIZAR LAS REFERENCIAS 

};

const extraerAutoresReferencias = (texto) => {
  const referencias = obtenerTextoReferencias(texto); //SOLO LE PASA EL TEXTO CON LAS REFERECIAS
  const regex = /^([A-ZÁÉÍÓÚÑ][\w\s.,\-&]+?)\s*\(\d{4}\)/gm;
  const autores = [];
  let match;

  while ((match = regex.exec(referencias)) !== null) {
    //Cuando usas una expresión regular con la bandera g (global), el método exec() recuerda dónde quedó la última búsqueda
    const autor = match[1].trim();
    if (
      autor &&
      !autor.toLowerCase().startsWith("https") &&//VERIFICA QUE NO SEA NULO
      autor.length > 3//VERIFICA QUE LA CADENA SE MAYOR  A 3 CARACTERES 
    ) {
      autores.push(autor);
    }
  }


  /**
   * SALIDA
   * 
   * [
  "García Márquez, J.",
  "Pérez, L. & Gómez, R.",
  "Fernández, A."
]

   * 
   */

  return autores;
};

  const extraerCitas = (texto) => {
    const regex = /\([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+, \d{4}\)/g;
    const citas = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
      citas.push(match[0]);
    }
    return citas;
  };

  const manejarCambioArchivos = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };


  //ENTRADA  contarFrecuencias(["manzana", "pera", "manzana", "uva", "pera", "manzana"])
/*
.reduce() recorre el array y acumula resultados.


*/
  const contarFrecuencias = (arr) => {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;//acc[item] || 0: si el ítem ya existe en el acumulador, se usa su valor; si no, se usa 0
      return acc;
    }, {});
  };
  /**
   * Salida
   * 
   * {
  manzana: 3,
  pera: 2,
  uva: 1
}

   * 
   */

  const manejarEnvio = async () => {
    //ACUMULADORES GLOBALES
    let globalTitulos = {};
    let globalAutores = {};
    let globalCitas = {};

    const porArchivoDatos = [];
    /*Esta lista guardará la información separada por cada archivo procesado. Para cada archivo se almacenará su nombre y los conteos de títulos, autores y citas encontrados en ese archivo.*/

    for (const archivo of archivos) {
      const texto = await archivo.text();
      //SE LEE EL CONTENIDO DE LOS ARCHIVOS DE FORMA ASINCRONA CUANDO ACABA DE LEER UNO EMPIEZA CON EL OTRO

      const titulos = extraerTitulosReferencias(texto);
      const autores = extraerAutoresReferencias(texto);
      const citas = extraerCitas(texto);

      /*
      [
  "Smith, 2020",
  "Johnson y Lee, 2018",
  "García et al., 2019"
]
      */

      const titulosContados = contarFrecuencias(titulos);
      const autoresContados = contarFrecuencias(autores);
      const citasContadas = contarFrecuencias(citas);

      /*
      titulosContados = {
        'Título A': 2,
        'Título B': 1
      };

      
      */

      /*Object.entries(titulosContados)
      
      const titulosContados = {
  "Título A": 3,
  "Título B": 5,
  "Título C": 1
};


A


[
  ["Título A", 3],
  ["Título B", 5],
  ["Título C", 1]
]

      
      
      */

      for (const [titulo, cant] of Object.entries(titulosContados)) {
        globalTitulos[titulo] = (globalTitulos[titulo] || 0) + cant;
      }
      for (const [autor, cant] of Object.entries(autoresContados)) {
        globalAutores[autor] = (globalAutores[autor] || 0) + cant;
      }
      for (const [cita, cant] of Object.entries(citasContadas)) {
        globalCitas[cita] = (globalCitas[cita] || 0) + cant;
      }
      /*
      titulosContados = { "Título A": 3, "Título B": 2 }
        Object.entries(titulosContados) = [["Título A", 3], ["Título B", 2]]

      
      
      */

      porArchivoDatos.push({
        nombre: archivo.name,
        titulos: titulosContados,
        autores: autoresContados,
        citas: citasContadas,
      });
    }

    setTitulosGlobales(globalTitulos);
    setAutoresGlobales(globalAutores);
    setCitasGlobales(globalCitas);
    setDatosPorArchivo(porArchivoDatos);
  };

  const truncarNombre = (nombre, sufijo, index) => {
    const maxLen = 20;
    const base = nombre.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");
    const truncado = base.substring(0, maxLen);
    return `${truncado}_${sufijo}_${index}`;
  };

  const exportarPorDocumentoExcel = () => {
    const libro = XLSX.utils.book_new();

    // --- HOJA GLOBAL TÍTULOS ---
    const globalTitulos = Object.entries(titulosGlobales).map(([item, cant]) => ({
      Título: item,
      Cantidad: cant,
    }));
    const hojaGlobalTitulos = XLSX.utils.json_to_sheet(globalTitulos);
    XLSX.utils.book_append_sheet(libro, hojaGlobalTitulos, 'Global_Titulos');

    // --- HOJA GLOBAL AUTORES ---
    const globalAutores = Object.entries(autoresGlobales).map(([item, cant]) => ({
      Autor: item,
      Cantidad: cant,
    }));
    const hojaGlobalAutores = XLSX.utils.json_to_sheet(globalAutores);
    XLSX.utils.book_append_sheet(libro, hojaGlobalAutores, 'Global_Autores');

    // --- HOJA GLOBAL CITAS ---
    const globalCitas = Object.entries(citasGlobales).map(([item, cant]) => ({
      Cita: item,
      Cantidad: cant,
    }));
    const hojaGlobalCitas = XLSX.utils.json_to_sheet(globalCitas);
    XLSX.utils.book_append_sheet(libro, hojaGlobalCitas, 'Global_Citas');

    // --- POR ARCHIVO ---
    datosPorArchivo.forEach((archivo, index) => {
      const { nombre, titulos, autores, citas } = archivo;
      const crearHoja = (datos, etiqueta) => {
        const arr = Object.entries(datos).map(([item, cant]) => ({
          [etiqueta]: item,
          Cantidad: cant,
        }));
        return XLSX.utils.json_to_sheet(arr);
      };

      const nombreTit = truncarNombre(nombre, 'Tit', index);
      const nombreAut = truncarNombre(nombre, 'Aut', index);
      const nombreCit = truncarNombre(nombre, 'Cit', index);

      if (Object.keys(titulos).length > 0) {
        XLSX.utils.book_append_sheet(libro, crearHoja(titulos, 'Título'), nombreTit);
      }
      if (Object.keys(autores).length > 0) {
        XLSX.utils.book_append_sheet(libro, crearHoja(autores, 'Autor'), nombreAut);
      }
      if (Object.keys(citas).length > 0) {
        XLSX.utils.book_append_sheet(libro, crearHoja(citas, 'Cita'), nombreCit);
      }
    });

    const buffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'conteos_global_y_por_documento.xlsx');
  };

  const prepararDatosGrafica = (obj) => {
    const ordenados = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: ordenados.map((item) => item[0].substring(0, 30)),
      datasets: [
        {
          label: 'Frecuencia',
          data: ordenados.map((item) => item[1]),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center">ANALISIS REFERENCIAS BIBLIOGRAFICAS</h1>

      <Form.Group controlId="formFileMultiple" className="mb-3" >
        <Form.Label><strong>Selecciona archivos .txt (puedes seleccionar varios)</strong></Form.Label>
        <Form.Control type="file" multiple accept=".txt" onChange={manejarCambioArchivos} />
      </Form.Group>

      {archivos.length > 0 && (
       <Card className="mb-3" style={{ border: '3px solid black' }}>
       <Card.Body>
         <h5>Archivos cargados:</h5>
         <ListGroup>
           {archivos.map((archivo, idx) => (
             <ListGroup.Item key={idx}>{archivo.name}</ListGroup.Item>
           ))}
         </ListGroup>
       </Card.Body>
     </Card>
     
      )}

<div style={{ display: 'flex', gap: '2%' }}>
  <Button
    
    variant="primary"
    onClick={manejarEnvio}
    disabled={archivos.length === 0}
    className="mb-4"
    size="lg"
  >
    Procesar Archivos
  </Button>

  <Button
    variant="danger"
    style={{ border: '3px solid black' }}
    onClick={() =>
      generarPDFReporte({
        titulosGlobales: Object.entries(titulosGlobales),
        autoresGlobales: Object.entries(autoresGlobales),
        citasGlobales: Object.entries(citasGlobales),
      })
    }
    className="mb-4"
    size="lg"
  >
    Exportar reporte PDF
  </Button>

  <Button
    variant="success"
    className="mb-4"
    size="lg"
    onClick={exportarPorDocumentoExcel}
  >
    Exportar Excel Global y por Documento
  </Button>
</div>


      {(Object.keys(titulosGlobales).length > 0 ||
        Object.keys(autoresGlobales).length > 0 ||
        Object.keys(citasGlobales).length > 0) && (
        <>
          <Tabs defaultActiveKey="titulos" className="mb-3" justify>
            <Tab eventKey="titulos" title="Títulos">
              <Row>
                <Col md={6}>
                  <h5>Global (todos los archivos)</h5>
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto',border: '3px solid black' }}>
                    {Object.entries(titulosGlobales)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 20)
                      .map(([titulo, cantidad], idx) => (
                        <ListGroup.Item key={idx}>
                          {titulo.length > 60 ? titulo.substring(0, 57) + '...' : titulo} — {cantidad}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                  <div style={{ marginTop: '20px',border: '3px solid black' }}> 
                    <Bar
                      data={prepararDatosGrafica(titulosGlobales)}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <h5>Por Archivo</h5>
                  {datosPorArchivo.map((archivo, idx) => (
                    <Card key={idx} className="mb-3">
                      <Card.Header>{archivo.nombre}</Card.Header>
                      <ListGroup style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {Object.entries(archivo.titulos)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 10)
                          .map(([titulo, cant], i) => (
                            <ListGroup.Item key={i}>
                              {titulo.length > 60 ? titulo.substring(0, 57) + '...' : titulo} — {cant}
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="autores"  title="Autores">
              <Row>
                <Col md={6}>
                  <h5>Global (todos los archivos)</h5>
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto',border: '3px solid black' }}>
                    {Object.entries(autoresGlobales)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 20)
                      .map(([autor, cantidad], idx) => (
                        <ListGroup.Item key={idx}>
                          {autor.length > 60 ? autor.substring(0, 57) + '...' : autor} — {cantidad}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                  <div style={{ marginTop: '20px',border: '3px solid black' }}>
                    <Bar
                      data={prepararDatosGrafica(autoresGlobales)}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <h5>Por Archivo</h5>
                  {datosPorArchivo.map((archivo, idx) => (
                    <Card key={idx} className="mb-3">
                      <Card.Header>{archivo.nombre}</Card.Header>
                      <ListGroup style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {Object.entries(archivo.autores)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 10)
                          .map(([autor, cant], i) => (
                            <ListGroup.Item key={i}>
                              {autor.length > 60 ? autor.substring(0, 57) + '...' : autor} — {cant}
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="citas" title="Citas">
              <Row>
                <Col md={6}>
                  <h5>Global (todos los archivos)</h5>
                  <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {Object.entries(citasGlobales)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 20)
                      .map(([cita, cantidad], idx) => (
                        <ListGroup.Item key={idx}>
                          {cita} — {cantidad}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                  <div style={{ marginTop: '20px' }}>
                    <Bar
                      data={prepararDatosGrafica(citasGlobales)}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <h5>Por Archivo</h5>
                  {datosPorArchivo.map((archivo, idx) => (
                    <Card key={idx} className="mb-3">
                      <Card.Header>{archivo.nombre}</Card.Header>
                      <ListGroup style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {Object.entries(archivo.citas)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 10)
                          .map(([cita, cant], i) => (
                            <ListGroup.Item key={i}>
                              {cita} — {cant}
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Tab>
          </Tabs>

          
        </>
      )}
    </Container>
  );
};