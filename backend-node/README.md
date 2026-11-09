# Backend Node.js - Sistema de Informes Narrativos para A.C.

Backend en Node.js con Express y MongoDB para el sistema de generación de informes narrativos.

## 🚀 Características

- **Express.js** - Framework web rápido y minimalista
- **MongoDB** - Base de datos NoSQL con Mongoose ODM
- **JWT** - Autenticación con tokens JWT
- **OpenAI API** - Integración con GPT-4 para análisis con IA
- **Multer** - Subida de archivos
- **pdf-parse** - Extracción de texto de PDFs
- **xlsx** - Lectura de archivos Excel
- **tesseract.js** - OCR para PDFs escaneados

## 📋 Prerequisitos

- Node.js 18+
- MongoDB 5+ (local o en la nube)
- Cuenta de OpenAI con API key

## 🔧 Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
# Editar .env con tus credenciales
OPENAI_API_KEY=sk-tu-api-key-aqui
MONGODB_URI=mongodb://localhost:27017/narrative_reports
JWT_SECRET=tu-secret-key
```

3. **Iniciar MongoDB**

   **Opción 1: MongoDB local**
   ```bash
   # Si tienes MongoDB instalado localmente
   mongod
   ```

   **Opción 2: MongoDB Atlas (nube)**
   - Crea una cuenta en https://www.mongodb.com/cloud/atlas
   - Crea un cluster gratuito
   - Obtén la connection string
   - Actualiza `MONGODB_URI` en `.env`

   **Opción 3: Docker (si tienes Docker)**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Ejecutar seed (datos de prueba)**
```bash
npm run seed
```

5. **Iniciar el servidor**
```bash
npm start
```

El servidor estará disponible en http://localhost:8000

## 📡 Endpoints de API

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil (protegido)

### Organizaciones
- `POST /api/v1/organizations/` - Crear organización
- `GET /api/v1/organizations/` - Listar organizaciones
- `GET /api/v1/organizations/:id` - Obtener organización
- `PUT /api/v1/organizations/:id` - Actualizar organización
- `DELETE /api/v1/organizations/:id` - Eliminar organización

### Documentos
- `POST /api/v1/documents/` - Subir documento
- `POST /api/v1/documents/:id/process` - Procesar documento
- `GET /api/v1/documents/` - Listar documentos
- `GET /api/v1/documents/:id` - Obtener documento
- `DELETE /api/v1/documents/:id` - Eliminar documento

### Informes
- `POST /api/v1/reports/` - Crear informe
- `POST /api/v1/reports/:id/generate` - Generar contenido
- `GET /api/v1/reports/` - Listar informes
- `GET /api/v1/reports/:id` - Obtener informe
- `PUT /api/v1/reports/:id` - Actualizar informe
- `DELETE /api/v1/reports/:id` - Eliminar informe
- `GET /api/v1/reports/:id/export/:format` - Exportar informe

### Diagnósticos
- `POST /api/v1/diagnostics/` - Crear diagnóstico
- `POST /api/v1/diagnostics/foda/:organizationId` - Generar FODA
- `POST /api/v1/diagnostics/strategic-plan/:organizationId` - Generar plan estratégico
- `GET /api/v1/diagnostics/` - Listar diagnósticos
- `GET /api/v1/diagnostics/:id` - Obtener diagnóstico
- `DELETE /api/v1/diagnostics/:id` - Eliminar diagnóstico

### Convocatorias
- `POST /api/v1/convocatorias/` - Crear convocatoria
- `POST /api/v1/convocatorias/bulk-import` - Importar múltiples
- `POST /api/v1/convocatorias/:id/evaluate/:organizationId` - Evaluar compatibilidad
- `GET /api/v1/convocatorias/` - Listar convocatorias
- `GET /api/v1/convocatorias/top-matches/:organizationId` - Top matches
- `GET /api/v1/convocatorias/:id` - Obtener convocatoria
- `PUT /api/v1/convocatorias/:id` - Actualizar convocatoria
- `DELETE /api/v1/convocatorias/:id` - Eliminar convocatoria

## 🔐 Autenticación

Todas las rutas excepto `/api/v1/auth/register` y `/api/v1/auth/login` requieren autenticación JWT.

**Header requerido**:
```
Authorization: Bearer <tu-token>
```

**Obtener token**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.org","password":"admin123"}'
```

## 📁 Estructura del Proyecto

```
backend-node/
├── src/
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middleware (auth, etc.)
│   ├── models/            # Modelos de Mongoose
│   ├── routes/            # Rutas de Express
│   ├── services/          # Servicios (AI, Document Processor)
│   ├── index.js           # Punto de entrada
│   └── seed.js            # Script de datos de prueba
├── uploads/               # Archivos subidos
├── .env                   # Variables de entorno
├── .env.example           # Ejemplo de variables
├── package.json           # Dependencias
└── README.md              # Este archivo
```

## 🧪 Credenciales de Prueba

Después de ejecutar `npm run seed`:

- **Email**: admin@ejemplo.org
- **Password**: admin123
- **Organización**: Asociación Civil Ejemplo

## 🔄 Desarrollo

Para desarrollo con auto-reload:
```bash
npm run dev
```

## 📝 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 8000 |
| `MONGODB_URI` | URI de conexión a MongoDB | mongodb://localhost:27017/narrative_reports |
| `JWT_SECRET` | Clave secreta para JWT | your-secret-key |
| `OPENAI_API_KEY` | API Key de OpenAI | - |
| `OPENAI_MODEL` | Modelo de OpenAI | gpt-4-turbo-preview |
| `MAX_FILE_SIZE` | Tamaño máximo de archivo (bytes) | 52428800 |
| `UPLOAD_PATH` | Ruta de uploads | uploads |

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que MongoDB esté ejecutándose
- Verifica la URI de conexión en `.env`
- Para MongoDB Atlas, asegúrate de que tu IP esté en la whitelist

### Error de OpenAI API
- Verifica que `OPENAI_API_KEY` esté configurada correctamente
- Verifica que tengas créditos en tu cuenta de OpenAI

### Error de subida de archivos
- Verifica que la carpeta `uploads/` exista
- Verifica que `MAX_FILE_SIZE` sea suficiente
- Verifica que el tipo de archivo sea soportado

## 📈 Próximas Mejoras

- [ ] Implementar WebSockets para actualizaciones en tiempo real
- [ ] Agregar Redis para cache y sesiones
- [ ] Implementar Bull Queue para tareas asíncronas
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar rate limiting
- [ ] Agregar logging con Winston
- [ ] Implementar API documentation con Swagger
- [ ] Agregar Docker support

## 📄 Licencia

[Tu licencia aquí]
