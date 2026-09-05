# [Nombre de tu proyecto]
 
Aplicación web cliente-servidor para gestionar tareas. Permite registrar usuarios con autenticación segura, administrar actividades y almacenar la información de forma permanente en PostgreSQL.
 
<!-- BADGE_CI -->
 
## 🚀 Instalación local
 
```bash
git clone https://github.com/gaboMC/task-manager-fullstack.git
cd task-manager-fullstack
npm install
```
 
### Variables de entorno
Crea un archivo `.env` en la raíz con las siguientes claves (sin valores reales en este documento):
 
```env
PORT=3000
DATABASE_URL="postgresql://johndoe:mypassword123@localhost:5432/task_db?schema=public"
JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIj"
```
 
## 📜 Comandos disponibles
 
| Comando          | Descripción                               |
|------------------|-------------------------------------------|
| `npm run dev`    | Levanta el entorno de desarrollo          |
| `npm run build`  | Genera el build de producción             |
| `npm test`       | Corre las pruebas automatizadas           |
 
## 🗄️ Base de datos
Ejecuta el siguiente comando para aplicar las migraciones de Prisma y crear las tablas en PostgreSQL:

```bash
npx prisma migrate dev
```