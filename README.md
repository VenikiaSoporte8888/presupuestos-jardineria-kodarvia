# Control de presupuestos enviados

Aplicación para una empresa familiar de jardinería de Lliria (Valencia, España) que hasta ahora llevaba de memoria los
presupuestos enviados a sus clientes. Muestra un listado con el estado de cada uno (pendiente, aceptado, rechazado),
permite cambiarlo con un clic y, en un panel protegido con clave, enseña el total presupuestado y el total aceptado del mes.

**Stack:** React · Tailwind CSS · Vite · `localStorage` (sin backend). Importes en euros (`€`), con formato de España (`12.500 €`, `1.250,50 €`).

## Cómo correrlo en tu computador

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local para desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve esa versión para probarla |
| `npm test` | Comprueba las reglas (totales del mes, validación del formulario, datos de ejemplo) |

Publicación: `vercel.json` (Vercel) hace que rutas como `/admin` funcionen al recargar. No necesita variables de entorno.
Si lo abres en Lovable, súbelo a un repositorio de GitHub y conéctalo desde ahí.

## Qué hace cada pantalla

- **Clave del panel**: solo `/admin` pide clave. Para un uso real donde nadie deba ver nada sin ella, cambia `LOCK_WHOLE_APP` a
  `true` en `src/config.js`: al abrir la app saldrá primero una pantalla de clave y no se verá nada hasta ponerla (hay un botón
  **Salir** para volver a bloquearla).
- **Presupuestos (`/`)**: es la pantalla principal. Arriba hay un menú de estados (Todos, Pendientes, Aceptados, Rechazados, cada uno con su color
  y su conteo). Para mantener la pantalla limpia, **la lista solo aparece al tocar un estado o al buscar** (tocar el mismo estado otra
  vez la oculta). Si prefieres que la lista salga completa desde el inicio, cambia `LIST_OPEN_BY_DEFAULT` a `true` en `src/config.js`. El **buscador** encuentra por
  cliente, estado, fecha (`16/10/2026`, `16 oct`, `octubre`, `2026`), importe (`3200` o `3.200`), quién aceptó o firmó y notas, sin
  importar mayúsculas ni tildes. Arriba, tres tarjetas resumen (total presupuestado, total aceptado y pendientes de respuesta). Cada presupuesto es una tarjeta con su color, su importe y la fecha
  de envío; el estado se cambia **con un clic** (Pendiente / Aceptado / Rechazado). Los pendientes muestran cuántos días llevan sin
  respuesta y avisan a partir de 15 días.
  **Detalle opcional por estado** (no afecta al cambio de estado de un clic): *Pendiente* → de qué está pendiente (con frases
  rápidas); *Aceptado* → fecha de aceptación, quién lo aceptó y quién firmó, y una nota; *Rechazado* → fecha y motivo. Al aceptar o
  rechazar se anota la fecha de hoy, que se puede corregir en “Editar detalle”.
- **El negocio (`/negocio`)**: a qué se dedica la empresa, cómo llegar (con enlace a Google Maps), horario y redes sociales.
- **Nuevo (`/nueva`)**: formulario con cliente, importe presupuestado y fecha de envío, en ese orden y los tres obligatorios.
  No se envía si falta alguno ni si la fecha es futura o el importe es cero. El presupuesto nace “Pendiente”.
- **Admin (`/admin`)**: antes del panel hay una pantalla que pide la clave; hasta que no se pone no se lee ni se muestra ningún presupuesto. Dentro: total presupuestado
  y total aceptado del mes (se recalculan solos al cambiar un estado), conteo por estado y botones para restaurar o vaciar los datos.
- **Informe (`/informe`)**: un extra, en su propia página del menú. Pide la misma clave que `/admin` (muestra presupuestos). Se elige el mes y muestra
  total presupuestado, total aceptado, cuántas siguen pendientes y cuántas se rechazaron, el porcentaje de aceptación y el detalle de
  cada presupuesto; el botón **Imprimir / PDF** lo deja listo para imprimir o guardar como PDF.
- **Vista vacía**: si no hay presupuestos, un mensaje claro con un botón para agregar el primero.
- **Aviso de localStorage**: si el navegador lo bloquea o no lo admite, aparece un aviso arriba. La app sigue funcionando, pero
  guarda solo en memoria: se pierde al recargar.

## Cómo se calculan los totales del mes

- **Total presupuestado del mes** = suma de los presupuestos **enviados en el mes actual** (fecha de envío), en cualquier estado.
- **Total aceptado del mes** = suma de los que están en estado “Aceptado” y **se aceptaron en el mes actual** (fecha de
  aceptación; si no tiene, se usa la de envío). Si una vuelve a Pendiente o Rechazada, sale del total.

La lógica está en `src/lib/quotes.js` y se prueba con `npm test`.

## Datos de ejemplo y cómo reemplazarlos

Todo lo que se ve al abrir la app por primera vez es **de ejemplo e inventado**:

- 14 presupuestos de clientes ficticios, en los tres estados y con importes distintos (definidas en `src/lib/seed.js`).
  Sus fechas son relativas a hoy, así que siempre hay algunas de este mes.
- Los datos del negocio (nombre, dirección, horario, enlace de Google Maps y redes sociales), en `src/config.js`.

Para pasar a datos reales:

1. Entra a `/admin` con la clave.
2. Pulsa **Vaciar todos los datos** y empieza a cargar los presupuestos reales desde la pantalla **Nuevo presupuesto**.
3. Edita en `src/config.js` el bloque `BUSINESS` con los datos reales de la empresa.
4. **Restaurar datos de ejemplo** (en `/admin`) vuelve a cargar la demostración.

Los datos viven en el `localStorage` de cada navegador (claves `presupuestos-jardineria.v1.*`): otro navegador u otro
dispositivo verá sus propios datos. Cuando exista backend, bastará con reemplazar `src/lib/storage.js` y `src/store.jsx`.

## Cómo cambiar la clave del panel de administración

1. Abre el archivo **`src/config.js`**.
2. Cambia el texto de la línea `export const ADMIN_KEY = 'jardin2026'` por la clave que quieras.
3. Guarda y vuelve a publicar (o reinicia `npm run dev`).

La clave de ejemplo es `jardin2026`. **Importante:** no es autenticación real. La clave va dentro del código que
descarga el navegador, así que solo evita que alguien entre por accidente. El login real queda para el backend.

## Estructura

```
src/
  config.js            clave del admin y datos del negocio
  store.jsx            estado de la app y guardado en localStorage
  lib/quotes.js        estados, dinero, fechas, totales del mes y validación
  lib/seed.js          datos de ejemplo
  lib/storage.js       acceso a localStorage con aviso si no está disponible
  auth.jsx             clave de acceso y sesión
  pages/               Gate (clave), Negocio (inicio), Listado, Nueva, Admin
  components/          íconos y piezas compartidas
tests/lib.test.js      pruebas de las reglas
```
