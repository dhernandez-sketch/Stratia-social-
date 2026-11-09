# Guía de Configuración de MongoDB Atlas

Para ejecutar el backend Node.js, necesitas configurar MongoDB. La forma más fácil es usar MongoDB Atlas (nube gratuita).

## 🚀 MongoDB Atlas (Recomendado)

### Paso 1: Crear cuenta en MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas
2. Haz clic en "Sign Up" o "Try Free"
3. Regístrate con tu email o Google account
4. Verifica tu email

### Paso 2: Crear un Cluster

1. En el dashboard, haz clic en "Create Cluster"
2. Selecciona "M0 Sandbox" (gratuito)
3. Elige la región más cercana a ti
4. Haz clic en "Create Cluster"
5. Espera a que el cluster se cree (5-10 minutos)

### Paso 3: Configurar Acceso

1. En el menú lateral, ve a "Database Access"
2. Haz clic en "Add New Database User"
3. Crea un usuario:
   - Authentication Method: Password
   - Username: `narrative_app`
   - Password: (genera una contraseña segura)
   - Database User Privileges: Read and write to any database
4. Haz clic en "Add User"

### Paso 4: Configurar Red

1. En el menú lateral, ve a "Network Access"
2. Haz clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - O agrega tu IP específica para mayor seguridad
4. Haz clic en "Confirm"

### Paso 5: Obtener Connection String

1. En el menú lateral, ve a "Clusters"
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Connect your application"
4. Selecciona "Node.js" como driver
5. Copia la connection string que aparece
6. Reemplaza `<password>` con tu contraseña

La connection string tendrá este formato:
```
mongodb+srv://narrative_app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Paso 6: Configurar .env

1. Abre el archivo `backend-node/.env`
2. Actualiza la variable `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://narrative_app:tu-password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Guarda el archivo

## 🔧 MongoDB Local (Alternativa)

Si prefieres MongoDB local:

### Opción 1: Descargar MongoDB Community Server

1. Descarga desde: https://www.mongodb.com/try/download/community
2. Instala MongoDB Community Server
3. Inicia MongoDB:
```bash
# En Windows, MongoDB se instala como servicio automáticamente
# Verifica que esté ejecutándose:
net start MongoDB
```

### Opción 2: Usar Docker (si tienes Docker)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## ✅ Verificación

Después de configurar MongoDB, verifica que esté funcionando:

```bash
cd backend-node
npm run seed
```

Si ves "Connected to MongoDB" y "Seed completed successfully!", todo está funcionando.

## 🔑 Credenciales de Prueba

Después de ejecutar el seed:

- **Email**: admin@ejemplo.org
- **Password**: admin123
- **Organización**: Asociación Civil Ejemplo

## 🐛 Solución de Problemas

### Error de conexión
- Verifica que la connection string sea correcta
- Verifica que tu IP esté en la whitelist de Network Access
- Verifica que el usuario tenga permisos correctos

### Error de autenticación
- Verifica que el usuario y contraseña sean correctos
- Verifica que el usuario tenga privilegios de lectura/escritura

### Error de timeout
- Verifica que tengas conexión a internet
- Intenta nuevamente después de unos minutos

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de error
2. Verifica la documentación de MongoDB Atlas
3. Abre un issue en el repositorio
