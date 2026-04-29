# 🏎️ TicoAutos - Frontend (Vue.js 3)

## 📌 Descripción del Proyecto
Este es el cliente web principal de la plataforma **TicoAutos**, una aplicación exclusiva para la compra y venta de vehículos premium. Está construido con **Vue.js 3** y utiliza una arquitectura basada en componentes y *composables* para separar limpiamente la interfaz de la lógica de negocio.

## ⚙️ Tecnologías Utilizadas
- **Framework:** Vue.js 3 (Composition API)
- **Enrutador:** Vue Router
- **Estilos:** Vanilla CSS (Archivos Scoped por componente para garantizar aislamiento)
- **Cliente HTTP:** Axios
- **Servidor de Desarrollo:** Vue CLI Service

## 🔄 Flujo de Trabajo y Arquitectura
El frontend sigue un modelo estricto de separación de responsabilidades:

1.  **Componentes (`src/components/`)**: Se encargan exclusivamente de la interfaz de usuario (UI), diseño y captura de eventos del usuario. No contienen lógica de red ni reglas de negocio.
2.  **Composables (`src/composables/`)**: Archivos como `useAuth.js` funcionan como el "cerebro" del componente. Procesan datos, manejan estados reactivos (`ref`, `reactive`), ejecutan validaciones y manejan redirecciones.
3.  **Servicios (`src/services/`)**: Centralizan la interacción con las APIs externas (Laravel Backend, Padrón Microservice, etc.) utilizando Axios.
4.  **Enrutamiento (`src/router/`)**: Define el árbol de navegación de la app. Utiliza *navigation guards* (interceptores) para proteger vistas privadas, validando la existencia de un JWT en el `localStorage`.

### 🔐 Flujo de Autenticación Detallado
- **Registro y Login con Google (Vía Rápida):** 
  - Redirige al servidor backend para generar la URL de OAuth.
  - Al volver, el sistema auto-completa los datos necesarios (pide solo la cédula si es usuario nuevo) e ingresa al usuario inmediatamente, guardando el token JWT.
- **Registro y Login Manual (Doble Candado de Seguridad):** 
  - El usuario ingresa sus datos y se crea con estado "Pendiente". Se envía un correo.
  - Al hacer clic en el botón de confirmación del correo, el usuario es redirigido a `/verify-email?email_token=...`.
  - El componente delega la validación a `useAuth.js`, el cual limpia sesiones previas, contacta al backend para activar la cuenta, y provoca que el backend envíe un SMS (Twilio).
  - El usuario es enviado obligatoriamente de vuelta a `/login` en estado `requires2FA`.
  - Introduce el código SMS y finalmente obtiene acceso (JWT).

## 🚀 Configuración e Instalación

### Requisitos previos
- Node.js y npm instalados.

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run serve
```
El servidor iniciará típicamente en `http://localhost:8080`.

### 3. Compilar para producción
```bash
npm run build
```
