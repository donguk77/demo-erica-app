
const CACHE_NAME = 'erica-hub-v3';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.webmanifest',
  'https://cdn.tailwindcss.com',
  'https://img.icons8.com/ios-filled/512/002a5b/graduation-cap.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 개별 파일 추가로 실패 시에도 전체 중단 방지
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // 브라우저 확장 프로그램이나 다른 스키마(chrome-extension 등)는 캐시 무시
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then((response) => {
        // 유효한 응답만 캐시에 저장 고려 (선택 사항)
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
