import React from 'react'
import { Routes,Route,BrowserRouter,NavLink,Navigate } from "react-router-dom";
import { Contacto } from '../components/Contacto';
import { Curriculum } from '../components/Curriculum';
import { Inicio } from "../components/Inicio";
import { Footer } from '../components/layout/Footer';
import { HeaderNav } from '../components/layout/HeaderNav';
import { Portafolio } from '../components/Portafolio';
import { Proyecto } from '../components/Proyecto';
import { Servicios } from '../components/Servicios';

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
         <Route path="/portafolio" element={<Portafolio/>}></Route>
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
