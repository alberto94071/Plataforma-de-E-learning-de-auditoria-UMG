# 🎓 AuditPro — Plataforma eLearning de Auditoría
**Universidad Mariano Gálvez de Guatemala**

Curso interactivo de Principios de Auditoría Financiera con sistema de diploma.

---

## Stack Tecnológico
- **Frontend/Backend**: Next.js 15 (App Router)
- **Base de datos**: Neon PostgreSQL (`@neondatabase/serverless`)
- **Autenticación**: NextAuth.js v5
- **Generación PDF**: `jsPDF` + `html2canvas`
- **Deploy**: Vercel

---

## Pasos para desplegar

### 1. Crear repositorio
Crea un nuevo repo en GitHub y sube todos estos archivos.

### 2. Crear base de datos en Neon
1. Ve a [neon.tech](https://neon.tech) → New Project → "auditoria"
2. Copia la `DATABASE_URL` del dashboard
3. Ve a **SQL Editor** y ejecuta el contenido de `schema.sql`

### 3. Configurar variables de entorno
Crea un archivo `.env.local` (NO lo subas a GitHub):
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="genera-con-openssl-rand-base64-32"
```

### 4. Crear admin
En el SQL Editor de Neon, ejecuta:
```sql
-- Primero instala bcryptjs en local y genera el hash
-- O usa este hash para la contraseña "admin2024"
UPDATE users 
SET password_hash = '$2b$10$...' 
WHERE email = 'admin@auditoria.edu.gt';
```

**O más fácil**: Regístrate como estudiante normal, luego:
```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@correo.com';
```

### 5. Deploy en Vercel
1. Importa el repo en [vercel.com](https://vercel.com)
2. En **Environment Variables** agrega:
   - `DATABASE_URL` → tu string de Neon
   - `AUTH_SECRET` → string random de 32 chars
3. Deploy → ¡listo!

---

## Sistema de puntuación
| Elemento | Puntos |
|---|---|
| Respuesta correcta | 10 pts |
| Preguntas por módulo | 3 |
| Máx por módulo | 30 pts |
| Total módulos | 7 |
| **Puntaje máximo** | **210 pts** |
| **Mínimo para diploma** | **150 pts** |

---

## Rutas principales
| Ruta | Descripción |
|---|---|
| `/` | Landing + Login/Registro |
| `/dashboard` | Panel del estudiante |
| `/module/[slug]` | Teoría del módulo |
| `/quiz/[slug]` | Evaluación del módulo |
| `/certificate` | Diploma descargable (PDF/PNG) |
| `/admin` | Panel de administración |

---

## Funcionalidades
- ✅ Registro/Login seguro con bcrypt
- ✅ 7 módulos de auditoría con contenido completo
- ✅ Evaluaciones con 3 preguntas por módulo
- ✅ Sistema de puntuación acumulativa
- ✅ Diploma elegante con diseño corporativo oscuro
- ✅ Descarga de diploma en PDF e imagen PNG
- ✅ Panel de admin con estadísticas
- ✅ Impresión de diploma desde el admin
- ✅ Filtros y búsqueda de estudiantes
- ✅ Diseño responsive mobile-first
