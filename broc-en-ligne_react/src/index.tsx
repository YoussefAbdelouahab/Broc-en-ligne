import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./style/index.scss";
import { BrowserRouter } from 'react-router-dom';
import { frFR } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const lang = createTheme(frFR);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={lang}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

