# Sistema de Informes Narrativos para A.C.

Sistema completo para generar informes narrativos a partir de documentos PDF, Excel y PPT, con capacidad de diagnóstico organizacional y evaluación de convocatorias para Asociaciones Civiles.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Documentación](#documentación)
- [Contribución](#contribución)

## 🎯 Descripción

Este sistema permite a las Asociaciones Civiles (A.C.) y organizaciones sin fines de lucro:

- **Procesar documentos** en formatos PDF, Excel y PowerPoint
- **Extraer información** clave de manera automática
- **Generar diagnósticos organizacionales** usando análisis FODA
- **Evaluar convocatorias** de financiamiento para identificar las más idóneas
- **Crear planes estratégicos** basados en metodologías probadas
- **Generar informes narrativos** profesionales en múltiples formatos

## ✨ Características

### 📄 Procesamiento de Documentos
- Extracción de texto de PDFs (incluyendo OCR para escaneados)
- Lectura de datos de Excel (múltiples hojas)
- Extracción de contenido de PowerPoint
- Análisis automático con IA

### 🤖 Inteligencia Artificial
- Análisis semántico de documentos
- Generación de embeddings para búsqueda inteligente
- Análisis FODA automático
- Evaluación de compatibilidad con convocatorias
- Generación de planes estratégicos
- Creación de informes narrativos

### 📊 Diagnóstico Organizacional
- Análisis FODA (Fortalezas, Debilidades, Oportunidades, Amenazas)
- Evaluación de capacidad institucional
- Generación de radar de madurez
- Identificación de brechas y oportunidades

### 🎯 Identificación de Convocatorias
- Matching inteligente con perfil de la organización
- Scoring de compatibilidad (1-100)
- Análisis de requisitos y viabilidad
- Recomendaciones personalizadas

### 📝 Generación de Informes
- Informes narrativos profesionales
- Múltiples formatos (HTML, PDF, Markdown)
- Templates personalizables
- Exportación a diversos formatos

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  - Interfaz de usuario                                        │
│  - Gestión de documentos                                      │
│  - Visualización de informes                                  │
│  - Dashboard de diagnósticos                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  - API REST                                                  │
│  - Procesamiento de documentos                               │
│  - Orquestación de tareas (Celery)                           │
│  - Integración con IA (OpenAI)                               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   SERVICIOS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Redis        │  │ OpenAI API   │      │
│  │ + pgvector   │  │ (Cache/Queue)│  │ (GPT-4)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
Trabajo 0/
├── backend/                    # API Backend (FastAPI)
│   ├── app/
│   │   ├── api/               # Endpoints de la API
│   │   ├── core/              # Configuración central
│   │   ├── models/            # Modelos de base de datos
│   │   ├── schemas/           # Esquemas Pydantic
│   │   ├── services/          # Lógica de negocio
│   │   ├── workers/           # Tareas asíncronas (Celery)
│   │   └── main.py            # Punto de entrada
│   ├── alembic/               # Migraciones de base de datos
│   ├── uploads/               # Archivos subidos
│   ├── reports/               # Informes generados
│   ├── requirements.txt       # Dependencias Python
│   ├── Dockerfile             # Imagen Docker
│   ├── docker-compose.yml     # Orquestación de servicios
│   └── README.md              # Documentación del backend
│
└── frontend/                   # Frontend (React)
    ├── public/                # Archivos estáticos
    ├── src/                   # Código fuente
    │   ├── App.js             # Componente principal
    │   ├── App.css            # Estilos
    │   ├── index.js           # Punto de entrada
    │   └── index.css          # Estilos globales
    ├── package.json           # Dependencias Node.js
    └── README.md              # Documentación del frontend
```

## 🚀 Instalación

### Requisitos Previos

- **Docker y Docker Compose** (recomendado)
- **Python 3.11+** (para instalación local)
- **Node.js 18+** (para frontend)
- **PostgreSQL 14+** con extensión pgvector
- **Redis 7+**
- **Cuenta de OpenAI** con API key

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
cd "C:\Users\USUARIO\Desktop\Trabajo 0"
```

2. **Configurar variables de entorno**
```bash
cd backend
copy .env.example .env
```

Editar `.env` y agregar tu `OPENAI_API_KEY`:
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

3. **Iniciar todos los servicios**
```bash
docker-compose up -d
```

4. **Verificar que todo esté funcionando**
- **API Backend**: http://localhost:8000
- **Documentación Swagger**: http://localhost:8000/docs
- **Flower (monitoreo Celery)**: http://localhost:5555
- **Frontend**: http://localhost:3000 (después de iniciar frontend)

### Opción 2: Instalación Local

#### Backend

1. **Crear entorno virtual**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# o
source venv/bin/activate  # Linux/Mac
```

2. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

3. **Configurar base de datos PostgreSQL**
```sql
CREATE DATABASE narrative_reports;
CREATE EXTENSION vector;
```

4. **Configurar Redis**
- Instalar Redis localmente o usar Docker

5. **Configurar variables de entorno**
```bash
copy .env.example .env
```
Editar `.env` con tus credenciales

6. **Ejecutar migraciones**
```bash
alembic upgrade head
```

7. **Iniciar la API**
```bash
uvicorn app.main:app --reload
```

8. **Iniciar worker de Celery** (en otra terminal)
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

#### Frontend

1. **Instalar dependencias**
```bash
cd frontend
npm install
```

2. **Iniciar en modo desarrollo**
```bash
npm start
```

## 📖 Uso

### Flujo Básico

1. **Crear una Organización**
```bash
curl -X POST "http://localhost:8000/api/v1/organizations/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Organización A.C.",
    "description": "Organización dedicada al desarrollo social",
    "mission": "Mejorar la calidad de vida de comunidades vulnerables",
    "vision": "Ser líderes en desarrollo comunitario",
    "legal_status": "A.C.",
    "location": "Ciudad de México"
  }'
```

2. **Subir Documentos**
- Informes anuales
- Actas de asamblea
- Estados financieros
- Propuestas de proyectos
- Documentos de políticas

3. **Procesar Documentos**
```bash
curl -X POST "http://localhost:8000/api/v1/documents/1/process"
```

4. **Generar Diagnóstico FODA**
```bash
curl -X POST "http://localhost:8000/api/v1/diagnostics/foda/1"
```

5. **Evaluar Convocatorias**
```bash
curl -X POST "http://localhost:8000/api/v1/convocatorias/1/evaluate/1"
```

6. **Generar Informe Narrativo**
```bash
curl -X POST "http://localhost:8000/api/v1/reports/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Informe de Diagnóstico Organizacional",
    "report_type": "diagnostico",
    "organization_id": 1,
    "created_by": 1
  }'

