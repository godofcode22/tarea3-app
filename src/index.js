const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const hostname = os.hostname();
  const dbHost = process.env.DB_HOST || 'No configurado (ejecucion local)';
  const dbName = process.env.DB_NAME || 'appdb';
  const uptimeSeconds = Math.floor(process.uptime());

  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ECS Fargate App - Tarea 3</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.35); }
    .badge { display: inline-block; background: #2563eb; color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: bold; margin-bottom: 12px; }
    h1 { margin: 0 0 12px; font-size: 24px; }
    ul { list-style: none; padding: 0; margin: 16px 0 0; }
    li { padding: 8px 0; border-bottom: 1px solid #334155; color: #cbd5e1; }
    li:last-child { border-bottom: none; }
    code { background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">ONLINE - AWS ECS FARGATE + ECR</span>
    <h1>Task de ECS corriendo correctamente</h1>
    <p>Esta pagina confirma que el contenedor construido desde la imagen en <strong>Amazon ECR</strong> esta en ejecucion.</p>
    <ul>
      <li><strong>Contenedor / Hostname:</strong> <code>${hostname}</code></li>
      <li><strong>Puerto:</strong> <code>${port}</code></li>
      <li><strong>RDS MySQL Host:</strong> <code>${dbHost}</code></li>
      <li><strong>Base de datos:</strong> <code>${dbName}</code></li>
      <li><strong>Tiempo activo (uptime):</strong> <code>${uptimeSeconds}s</code></li>
      <li><strong>Healthcheck JSON:</strong> <a href="/health" style="color:#38bdf8;">/health</a></li>
    </ul>
  </div>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ecs-fargate-app',
    hostname: os.hostname(),
    port: Number(port),
    dbHost: process.env.DB_HOST || null,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port} (host: ${os.hostname()})`);
});
