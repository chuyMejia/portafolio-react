import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
//const root = ReactDOM.createRoot(document.getElementById('root'));

const conteiner = document.getElementById("root");
const root = createRoot(conteiner);


root.render(<App />);


