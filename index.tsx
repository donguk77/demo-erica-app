
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 서비스 워커 등록 처리 (PWA 기능 지원)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      /**
       * [오류 수정 핵심] 
       * 현재 창의 location.href를 기준으로 sw.js의 절대 경로를 생성합니다.
       * 이렇게 하면 브라우저가 sw.js를 상위 도메인(ai.studio)이 아닌 
       * 현재 실행 중인 preview 도메인에서 올바르게 찾게 됩니다.
       */
      const swUrl = new URL('./sw.js', window.location.href).href;
      
      navigator.serviceWorker.register(swUrl, { scope: './' })
        .then(registration => {
          console.log('PWA 서비스 워커가 정상 등록되었습니다. 범위:', registration.scope);
        })
        .catch(error => {
          // 보안 정책이나 프레임 제한이 엄격한 환경에서는 설치가 거부될 수 있습니다.
          // 이 경우 경고 메시지만 출력하고 앱 실행은 계속 유지합니다.
          console.warn('서비스 워커 등록이 현재 환경에서 제한되었습니다:', error.message);
        });
    } catch (e) {
      console.error('서비스 워커 설정 중 오류 발생:', e);
    }
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
