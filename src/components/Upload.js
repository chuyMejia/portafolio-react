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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Upload = () => {
  const [archivos, setArchivos] = useState([]);

  const [titulosGlobales, setTitulosGlobales] = useState({});
  const [autoresGlobales, setAutoresGlobales] = useState({});
  const [citasGlobales, setCitasGlobales] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState([]);

  // Estados para paginación por bloque
  const [paginaTitulos, setPaginaTitulos] = useState('global'); // 'global' o 'porDocumento'
  const [paginaAutores, setPaginaAutores] = useState('global'); // 'global' o 'porDocumento'
  const [paginaCitas, setPaginaCitas] = useState('global');     // 'global' o 'porDocumento'
  const [paginaEditoriales, setPaginaEditoriales] = useState('global'); // nuevo

  // Funciones existentes para extraer títulos, autores y citas
  const extraerTitulosReferencias = (texto) => {
    const regex = /\(\d{4}(?:, [a-zA-Z]+)?\)\.\s*(.+?)(?:\n|\. https?:)/g;
    const titulos = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
      const titulo = match[1].replace(/\s+/g, ' ').trim();
      if (titulo) titulos.push(titulo);
    }
    return titulos;
  };

  const extraerAutoresReferencias = (texto) => {
    const regex = /^([^\n(]+?)\s*\(\d{4}(?:, [a-zA-Z]+)?\)/gm;
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
   // let globalEditoriales = {};
    const porArchivoDatos = [];

    for (const archivo of archivos) {
      const texto = await archivo.text();

      const titulos = extraerTitulosReferencias(texto);
      const autores = extraerAutoresReferencias(texto);
      const citas = extraerCitas(texto);
      //const editoriales = extraerEditoriales(texto);

      const titulosContados = contarFrecuencias(titulos);
      const autoresContados = contarFrecuencias(autores);
      const citasContadas = contarFrecuencias(citas);
    //  const editorialesContadas = contarFrecuencias(editoriales);

      for (const [titulo, cant] of Object.entries(titulosContados)) {
        globalTitulos[titulo] = (globalTitulos[titulo] || 0) + cant;
      }
      for (const [autor, cant] of Object.entries(autoresContados)) {
        globalAutores[autor] = (globalAutores[autor] || 0) + cant;
      }
      for (const [cita, cant] of Object.entries(citasContadas)) {
        globalCitas[cita] = (globalCitas[cita] || 0) + cant;
      }
      // for (const [editorial, cant] of Object.entries(editorialesContadas)) {
      //   globalEditoriales[editorial] = (globalEditoriales[editorial] || 0) + cant;
      // }

      porArchivoDatos.push({
        nombre: archivo.name,
        titulos: titulosContados,
        autores: autoresContados,
        citas: citasContadas
     //: editorialesContadas,
      });
    }

    setTitulosGlobales(globalTitulos);
    setAutoresGlobales(globalAutores);
    setCitasGlobales(globalCitas);
    // setEditorialesGlobales(globalEditoriales);
    setDatosPorArchivo(porArchivoDatos);
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
  
  
  const maxLen = 20;

const truncarNombre = (nombre, sufijo, index) => {
  const base = nombre.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");
  const truncado = base.substring(0, maxLen);
  return `${truncado}_${sufijo}_${index}`;
};

  

  const prepararDatosGrafica = (obj) => {
    const ordenados = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    return {
      labels: ordenados.map((item) => item[0]),
      datasets: [
        {
          label: 'Cantidad',
          data: ordenados.map((item) => item[1]),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
      ],
    };
  };

  const opcionesGrafica = (titulo) => ({
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: titulo,
        font: { size: 16, weight: 'bold' },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
    },
  });

  return (
    <div className="page">
      <h1>Subir Archivos TXT</h1>
      <input type="file" accept=".txt" multiple onChange={manejarCambioArchivos} />

      {archivos.length > 0 && (
        <>
          <h4>Archivos seleccionados:</h4>
          <ul className="archivos-lista">
            {archivos.map((a, i) => (
              <li key={i}>{a.name}</li>
            ))}
          </ul>
          <button onClick={manejarEnvio}>Analizar Archivos</button>
        </>
      )}
{/* 
      {(
        // Object.keys(editorialesGlobales).length > 0) && (
        <div style={{ marginTop: 20 }}>
          <button onClick={exportarExcel}>Exportar a Excel</button>
        </div>
      )} */}

{datosPorArchivo.length > 0 && (
  <div style={{ marginTop: 20 }}>
    <button onClick={exportarPorDocumentoExcel}>Exportar Conteos (Global + por Documento) a Excel</button>
  </div>
)}


      {/* BLOQUE TÍTULOS */}
      <section className="seccion-contenedor">
        <h3>Títulos en referencias:</h3>
        <div className="botones-paginacion">
          <button
            className={paginaTitulos === 'global' ? 'activo' : ''}
            onClick={() => setPaginaTitulos('global')}
          >
            Globales
          </button>
          <button
            className={paginaTitulos === 'porDocumento' ? 'activo' : ''}
            onClick={() => setPaginaTitulos('porDocumento')}
          >
            Por Documento
          </button>
        </div>
        {paginaTitulos === 'global' && (
          <div className="contenido-flex">
            <div className="lista-contenedor">
              <ul>
                {Object.entries(titulosGlobales)
                  .sort((a, b) => b[1] - a[1])
                  .map(([titulo, cant], i) => (
                    <li key={i}>
                      {titulo} ({cant})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="grafica-contenedor">
              <Bar
                options={opcionesGrafica('Títulos más frecuentes (Global)')}
                data={prepararDatosGrafica(titulosGlobales)}
              />
            </div>
          </div>
        )}
        {paginaTitulos === 'porDocumento' && (
          <div className="lista-archivos">
            {datosPorArchivo.map(({ nombre, titulos }) => (
              <details key={nombre} className="archivo-detalle">
                <summary>{nombre}</summary>
                <ul>
                  {Object.entries(titulos)
                    .sort((a, b) => b[1] - a[1])
                    .map(([titulo, cant], i) => (
                      <li key={i}>
                        {titulo} ({cant})
                      </li>
                    ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* BLOQUE AUTORES */}
      <section className="seccion-contenedor">
        <h3>Autores en referencias:</h3>
        <div className="botones-paginacion">
          <button
            className={paginaAutores === 'global' ? 'activo' : ''}
            onClick={() => setPaginaAutores('global')}
          >
            Globales
          </button>
          <button
            className={paginaAutores === 'porDocumento' ? 'activo' : ''}
            onClick={() => setPaginaAutores('porDocumento')}
          >
            Por Documento
          </button>
        </div>
        {paginaAutores === 'global' && (
          <div className="contenido-flex">
            <div className="lista-contenedor">
              <ul>
                {Object.entries(autoresGlobales)
                  .sort((a, b) => b[1] - a[1])
                  .map(([autor, cant], i) => (
                    <li key={i}>
                      {autor} ({cant})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="grafica-contenedor">
              <Bar
                options={opcionesGrafica('Autores más frecuentes (Global)')}
                data={prepararDatosGrafica(autoresGlobales)}
              />
            </div>
          </div>
        )}
        {paginaAutores === 'porDocumento' && (
          <div className="lista-archivos">
            {datosPorArchivo.map(({ nombre, autores }) => (
              <details key={nombre} className="archivo-detalle">
                <summary>{nombre}</summary>
                <ul>
                  {Object.entries(autores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([autor, cant], i) => (
                      <li key={i}>
                        {autor} ({cant})
                      </li>
                    ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* BLOQUE CITAS */}
      <section className="seccion-contenedor">
        <h3>Citas en el texto:</h3>
        <div className="botones-paginacion">
          <button
            className={paginaCitas === 'global' ? 'activo' : ''}
            onClick={() => setPaginaCitas('global')}
          >
            Globales
          </button>
          <button
            className={paginaCitas === 'porDocumento' ? 'activo' : ''}
            onClick={() => setPaginaCitas('porDocumento')}
          >
            Por Documento
          </button>
        </div>
        {paginaCitas === 'global' && (
          <div className="contenido-flex">
            <div className="lista-contenedor">
              <ul>
                {Object.entries(citasGlobales)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cita, cant], i) => (
                    <li key={i}>
                      {cita} ({cant})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="grafica-contenedor">
              <Bar
                options={opcionesGrafica('Citas más frecuentes (Global)')}
                data={prepararDatosGrafica(citasGlobales)}
              />
            </div>
          </div>
        )}
        {paginaCitas === 'porDocumento' && (
          <div className="lista-archivos">
            {datosPorArchivo.map(({ nombre, citas }) => (
              <details key={nombre} className="archivo-detalle">
                <summary>{nombre}</summary>
                <ul>
                  {Object.entries(citas)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cita, cant], i) => (
                      <li key={i}>
                        {cita} ({cant})
                      </li>
                    ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>

     

      <style>{`
        .page {
          padding: 20px;
          max-width: 900px;
          margin: auto;
          font-family: Arial, sans-serif;
        }
        .archivos-lista {
          list-style: none;
          padding-left: 0;
          margin-bottom: 10px;
        }
        .archivos-lista li {
          margin-bottom: 3px;
        }
        button {
          cursor: pointer;
          padding: 6px 12px;
          margin-right: 5px;
          border: 1px solid #007bff;
          background-color: #fff;
          color: #007bff;
          border-radius: 4px;
          font-weight: 600;
        }
        button.activo {
          background-color: #007bff;
          color: #fff;
        }
        .seccion-contenedor {
          margin-top: 30px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .botones-paginacion {
          margin-bottom: 10px;
        }
        .contenido-flex {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .lista-contenedor {
          flex: 1 1 300px;
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          background: #fafafa;
        }
        .lista-contenedor ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }
        .lista-contenedor li {
          margin-bottom: 4px;
        }
        .grafica-contenedor {
          flex: 1 1 400px;
          max-width: 450px;
        }
        .lista-archivos details {
          margin-bottom: 10px;
          border: 1px solid #ccc;
          padding: 8px;
          border-radius: 4px;
          background: #f9f9f9;
        }
        .lista-archivos summary {
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
