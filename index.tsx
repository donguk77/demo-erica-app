
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
    // 보안 컨텍스트(HTTPS) 확인
    if (window.isSecureContext) {
      try {
        /**
         * [오류 수정 핵심] 
         * 1. import.meta.url은 현재 실행 중인 index.tsx의 전체 경로를 가집니다.
         * 2. 이를 기준으로 sw.js의 위치를 찾으면 도메인 불일치(Origin Mismatch)나 
         *    URL 파싱 에러(Invalid URL)를 효과적으로 방지할 수 있습니다.
         */
        const swUrl = new URL('sw.js', import.meta.url).href;
        
        navigator.serviceWorker.register(swUrl, { scope: './' })
          .then(registration => {
            console.log('PWA 서비스 워커 등록 성공:', registration.scope);
          })
          .catch(error => {
            // 보안 정책이나 프레임 제한 환경에서 거부될 수 있으므로 debug 로그로 처리
            console.debug('서비스 워커 등록이 현재 환경에서 제한되었습니다:', error.message);
          });
      } catch (e) {
        // URL 생성 중 예외 발생 시 기본 상대 경로로 최후의 시도
        console.warn('서비스 워커 경로 계산 중 예외 발생, 기본 경로로 시도합니다.');
        navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
      }
    }
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
