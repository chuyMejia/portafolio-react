import React from 'react'
import { NavLink } from 'react-router-dom'

export const HeaderNav = () => {
  return (
    <header className='header'>
        <div className="logo">
            <span>J</span>
        <h3>Jesus Mejia Ramos</h3>
        </div>
        <nav>
           <ul>
            <li>
               <NavLink to="/inicio" className={({isActive})=>isActive ? "active":"" }>Inicio</NavLink>
            </li>
            <li>
               <NavLink to="/portafolio" className={({isActive})=>isActive ? "active":"" }>portafolio</NavLink>
            </li>
            <li>
               <NavLink to="/servicios" className={({isActive})=>isActive ? "active":"" }>servicios</NavLink>
            </li>
            <li>
               <NavLink to="/curriculum" className={({isActive})=>isActive ? "active":"" }>curriculum</NavLink>
            </li>
            <li>
               <NavLink to="/contacto" className={({isActive})=>isActive ? "active":"" }>contacto</NavLink>
            </li>
          </ul>  
        </nav>
    </header>
  )
}
