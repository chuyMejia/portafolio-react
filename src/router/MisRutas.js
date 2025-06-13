import React from 'react'
import { Routes,Route,BrowserRouter,Navigate } from "react-router-dom";
import { Contacto } from '../components/Contacto';
import { Curriculum } from '../components/Curriculum';
import { Inicio } from "../components/Inicio";
import { Footer } from '../components/layout/Footer';
import { HeaderNav } from '../components/layout/HeaderNav';
import { Upload } from '../components/Upload';
import { Proyecto } from '../components/Proyecto';
import { Servicios } from '../components/Servicios';
import MemoramaFrases from '../components/Memorama';




export const MisRutas = () => {
  return (
    <BrowserRouter>
        {/*header y navegacion*/}
        <HeaderNav></HeaderNav>
        {/*contenido*/}
        <section className="content">
        <Routes>
         <Route path="/" element={<Navigate to="/inicio"/>}></Route>
         <Route path="/inicio" element={<Inicio/>}></Route>
         <Route path="/Upload" element={<Upload/>}></Route>
         <Route path="/Memorama" element={<MemoramaFrases/>}></Route>
         <Route path="/servicios" element={<Servicios/>}></Route>
         <Route path="/curriculum" element={<Curriculum/>}></Route>
         <Route path="/contacto" element={<Contacto/>}></Route>
         <Route path="/proyecto/:id" element={<Proyecto/>}></Route>
         <Route path="*" element={
           <div className="page"><h1 className="heading">Error 404</h1></div>
         
         
         }></Route>

        </Routes>
        </section>
        {/*footer*/}
        <Footer></Footer>

    </BrowserRouter>
  )
}
