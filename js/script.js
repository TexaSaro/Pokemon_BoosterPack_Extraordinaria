
//CARRUSEL sacar cartas de la API

async function cargarCartasPokemon() {
  const track = document.getElementById('carousel-track');
  const loader = document.getElementById('loader'); // Usamos tu loader existente

  loader.style.display = "block"; // Mostrar loader
  track.innerHTML = ""; // Limpiar carrusel por si acaso

  try {
    const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=50');
    const data = await response.json();
    const cartas = data.data;

    // Elegir 6 al azar
    const cartasAleatorias = cartas.sort(() => 0.5 - Math.random()).slice(0, 6);

    // Duplicamos para bucle infinito
    const cartasDobles = [...cartasAleatorias, ...cartasAleatorias];

    // Inyectar en el DOM
    cartasDobles.forEach(carta => {
      const div = document.createElement('div');
      div.className = 'carousel-item-custom';
      div.innerHTML = `<img src="${carta.images.large}" alt="${carta.name}">`;
      track.appendChild(div);
    });

  } catch (error) {
    console.error('Error al cargar cartas Pokémon:', error);
  } finally {
    loader.style.display = "none"; // Ocultar loader al finalizar, con o sin error
  }
}


// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarCartasPokemon);
