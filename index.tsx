
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 서비스 워커 등록 (PWA 지원 강화)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 절대 경로 느낌의 등록을 위해 명시적으로 sw.js 호출
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