curl -X POST "http://localhost:8000/api/v1/reports/1/generate?organization_id=1"
```

### Endpoints Principales

#### Organizaciones
- `POST /api/v1/organizations/` - Crear organización
- `GET /api/v1/organizations/` - Listar organizaciones
- `GET /api/v1/organizations/{id}` - Obtener organización
- `PUT /api/v1/organizations/{id}` - Actualizar organización
- `DELETE /api/v1/organizations/{id}` - Eliminar organización

#### Documentos
- `POST /api/v1/documents/` - Subir documento
- `POST /api/v1/documents/{id}/process` - Procesar documento
- `GET /api/v1/documents/` - Listar documentos
- `GET /api/v1/documents/{id}` - Obtener documento
- `DELETE /api/v1/documents/{id}` - Eliminar documento

#### Informes
- `POST /api/v1/reports/` - Crear informe
- `POST /api/v1/reports/{id}/generate` - Generar contenido
- `POST /api/v1/reports/{id}/export/{format}` - Exportar informe
- `GET /api/v1/reports/` - Listar informes
- `GET /api/v1/reports/{id}` - Obtener informe

#### Diagnósticos
- `POST /api/v1/diagnostics/` - Crear diagnóstico
- `POST /api/v1/diagnostics/foda/{organization_id}` - Generar FODA
- `POST /api/v1/diagnostics/strategic-plan/{organization_id}` - Generar plan estratégico
- `GET /api/v1/diagnostics/` - Listar diagnósticos

#### Convocatorias
- `POST /api/v1/convocatorias/` - Crear convocatoria
- `POST /api/v1/convocatorias/{id}/evaluate/{organization_id}` - Evaluar compatibilidad
- `POST /api/v1/convocatorias/bulk-import` - Importar múltiples
- `GET /api/v1/convocatorias/` - Listar convocatorias
- `GET /api/v1/convocatorias/top-matches/{organization_id}` - Top matches

## 🔧 Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web de alto rendimiento
- **SQLAlchemy** - ORM para base de datos
- **Pydantic** - Validación de datos
- **PostgreSQL** - Base de datos relacional
- **pgvector** - Búsqueda vectorial
- **Redis** - Cache y cola de mensajes
- **Celery** - Procesamiento de tareas asíncronas
- **OpenAI GPT-4** - IA para análisis y generación
- **LangChain** - Framework para aplicaciones LLM
- **pdfplumber, pandas, python-pptx** - Extracción de documentos
- **WeasyPrint** - Generación de PDFs

## 🎨 Frontend Completo

El frontend incluye una interfaz completa y moderna con:

### ✨ Características
- 🔐 **Autenticación** - Sistema de login con JWT
- 📊 **Dashboard** - Estadísticas y acciones rápidas
- 🏢 **Organizaciones** - CRUD completo
- 📄 **Documentos** - Upload drag & drop, procesamiento con IA
- 📝 **Informes** - Generación automática y exportación
- 📊 **Diagnósticos** - Análisis FODA y planes estratégicos
- 🎯 **Convocatorias** - Evaluación de compatibilidad
- 📱 **Responsive** - Diseño adaptable
- 🎨 **UI Moderna** - Interfaz profesional

### 🚀 Inicio Rápido

```bash
# Frontend
cd frontend
npm install
npm start

