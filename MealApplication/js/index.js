const MEALDB_SEARCH_URL = 'https://www.themealdb.com/api/json/v1/1/search.php';
const COCKTAILDB_RANDOM_SEARCH_URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: MEALDB_SEARCH_URL,
    data: {
      s: searchTerm,
     },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function getDrinkDataFromApi(drinkCallback) {
  const drinkSettings = {
    url: COCKTAILDB_RANDOM_SEARCH_URL,
    dataType: 'json',
    type: 'GET',
    success: drinkCallback
  };

  $.ajax(drinkSettings);
}

function scrollToMealResults() {
    $("#top").on('click', function() {
        var position = $("#image").offset().top;
        $("HTML, BODY").animate({ scrollTop: position }, 1000);
    });
 };

function renderResult(meal, index) {
  return `
    <div class="meal-wrapper">
        <p class="meal-name">${meal.strMeal}</p>
        <a href="#ingredients-modal-${index}" rel="modal:open" style="color: #3f3f3f;text-decoration:none;">
            <p class="meal-video">ingredients & instructions</p>
        </a>
          <a data-fancybox="gallery" href="https://my.newschool.edu/">
            <img src="${meal.strMealThumb}" class="meal-thumbnail-image">
         </a>
            <div id="ingredients-modal-${index}" class="modal">
            <p style = "color:#3f3f3f;font-size:22px;">Ingredients and steps:</p>
          <span style= "color:#3f3f3f;line-height: 1.5;">${renderIngredients(meal)}</span>
            <p class="meal-instructions" style = "color:#3f3f3f;line-height: 1.5;">${meal.strInstructions}</p>

            </div>
    </div>
  `
}

function renderIngredients(meal) {
  const list = Array(20).fill().map((_, i) => {
  const ingredientName = meal[`strIngredient${i + 1}`];
  if (ingredientName != null && ingredientName.trim()) {
  return `<li>${meal['strMeasure' + (i + 1)]}: ${meal['strIngredient' + (i + 1)]}</li>`;
  }
}).filter(x => x !== undefined).join('');
return `<ul>${list}</ul>`;
}

/*function renderDrinkIngredients(drink) {
    const list = Array(20).fill().map((_, i) => {
    const ingredientName = drink[`strIngredient${i + 1}`];
    if (ingredientName != null && ingredientName.trim()) {
    return `<li>${drink['strMeasure' + (i + 1)]}: ${drink['strIngredient' + (i + 1)]}</li>`;
    }
  }).filter(x => x !== undefined).join('');
  return `<ul>${list}</ul>`;
}
*/
function displayMealSearchData(results) {
  const html = results.meals.map(renderResult);
  $('.js-meal-search-results').html(html);
}

function displayDrinkData(results) {
  // const drinkHtml = results.drinks.map(renderDrinkResults);
  const drinkHtml = renderDrinkResults(results.drinks[0]);
  $('.js-drink-search-results').html(drinkHtml);
  $('#drink-modal').modal({ closeExisting: false });
}

function renderDrinkResults(drink) {
  return `
    <div class="modal" id="drink-modal">
      <p class="drink-name">${drink.strDrink}</p>
      <img src="${drink.strDrinkThumb}" class="drink-thumbnail-image">
      ${renderDrinkIngredients(drink)}
      <p class="drink-instructions">${drink.strInstructions}</p>
    </div>
  `
}

function addEventListeners() {
  watchMealSubmit();
  watchDrinkSubmit();
}

function watchMealSubmit() {
  //edit doc.body
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val(); //value is text typed in input box
    queryTarget.val("");
    $("main").prop('hidden', false)
    getDataFromApi(query, displayMealSearchData);
    scrollToMealResults();
  });
}

function watchDrinkSubmit() {
  $(document.body).on('click','.js-drink-form',(event) => {
    event.preventDefault();
    const drinkQueryTarget = $(event.currentTarget).find('.js-random-drink');
    getDrinkDataFromApi(displayDrinkData);
  });
}

$(addEventListeners);
