# Jaslaw — Sistema Integral de Gestión de Restaurante

Jaslaw es un prototipo web académico para apoyar la gestión operativa de un restaurante de cocina cartagenera. La interfaz presenta una carta de platos y bebidas, pedidos, reservas, caja y reportes. El proyecto se desarrolla como parte de la actividad AA2 de la Unidad 2— Gestión de la configuración, de la asignatura Gestión del Software, actividad educativa y de aprendizaje.

## Alcance del prototipo

El sistema incluye vistas de demostración para los perfiles de administrador, mesero y cliente. El administrador tiene acceso a la vista general y a las opciones de gestión; el mesero cuenta con una vista operativa de pedidos y reservas; el cliente puede consultar la carta y sus solicitudes de reserva.

La selección de perfil y la diferenciación de vistas se realizan en la interfaz. No constituyen autenticación ni seguridad de producción. Algunas acciones se conservan como demostración y deben validarse en el navegador según el perfil seleccionado.

Los datos se almacenan en el `localStorage` del navegador. Por ello, no se sincronizan entre dispositivos ni representan una base de datos centralizada. Los indicadores de caja y reportes son de demostración. El prototipo no procesa pagos ni genera facturas electrónicas.

## Tecnologías

- React y JavaScript
- HTML y CSS
- Vite para desarrollo y compilación
- `lucide-react` para iconos
- Git para control de versiones
- GitHub como repositorio remoto

## Requisitos

- Node.js y npm instalados
- Git, para trabajar con el repositorio

## Instalación y ejecución local

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/saraangarita/jaslaw-sigr.git
cd jaslaw-sigr
```

Estructura principal
jaslaw-sigr/
├── public/
│ └── images/ # Imágenes utilizadas en la carta
├── src/
│ ├── App.jsx # Interfaz, módulos y flujo del prototipo
│ ├── main.jsx # Punto de entrada de React
│ ├── permissions.js
│ └── styles.css # Estilos y adaptación responsive
├── index.html
├── package.json
└── vite.config.js

Módulos incluidos
Usuarios y perfiles: cambio entre perfiles de demostración.
Menú: consulta de platos y categorías; incluye acciones de administración en la interfaz.
Pedidos: creación y seguimiento de pedidos de demostración.
Reservas: registro y consulta de solicitudes; los estados se usan para demostrar el flujo de atención.
Caja y reportes: resúmenes e indicadores con información de demostración.
Datos y limitaciones
El prototipo utiliza registros de ejemplo y datos guardados localmente. No cuenta con backend, base de datos relacional, autenticación real, pagos, facturación electrónica ni actualización entre varios usuarios o dispositivos. La estructura de datos que podría utilizarse en una futura base de datos deberá tratarse como una propuesta, no como una base ya implementada.
