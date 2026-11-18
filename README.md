# Aplicación Web Node.js (`app`)

## Descripción del proyecto

Esta carpeta contiene el código fuente de una aplicación web ligera desarrollada con **Node.js** y **Express**, lista para ejecutarse en contenedores Docker y desplegarse de forma continua en **Amazon ECR** y **Amazon ECS Fargate**.

Expone dos endpoints HTTP en el puerto `3000`:
- `GET /`: Devuelve un JSON indicando el estado de la aplicación y si `DB_HOST` está configurado.
- `GET /health`: Endpoint de verificación de salud (*healthcheck*).

---

## Ubicación del pipeline CI/CD

El pipeline de **GitHub Actions** se encuentra en:

```text
app/.github/workflows/main.yml
```

*(Si esta carpeta `app/` se sube como su propio repositorio en GitHub, la ruta desde la raíz del repositorio es `.github/workflows/main.yml`).*

### ¿Qué hace el pipeline?
Cada vez que se hace `push` a la rama `main` (o al ejecutarse manualmente mediante `workflow_dispatch`):
1. Descarga el código del repositorio.
2. Se autentica en AWS usando los Secrets configurados en GitHub.
3. Inicia sesión en **Amazon ECR** (`us-east-2`).
4. Construye la imagen Docker usando `Dockerfile`, la etiqueta con el número de ejecución y `:latest`, y la sube al repositorio **`tarea3-app`**.
5. Fuerza un nuevo despliegue en **Amazon ECS** (`aws ecs update-service --force-new-deployment`) sobre el clúster **`app-cluster`** y el servicio **`app-service`** para tomar la nueva versión `:latest`.

### Secrets requeridos en GitHub Actions
Para que el pipeline funcione, configura los siguientes secrets en tu repositorio de GitHub (**Settings > Secrets and variables > Actions > New repository secret**):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

*(Si utilizas AWS Academy con credenciales temporales, añade también el secret `AWS_SESSION_TOKEN` y agrégalo en el paso `Configurar credenciales de AWS` como `aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}`).*

---

## Comandos para deploy local

### Opción 1: Con Docker Compose (Recomendado)
Desde la carpeta `app/`:
```bash
docker compose up --build -d
```
La aplicación quedará disponible en: `http://localhost:3000`

Para detener y eliminar el contenedor local:
```bash
docker compose down
```

### Opción 2: Con Docker directamente
Desde la carpeta `app/`:
```bash
docker build -t tarea3-app:local .
docker run -p 3000:3000 --name tarea3-app-local tarea3-app:local
```

### Opción 3: Sin Docker (Node.js local)
```bash
cd src
npm install
npm start
```
La aplicación escuchará en `http://localhost:3000`.
