# Sistema de Informes Narrativos para A.C.

Sistema para generar informes narrativos a partir de documentos PDF, Excel y PPT, con capacidad de diagnóstico organizacional y evaluación de convocatorias.

## Características

- 📄 **Extracción de documentos**: PDF, Excel, PowerPoint
- 🤖 **Análisis con IA**: OpenAI GPT-4 para análisis semántico
- 📊 **Diagnóstico organizacional**: Análisis FODA automático
- 🎯 **Evaluación de convocatorias**: Matching inteligente con organizaciones
- 📝 **Generación de informes**: Narrativas profesionales en múltiples formatos
- 🔍 **Búsqueda semántica**: Embeddings para búsqueda inteligente
- ⚡ **Procesamiento asíncrono**: Celery + Redis para tareas en background

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/              # Endpoints de la API
│   │   ├── organizations.py
│   │   ├── documents.py
│   │   ├── reports.py
│   │   ├── diagnostics.py
│   │   └── convocatorias.py
│   ├── core/             # Configuración central
│   │   ├── config.py
│   │   └── database.py
│   ├── models/           # Modelos de base de datos
│   │   └── models.py
│   ├── schemas/          # Esquemas Pydantic
│   │   └── schemas.py
│   ├── services/         # Lógica de negocio
│   │   ├── ai_service.py
│   │   ├── document_processor.py
│   │   └── report_generator.py
│   ├── workers/          # Tareas asíncronas
│   │   ├── celery_app.py
│   │   └── tasks.py
│   └── main.py           # Punto de entrada FastAPI
├── uploads/              # Archivos subidos
├── reports/              # Informes generados
├── requirements.txt      # Dependencias Python
├── Dockerfile            # Imagen Docker
├── docker-compose.yml    # Orquestación de servicios
└── .env.example          # Variables de entorno ejemplo
```

## Instalación

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
```
OPENAI_API_KEY=sk-tu-api-key-aqui
```

3. **Iniciar servicios con Docker Compose**
```bash
docker-compose up -d
```

4. **Verificar que todo esté funcionando**
- API: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs
- Flower (monitoreo Celery): http://localhost:5555

### Opción 2: Instalación Local

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
- Instalar PostgreSQL localmente
- Crear base de datos: `narrative_reports`
- Habilitar extensión pgvector: `CREATE EXTENSION vector;`

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

## Uso de la API

### 1. Crear una Organización

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

### 2. Subir un Documento

```bash
curl -X POST "http://localhost:8000/api/v1/documents/" \
  -F "file=@informe_anual.pdf" \
  -F "document_type=informe_anual" \
  -F "organization_id=1" \
  -F "uploaded_by=1"
```

### 3. Procesar Documento

```bash
curl -X POST "http://localhost:8000/api/v1/documents/1/process"
```

### 4. Generar Análisis FODA

```bash
curl -X POST "http://localhost:8000/api/v1/diagnostics/foda/1"
```

### 5. Evaluar Convocatoria

```bash
curl -X POST "http://localhost:8000/api/v1/convocatorias/1/evaluate/1"
```

### 6. Generar Informe

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

## Endpoints Principales

### Organizaciones
- `POST /api/v1/organizations/` - Crear organización
- `GET /api/v1/organizations/` - Listar organizaciones
- `GET /api/v1/organizations/{id}` - Obtener organización
- `PUT /api/v1/organizations/{id}` - Actualizar organización
- `DELETE /api/v1/organizations/{id}` - Eliminar organización

### Documentos
- `POST /api/v1/documents/` - Subir documento
- `POST /api/v1/documents/{id}/process` - Procesar documento
- `GET /api/v1/documents/` - Listar documentos
- `GET /api/v1/documents/{id}` - Obtener documento
- `DELETE /api/v1/documents/{id}` - Eliminar documento

### Informes
- `POST /api/v1/reports/` - Crear informe
- `POST /api/v1/reports/{id}/generate` - Generar contenido
- `POST /api/v1/reports/{id}/export/{format}` - Exportar informe
- `GET /api/v1/reports/` - Listar informes
- `GET /api/v1/reports/{id}` - Obtener informe

### Diagnósticos
- `POST /api/v1/diagnostics/` - Crear diagnóstico
- `POST /api/v1/diagnostics/foda/{organization_id}` - Generar FODA
- `POST /api/v1/diagnostics/strategic-plan/{organization_id}` - Generar plan estratégico
- `GET /api/v1/diagnostics/` - Listar diagnósticos

### Convocatorias
- `POST /api/v1/convocatorias/` - Crear convocatoria
- `POST /api/v1/convocatorias/{id}/evaluate/{organization_id}` - Evaluar compatibilidad
- `POST /api/v1/convocatorias/bulk-import` - Importar múltiples
- `GET /api/v1/convocatorias/` - Listar convocatorias
- `GET /api/v1/convocatorias/top-matches/{organization_id}` - Top matches

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | - |
| `REDIS_URL` | URL de conexión a Redis | - |
| `OPENAI_API_KEY` | API Key de OpenAI | - |
| `OPENAI_MODEL` | Modelo de OpenAI a usar | gpt-4-turbo-preview |
| `EMBEDDING_MODEL` | Modelo de embeddings | text-embedding-3-small |
| `SECRET_KEY` | Clave secreta para JWT | - |

## Tecnologías Utilizadas

- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Base de Datos**: PostgreSQL + pgvector
- **Cache/Cola**: Redis + Celery
- **IA**: OpenAI GPT-4, LangChain
- **Extracción de documentos**: pdfplumber, pandas, python-pptx, pytesseract
- **Generación de reportes**: Jinja2, WeasyPrint
- **Contenedores**: Docker, Docker Compose

## Próximos Pasos

- [ ] Implementar autenticación de usuarios (JWT)
- [ ] Agregar frontend React
- [ ] Implementar búsqueda semántica con pgvector
- [ ] Integrar APIs de convocatorias externas
- [ ] Agregar más tipos de diagnósticos
- [ ] Implementar exportación a DOCX
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar rate limiting
- [ ] Agregar logging y monitoreo

## Licencia

[Tu licencia aquí]
