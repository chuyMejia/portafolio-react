import React from 'react'
import { NavLink } from 'react-router-dom'

export const HeaderNav = () => {
  return (
    <header className='header'>
        <div className="logo">
            <span></span>
        <h3>Programación Avanzada y BD</h3>
        </div>
        <nav>
           <ul>
            <li>
               <NavLink to="/inicio" className={({isActive})=>isActive ? "active":"" }>Inicio</NavLink>
            </li>
            <li>
               <NavLink to="/upload" className={({isActive})=>isActive ? "active":"" }>Upload</NavLink>
            </li>
            {/*<li>
               <NavLink to="/servicios" className={({isActive})=>isActive ? "active":"" }>servicios</NavLink>
            </li>
              <li>
               <NavLink to="/curriculum" className={({isActive})=>isActive ? "active":"" }>Listado</NavLink>
            </li>
            <li>
               <NavLink to="/contacto" className={({isActive})=>isActive ? "active":"" }>Formulario</NavLink>
            </li>
            <li>
               <NavLink to="/servicios" className={({isActive})=>isActive ? "active":"" }>Promesa</NavLink>
            </li>
            
            */}
          
          </ul>  
        </nav>
    </header>
  )
}
