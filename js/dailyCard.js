const API_KEY = "d619c5e3-acdd-403b-853e-5ea282d4a1f0";

async function fetchDailyCard() {
  const $container = $("#daily-card-container");
  const $loader = $("#loader");
  const $button = $("#new-card-btn");

  $container.empty(); 
  $loader.show(); 
  $button.prop("disabled", true); 

  try {
    // Obtener el total de cartas para una selección aleatoria
    const metaRes = await fetch(
      "https://api.pokemontcg.io/v2/cards?pageSize=1",
      { headers: { "X-Api-Key": API_KEY } }
    );
    const { totalCount } = await metaRes.json();

    const pageSize = 1; 
    const randomPage = Math.floor(Math.random() * Math.ceil(totalCount / pageSize)) + 1;
    
    // Obtener las cartas de la página aleatoria
    const dataRes = await fetch(
      `https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${randomPage}`,
      { headers: { "X-Api-Key": API_KEY } }
    );
    const { data: cardsOnPage } = await dataRes.json();

    // Seleccionar una carta aleatoria de la página
    const randomCard = cardsOnPage[Math.floor(Math.random() * cardsOnPage.length)];

    if (!randomCard) {
      $container.html('<p class="text-danger text-center">No se pudo cargar una carta. Intenta de nuevo.</p>');
      return;
    }

    // Preparar los datos para el texto
    const cardName = randomCard.name || "desconocido";
    const collectionName = randomCard.set ? randomCard.set.name : "desconocida";
    const cardType = randomCard.types ? randomCard.types.join(", ") : "desconocido";
    const cardHp = randomCard.hp ? randomCard.hp : "N/A";
    const illustrator = randomCard.artist || "desconocido";

    const cardHtml = `
      <div class="col-12 col-md-5 text-center mb-4 mb-md-0">
        <img src="${randomCard.images.large}" class="img-fluid rounded shadow daily-card-img" alt="${randomCard.name}">
      </div>
      <div class="col-12 col-md-7 text-center text-md-start">
        <div class="card card-body bg-light p-4 rounded daily-card-info">
          <p class="mb-2">La carta de hoy es <strong class="text-primary">${cardName}</strong>.</p>
          <p class="mb-2">Pertenece a la colección <strong class="text-primary">${collectionName}</strong>. ESta carta es de tipo <strong class="text-primary">${cardType}</strong> y además tiene <strong class="text-primary">${cardHp}</strong> de vida.</p>
          <p class="mb-0">Ilustrada por <strong class="text-primary">${illustrator}</strong>.</p>
        </div>
      </div>
    `;
    $container.html(cardHtml); 

  } catch (error) {
    console.error("Error fetching daily card:", error);
    $container.html('<p class="text-danger text-center">Error al cargar la carta diaria.</p>');
  } finally {
    $loader.hide(); 
    $button.prop("disabled", false); 
  }
}

$(document).ready(function() {
  fetchDailyCard(); 
  $("#new-card-btn").on("click", fetchDailyCard); 
});