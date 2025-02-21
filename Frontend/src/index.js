import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Usercontext from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Usercontext>
    <App />
    </Usercontext>
  
  </React.StrictMode>
);
