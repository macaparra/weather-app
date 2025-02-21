# WeatherApp
Aplicación construida con Angular que proporciona información meteorológica en tiempo real utilizando la API de WeatherAPI. Está diseñada para ser rápida, interactiva y optimizada para una experiencia de usuario fluida.

# Tecnologías utilizadas
- Angular: Framework para construir la aplicación web.
- TypeScript: Lenguaje principal utilizado para la lógica del código.
- WeatherAPI: API externa para obtener datos meteorológicos.
- CSS / SCSS: Estilos de la aplicación para una interfaz de usuario atractiva y responsiva.

# Requisitos previos
- Node.js (versión 16 o superior): Puedes descargarlo desde aquí.
- Angular CLI: Puedes instalarlo globalmente ejecutando npm install -g @angular/cli.
- API Key de WeatherAPI: Necesitarás una clave de API para acceder a los datos meteorológicos.
- Configuración de la API de WeatherAPI

# Para interactuar con la API de WeatherAPI, sigue estos pasos:

- Regístrate en WeatherAPI para obtener una API Key gratuita.
- Crea un archivo src/environments/environment.ts y agrega tus credenciales como se muestra a continuación:

export const environment = {
  production: false,
  apiUrl: 'https://api.weatherapi.com/v1',
  apiKey: 'TU_API_KEY_AQUI'
}

- Asegúrate de reemplazar 'TU_API_KEY_AQUI' con la clave de API que obtuviste.

# Configuración y ejecución del proyecto
- Clona este repositorio en tu máquina local:
git clone https://github.com/tu-usuario/weather-app.git

- Instala las dependencias del proyecto ejecutando:
cd weather-app
npm install

- Para iniciar el servidor de desarrollo local, ejecuta:
ng serve
La aplicación estará disponible en http://localhost:4200/.

# Optimizaciones realizadas
Búsqueda con autocompletado: Implementada para mejorar la experiencia del usuario al buscar ciudades.
Paginación: Los resultados de búsqueda se dividen en páginas para una mejor visualización.
Optimización de rendimiento: Utilizamos técnicas como el uso de observables y la optimización en las solicitudes HTTP para asegurar que la aplicación sea eficiente.