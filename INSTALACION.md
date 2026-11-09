# Guía de Instalación de Herramientas Necesarias

Para ejecutar el Sistema de Informes Narrativos para A.C., necesitas instalar las siguientes herramientas:

## 📋 Herramientas Requeridas

### 1. Docker Desktop (Recomendado para Backend)

**Por qué**: Docker simplifica la instalación de PostgreSQL, Redis y todas las dependencias del backend.

**Descarga**: https://www.docker.com/products/docker-desktop

**Pasos de instalación**:
1. Descarga Docker Desktop para Windows
2. Ejecuta el instalador
3. Sigue las instrucciones en pantalla
4. Reinicia tu computadora si es necesario
5. Verifica la instalación:
```bash
docker --version
docker-compose --version
```

---

### 2. Python 3.11+ (Alternativa para Backend sin Docker)

**Por qué**: Necesario para ejecutar el backend FastAPI localmente.

**Descarga**: https://www.python.org/downloads/

**Pasos de instalación**:
1. Descarga Python 3.11 o superior
2. **IMPORTANTE**: Marca "Add Python to PATH" durante la instalación
3. Verifica la instalación:
```bash
python --version
pip --version
```

---

### 3. Node.js 18+ (Para Frontend)

**Por qué**: Necesario para ejecutar el frontend React.

**Descarga**: https://nodejs.org/

**Pasos de instalación**:
1. Descarga Node.js LTS (versión estable)
2. Ejecuta el instalador
3. Sigue las instrucciones en pantalla
4. Verifica la instalación:
```bash
node --version
npm --version
```

---

## 🚀 Opción 1: Instalación con Docker (Recomendada)

Esta es la forma más fácil de ejecutar todo el sistema.

### Prerequisitos
- ✅ Docker Desktop instalado
- ✅ Archivo `.env` configurado con tu `OPENAI_API_KEY`

### Pasos

1. **Navega al directorio del backend**:
```bash
cd "C:\Users\USUARIO\Desktop\Trabajo 0\backend"
```

2. **Configura las variables de entorno**:
```bash
copy .env.example .env
```

3. **Edita el archivo `.env`** y agrega tu API key de OpenAI:
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

4. **Inicia todos los servicios**:
```bash
docker-compose up -d
```

5. **Verifica que todo esté funcionando**:
- API Backend: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs
- Flower (monitoreo): http://localhost:5555

6. **Instala y ejecuta el frontend** (en otra terminal):
```bash
cd "C:\Users\USUARIO\Desktop\Trabajo 0\frontend"
npm install
npm start
```

7. **Accede a la aplicación**:
- Frontend: http://localhost:3000

---

## 🚀 Opción 2: Instalación Local (Sin Docker)

Esta opción requiere más configuración manual.

### Prerequisitos
- ✅ Python 3.11+ instalado
- ✅ Node.js 18+ instalado
- ✅ PostgreSQL 14+ instalado
- ✅ Redis 7+ instalado

### Backend

1. **Instala PostgreSQL**:
   - Descarga desde: https://www.postgresql.org/download/windows/
   - Durante la instalación, crea una contraseña para el usuario `postgres`

2. **Crea la base de datos**:
```sql
CREATE DATABASE narrative_reports;
CREATE EXTENSION vector;
```

3. **Instala Redis**:
   - Opción 1: Descarga desde https://redis.io/download
   - Opción 2: Usa Docker solo para Redis:
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

4. **Configura el backend**:
```bash
cd "C:\Users\USUARIO\Desktop\Trabajo 0\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

5. **Edita `.env`** con tus credenciales:
```env
DATABASE_URL=postgresql://postgres:tu-password@localhost:5432/narrative_reports
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-tu-api-key-aqui
```

6. **Ejecuta migraciones**:
```bash
alembic upgrade head
```

7. **Inicia la API**:
```bash
uvicorn app.main:app --reload
```

8. **Inicia el worker de Celery** (en otra terminal):
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

### Frontend

1. **Instala dependencias**:
```bash
cd "C:\Users\USUARIO\Desktop\Trabajo 0\frontend"
npm install
```

2. **Inicia el frontend**:
```bash
npm start
```

3. **Accede a la aplicación**:
- Frontend: http://localhost:3000

---

## 🔍 Verificación de Instalación

### Docker
```bash
docker --version
docker-compose --version
```

### Python
```bash
python --version
pip --version
```

### Node.js
```bash
node --version
npm --version
```

### PostgreSQL
```bash
psql --version
```

### Redis
```bash
redis-cli --version
```

---

## 🐛 Solución de Problemas

### Docker no inicia en Windows
- Asegúrate de tener habilitada la virtualización en BIOS
- Instala WSL 2 (Windows Subsystem for Linux)
- Reinicia Docker Desktop

### Python no se reconoce
- Asegúrate de haber marcado "Add Python to PATH" durante la instalación
- Reinicia tu terminal después de instalar

### Node.js no se reconoce
- Reinicia tu terminal después de instalar
- Verifica que npm esté en el PATH

### Errores de permisos en Docker
- En Windows, ejecuta Docker Desktop como administrador
- Opción: Usa "Docker Desktop" en lugar de "Docker"

---

## 📞 Soporte

Si tienes problemas con la instalación:

1. Revisa los logs de error
2. Verifica que todas las herramientas estén instaladas correctamente
3. Consulta la documentación oficial de cada herramienta
4. Abre un issue en el repositorio

---

## ✅ Checklist de Instalación

- [ ] Docker Desktop instalado y funcionando
- [ ] Python 3.11+ instalado (opcional si usas Docker)
- [ ] Node.js 18+ instalado
- [ ] Archivo `.env` configurado con OPENAI_API_KEY
- [ ] Servicios del backend iniciados
- [ ] Dependencias del frontend instaladas
- [ ] Aplicación accesible en http://localhost:3000
