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

  // Regex y extracción
  const extraerTitulosReferencias = (texto) => {
    const regex = /\(\d{4}(?:[a-z]*)?\)\.\s*([^.\n]+(?:\.\s*[^.\n]+)*)/g;
    const titulos = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
      const titulo = match[1].trim();
      if (titulo && !titulo.toLowerCase().startsWith("https")) {
        titulos.push(titulo);
      }
    }
    return titulos;
  };

  const extraerAutoresReferencias = (texto) => {
    const regex = /^([^\n.]+?)\s*(?:\(\d{4}(?:,.*)?\)|\d{4})/gm;
    const autores = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
      const entrada = match[1].replace(/\s+/g, ' ').trim();
      if (entrada) autores.push(entrada);
    }
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

  const contarFrecuencias = (arr) => {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  };

  const manejarEnvio = async () => {
    let globalTitulos = {};
    let globalAutores = {};
    let globalCitas = {};

    const porArchivoDatos = [];

    for (const archivo of archivos) {
      const texto = await archivo.text();

      const titulos = extraerTitulosReferencias(texto);
      const autores = extraerAutoresReferencias(texto);
      const citas = extraerCitas(texto);

      const titulosContados = contarFrecuencias(titulos);
      const autoresContados = contarFrecuencias(autores);
      const citasContadas = contarFrecuencias(citas);

      for (const [titulo, cant] of Object.entries(titulosContados)) {
        globalTitulos[titulo] = (globalTitulos[titulo] || 0) + cant;
      }
      for (const [autor, cant] of Object.entries(autoresContados)) {
        globalAutores[autor] = (globalAutores[autor] || 0) + cant;
      }
      for (const [cita, cant] of Object.entries(citasContadas)) {
        globalCitas[cita] = (globalCitas[cita] || 0) + cant;
      }

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
