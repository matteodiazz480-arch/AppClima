# Nimbus Weather 🌤️

Aplicación de clima para Android e iOS construida con **React Native + Expo**. Muestra el clima actual, pronóstico por hora y por día, y funciones extra (mascotas, modo viaje, notificaciones) usando la API pública y gratuita de **[Open-Meteo](https://open-meteo.com/)** — sin API key, sin costo.

Todo el código vive en [`frontend/`](./frontend). Esta app no tiene backend propio: corre entera en el dispositivo y consulta directamente la API de Open-Meteo.

## Índice

- [¿Qué hace la app?](#qué-hace-la-app)
- [Pantallas](#pantallas)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Cómo correrla](#cómo-correrla)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Generar un build instalable (APK / AAB)](#generar-un-build-instalable-apk--aab)

## ¿Qué hace la app?

Al abrir la app, pide permiso de ubicación y muestra el clima de donde estás en tiempo real, con un diseño inspirado en el clima de iOS: fondo animado (nubes, lluvia, nieve o estrellas según las condiciones reales), ícono animado del clima, y tarjetas con información detallada.

## Pantallas

- **Clima** — clima actual (temperatura, sensación térmica, humedad, presión, visibilidad, viento, UV, probabilidad de lluvia), pronóstico por hora (24h) y por día (7 días), aviso de "va a llover en X minutos", índice de comodidad, sugerencia de qué ropa llevar, actividades recomendadas y avisos para conducir.
- **Buscar** — búsqueda de cualquier ciudad del mundo con autocompletado, para ver su clima al instante.
- **Más**:
  - **Clima para mascotas** — nivel de actividad recomendado, mejor horario para pasear (calculado con el amanecer/atardecer real) y cuidados según la temperatura.
  - **Modo viaje** — elegís origen y destino, el día del viaje (hasta 16 días), y te muestra el clima esperado, ropa recomendada y comparación con tu ciudad actual.
- **Notificaciones** — la app envía una notificación local diaria con el clima y, si corresponde, advertencias (lluvia próxima, heladas, ola de calor, tormentas, viento intenso).

## Tecnologías

- [Expo](https://expo.dev/) (SDK 57) + [Expo Router](https://docs.expo.dev/router/introduction/)
- React Native + TypeScript
- [TanStack Query](https://tanstack.com/query) para el manejo de datos remotos
- [Open-Meteo](https://open-meteo.com/) (clima y geocodificación) — gratis, sin API key
- Axios, React Native Reanimated, Async Storage, Expo Notifications, Expo Location

## Instalación

### Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Un teléfono con la app **[Expo Go](https://expo.dev/go)** instalada (Android o iOS), **o** un emulador de Android / simulador de iOS

### Pasos

```bash
git clone <url-de-este-repositorio>
cd "Aplicacion Clima/frontend"
npm install
```

## Cómo correrla

```bash
npx expo start
```

Esto abre una terminal con un código QR:

- **Con tu celular:** escaneá el QR con la cámara (iOS) o desde la app Expo Go (Android). La app se abre al instante, sin instalar nada más.
- **Con emulador:** con el servidor corriendo, presioná `a` (Android) o `i` (iOS) en la terminal.

Al abrirla, la app va a pedir permiso de ubicación (para mostrar el clima de donde estás) y permiso de notificaciones (para los avisos diarios de clima).

> **Nota:** las notificaciones push solo funcionan en un *development build* o en la app publicada — en Expo Go, Android las deshabilita desde el SDK 53, así que la app lo detecta automáticamente y no rompe nada, simplemente no las envía.

## Estructura del proyecto

```
frontend/
├── app/                  # Rutas de Expo Router (pantallas)
│   ├── (tabs)/           # Clima, Buscar, Más (con barra de tabs)
│   ├── city.tsx          # Clima de una ciudad buscada
│   ├── pets.tsx          # Clima para mascotas
│   └── trip.tsx          # Modo viaje
├── src/
│   ├── components/       # Componentes de UI reutilizables
│   ├── constants/        # Colores, gradientes, mapeo de códigos de clima
│   ├── hooks/            # Hooks (clima, ubicación, búsqueda, notificaciones)
│   ├── services/         # Llamadas a Open-Meteo y almacenamiento local
│   ├── types/            # Tipos de TypeScript
│   └── utils/            # Lógica de negocio (comodidad, mascotas, viaje, alertas)
├── assets/               # Ícono, splash y demás imágenes de la app
├── app.json              # Configuración de Expo (nombre, ícono, permisos)
└── eas.json              # Perfiles de build para EAS Build
```

## Scripts disponibles

Corriendo dentro de `frontend/`:

| Comando           | Qué hace                                  |
| ------------------ | ------------------------------------------ |
| `npm start`         | Inicia el servidor de desarrollo de Expo   |
| `npm run android`   | Inicia y abre en un emulador/dispositivo Android |
| `npm run ios`       | Inicia y abre en un simulador/dispositivo iOS |
| `npm run web`       | Inicia la versión web (experimental)        |

## Generar un build instalable (APK / AAB)

`expo start` y `expo export` no generan un instalador real, solo sirven para desarrollo. Para obtener un `.apk` (instalable directo) o `.aab` (para subir a Play Store), se usa [EAS Build](https://docs.expo.dev/build/introduction/), el servicio gratuito de Expo:

```bash
npm install -g eas-cli
eas login          # requiere una cuenta gratis en expo.dev
eas init            # vincula el proyecto a tu cuenta (una sola vez)

# APK para instalar directo en un celular, sin pasar por ninguna tienda:
eas build --platform android --profile preview

# AAB para publicar en Google Play Store:
eas build --platform android --profile production
```

Al terminar (~15-20 minutos, corre en los servidores de Expo), te da un link de descarga del archivo.