# Backend (en otra terminal)
cd backend
copy .env.example .env
# Editar .env con OPENAI_API_KEY
docker-compose up -d
```

Accede a http://localhost:3000

---

### Infraestructura
- **Docker** - Contenedores
- **Docker Compose** - Orquestación de servicios
- **Alembic** - Migraciones de base de datos

## 📊 Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | Sí | - |
| `REDIS_URL` | URL de conexión a Redis | Sí | - |
| `OPENAI_API_KEY` | API Key de OpenAI | Sí | - |
| `OPENAI_MODEL` | Modelo de OpenAI a usar | No | gpt-4-turbo-preview |
| `EMBEDDING_MODEL` | Modelo de embeddings | No | text-embedding-3-small |
| `SECRET_KEY` | Clave secreta para JWT | Sí | - |
| `ALGORITHM` | Algoritmo JWT | No | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | No | 30 |

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 📈 Monitoreo

- **Flower**: http://localhost:5555 (monitoreo de tareas Celery)
- **Swagger**: http://localhost:8000/docs (documentación de API)

## 🔐 Seguridad

- Autenticación JWT (pendiente de implementar)
- CORS configurado
- Variables de entorno para credenciales
- Docker para aislamiento

## 📝 Próximos Pasos

### Backend
- [ ] Implementar autenticación de usuarios (JWT)
- [ ] Agregar autorización basada en roles
- [ ] Implementar búsqueda semántica con pgvector
- [ ] Integrar APIs de convocatorias externas
- [ ] Agregar más tipos de diagnósticos
- [ ] Implementar exportación a DOCX
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar rate limiting
- [ ] Agregar logging y monitoreo
- [ ] Implementar webhooks para notificaciones

### Frontend
- [ ] Implementar autenticación de usuarios
- [ ] Crear dashboard completo
- [ ] Crear componentes para gestión de organizaciones
- [ ] Crear componente para subida de documentos
- [ ] Crear visualizador de informes
- [ ] Crear dashboard de diagnósticos
- [ ] Crear interfaz para evaluación de convocatorias
- [ ] Agregar biblioteca de UI (Material-UI, Ant Design)
- [ ] Implementar manejo de estado global (Redux/Context)
- [ ] Agregar validación de formularios
- [ ] Implementar notificaciones

### Infraestructura
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Agregar monitoreo con Prometheus y Grafana
- [ ] Implementar backups automáticos
- [ ] Configurar SSL/TLS
- [ ] Implementar escalabilidad horizontal

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

[Tu licencia aquí]

## 👥 Autores

- [Tu nombre]

## 🙏 Agradecimientos

- OpenAI por GPT-4
- FastAPI por el framework
- React por la biblioteca de UI
- Comunidad de código abierto

## 📞 Soporte

Para soporte, email: [tu-email@ejemplo.com] o abre un issue en GitHub.

---

**Nota**: Este sistema está en desarrollo activo. Algunas funcionalidades pueden estar incompletas. Revisa los issues para conocer el estado actual.
