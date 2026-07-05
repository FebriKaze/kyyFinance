import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import logoSrc from '@/assets/logo.jpeg';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/jpeg';
link.href = logoSrc;
document.head.appendChild(link);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
