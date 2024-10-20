import React from 'react';
import ReactDOM from 'react-dom/client'; // 更新這行
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // 使用 createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
