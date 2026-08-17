# Hediye Savaşı — TikTok Bridge

Bu proje oyunu bir web sayfası olarak yayınlar ve TikTok LIVE'daki hediye eventlerini WebSocket ile oyuna aktarır.

## Gerekli ayar
Ortam değişkeni:
- `TIKTOK_USERNAME` = canlı yayın açan TikTok hesabının kullanıcı adı (@ olmadan)

## Çalıştırma
Node.js kurulu bilgisayarda:
1. `npm install`
2. `TIKTOK_USERNAME=hesabiniz npm start`

Windows PowerShell:
`$env:TIKTOK_USERNAME="hesabiniz"; npm start`

Sonra tarayıcıdan `http://localhost:3000` açılır.

## Not
`tiktok-live-connector` resmi TikTok API değildir; TikTok LIVE'ın gerçek zamanlı event akışını kullanan üçüncü taraf bir kütüphanedir. TikTok tarafındaki değişiklikler nedeniyle zaman zaman çalışmayabilir.
