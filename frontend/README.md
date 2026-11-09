# Frontend - Sistema de Informes Narrativos para A.C.

Frontend React completo para el sistema de generación de informes narrativos para Asociaciones Civiles.

## ✨ Características

- 🔐 **Autenticación** - Sistema de login con JWT
- 📊 **Dashboard** - Resumen general del sistema con estadísticas
- 🏢 **Organizaciones** - CRUD completo de organizaciones A.C.
- 📄 **Documentos** - Upload y procesamiento de PDF, Excel, PowerPoint
- 📝 **Informes** - Generación y visualización de informes narrativos
- 📊 **Diagnósticos** - Análisis FODA y planes estratégicos
- 🎯 **Convocatorias** - Evaluación de compatibilidad con financiamiento
- 📱 **Responsive** - Diseño adaptable a móviles y tablets
- 🎨 **UI Moderna** - Interfaz limpia y profesional

## 🚀 Instalación

### Requisitos

- Node.js 18+
- npm o yarn
- Backend FastAPI ejecutándose en `http://localhost:8000`

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
# .env ya está configurado con la URL del API
# REACT_APP_API_URL=http://localhost:8000/api/v1
```

3. **Iniciar en modo desarrollo**
```bash
npm start
```

La aplicación estará disponible en http://localhost:3000

4. **Construir para producción**
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout.js         # Header y Footer
│   ├── Layout.css
│   └── ProtectedRoute.js # Protección de rutas
├── context/              # Contextos de React
│   └── AuthContext.js    # Autenticación
├── pages/                # Páginas de la aplicación
│   ├── Login.js          # Página de login
│   ├── Dashboard.js      # Dashboard principal
│   ├── Organizations.js  # Lista de organizaciones
│   ├── OrganizationForm.js # Formulario crear/editar
│   ├── OrganizationDetail.js # Detalle de organización
│   ├── Documents.js      # Lista de documentos
│   ├── DocumentUpload.js # Subida de documentos
│   ├── DocumentDetail.js # Detalle de documento
│   ├── Reports.js        # Lista de informes
│   ├── ReportForm.js     # Formulario crear informe
│   ├── ReportDetail.js   # Detalle y visualización
│   ├── Diagnostics.js    # Lista de diagnósticos
│   ├── DiagnosticForm.js # Formulario crear diagnóstico
│   ├── DiagnosticDetail.js # Detalle de diagnóstico
│   ├── Convocatorias.js  # Lista de convocatorias
│   ├── ConvocatoriaForm.js # Formulario crear convocatoria
│   └── ConvocatoriaDetail.js # Detalle y evaluación
├── services/             # Servicios de API
│   └── api.js            # Cliente Axios
├── App.js                # Componente principal con rutas
├── App.css               # Estilos globales
├── index.js              # Punto de entrada
└── index.css             # Estilos base
```

## 🔧 Funcionalidades por Módulo

### Dashboard
- Estadísticas en tiempo real
- Acciones rápidas
- Tarjetas de resumen por módulo

### Organizaciones
- Listado con búsqueda y filtrado
- Crear, editar y eliminar organizaciones
- Vista detallada con documentos e informes relacionados
- Información de contacto y estatus legal

### Documentos
- Subida drag & drop de archivos
- Soporte para PDF, Excel, PowerPoint
- Procesamiento automático con IA
- Visualización de texto extraído
- Análisis con IA

### Informes
- Generación automática con IA
- Múltiples tipos de informes
- Exportación a HTML y PDF
- Visualización formateada
- Impresión

### Diagnósticos
- Análisis FODA automático
- Generación de planes estratégicos
- Visualización de resultados estructurados
- Scores de evaluación
- Recomendaciones personalizadas

### Convocatorias
- Registro de convocatorias de financiamiento
- Evaluación de compatibilidad automática
- Análisis detallado con scores por criterio
- Recomendaciones y factores de riesgo
- Ranking de compatibilidad

## 🎨 Diseño y UI

### Paleta de Colores
- **Primario**: #667eea (azul púrpura)
- **Secundario**: #764ba2 (púrpura)
- **Éxito**: #43e97b (verde)
- **Advertencia**: #ffc107 (amarillo)
- **Error**: #e74c3c (rojo)

### Componentes
- Tarjetas con sombras y hover effects
- Formularios con validación
- Tablas responsivas
- Badges de estado
- Barras de progreso
- Gráficos de scores

## 🔐 Autenticación

El sistema incluye autenticación básica con:
- Login con email y contraseña
- JWT token en localStorage
- Protección de rutas
- Interceptor de Axios para headers
- Redirección automática en caso de token expirado

**Nota**: El backend necesita implementar el endpoint `/api/v1/auth/login` para autenticación real. Actualmente usa un mock para desarrollo.

## 📡 API Endpoints Utilizados

### Organizaciones
- `GET /api/v1/organizations/` - Listar
- `POST /api/v1/organizations/` - Crear
- `GET /api/v1/organizations/{id}` - Obtener
- `PUT /api/v1/organizations/{id}` - Actualizar
- `DELETE /api/v1/organizations/{id}` - Eliminar

### Documentos
- `GET /api/v1/documents/` - Listar
- `POST /api/v1/documents/` - Subir
- `GET /api/v1/documents/{id}` - Obtener
- `POST /api/v1/documents/{id}/process` - Procesar
- `DELETE /api/v1/documents/{id}` - Eliminar

### Informes
- `GET /api/v1/reports/` - Listar
- `POST /api/v1/reports/` - Crear
- `GET /api/v1/reports/{id}` - Obtener
- `POST /api/v1/reports/{id}/generate` - Generar contenido
- `POST /api/v1/reports/{id}/export/{format}` - Exportar
- `DELETE /api/v1/reports/{id}` - Eliminar

### Diagnósticos
- `GET /api/v1/diagnostics/` - Listar
- `POST /api/v1/diagnostics/foda/{organization_id}` - Generar FODA
- `POST /api/v1/diagnostics/strategic-plan/{organization_id}` - Generar plan
- `GET /api/v1/diagnostics/{id}` - Obtener

### Convocatorias
- `GET /api/v1/convocatorias/` - Listar
- `POST /api/v1/convocatorias/` - Crear
- `GET /api/v1/convocatorias/{id}` - Obtener
- `POST /api/v1/convocatorias/{id}/evaluate/{organization_id}` - Evaluar
- `DELETE /api/v1/convocatorias/{id}` - Eliminar

## 🧪 Testing

```bash
npm test
```

## 📦 Build para Producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `build/`.

## 🚀 Despliegue

### Opción 1: Servidor Estático

Sirve la carpeta `build/` con cualquier servidor web (Nginx, Apache, etc.)

### Opción 2: Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

## 📝 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL del backend API | http://localhost:8000/api/v1 |

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que el backend tenga CORS configurado correctamente.

### Error de conexión
Verifica que el backend esté ejecutándose en `http://localhost:8000`

### Token expirado
El sistema redirigirá automáticamente al login si el token expira.

## 📈 Próximas Mejoras

- [ ] Implementar Redux para manejo de estado global
- [ ] Agregar biblioteca de UI (Material-UI, Ant Design)
- [ ] Implementar gráficos con Chart.js o Recharts
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar modo oscuro
- [ ] Implementar paginación en listas
- [ ] Agregar exportación a Excel
- [ ] Implementar carga de archivos múltiple
- [ ] Agregar editor de texto enriquecido para informes

## 📄 Licencia

[Tu licencia aquí]

## 👥 Contribución

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request
