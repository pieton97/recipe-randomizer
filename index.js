const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");

let searchQuery = "";
let mealType = "";
let glutenValue = "";
let vegetarianValue = "";
let choiesValue = 3;

const APP_ID = "74176646";
const APP_key = "55d890b681970d871b17e004556d946e";
const APP_ID_Key = `app_id=${APP_ID}&app_key=${APP_key}`;

// input to search recipe
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  searchQuery = e.target.querySelector("input").value;
  mealType = document.querySelector('input[name="meal-type"]:checked').value;

  let gluten = document.querySelector('input[name="gluten"]:checked');
  let vegetarian = document.querySelector('input[name="vegetarian"]:checked');
  glutenValue = (gluten === null) ? "" : `&health=${gluten.value}`;
  vegetarianValue = (vegetarian === null) ? "" : `&health=${vegetarian.value}`;
  
  let choices = document.querySelector('input[name="choices"]:checked');
  choiesValue = (choices === null) ? 3 : 6;
  fetchAPI();
});

// fetches recipe from api 
async function fetchAPI() {
  const baseURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&${APP_ID_Key}${glutenValue}${vegetarianValue}&mealType=${mealType}&random=true`

  const response = await fetch(baseURL);
  const data = await response.json();
  console.log("data:", data.hits);

  const recipeArray = data.hits;
  generateHTML(recipeArray.slice(0,choiesValue));
}

// convert (input: x minutes) to (x hrs) (x minutes)
function timeFormat(duration){
  let hrs = Math.floor(duration / 60);
  let mins = Math.floor(duration % 60);
  let time = "";
  if (hrs > 0) {
    time += "" + hrs + (hrs < 2 ? " hr " : " hrs ") + (mins < 10 ? "0" : "");
  }
  time += mins + " mins";
  return time;
}

// maps over each recipe and displays it to DOM
function generateHTML(results) {
  container.classList.remove("initial");
  let generatedHTML = "";

  results.map((result) => {
    let ingredients = "";
    for (let i = 0; i < result.recipe.ingredients.length; i++) {
      ingredients += "<li>" + result.recipe.ingredients[i].food + "</li>";
    };

    // accumulates each div.item into generatedHTML variable
    generatedHTML += `
      <div class="item">
        <div class="img-btn-flex">
          <div class="">
            <a target="_blank" href="${result.recipe.url}"><img src="${result.recipe.image}" alt="img"></a>  
          </div>
          <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
        </div>
        <div>
          <h2 class="">${result.recipe.label}</h2>
          <p>Calories: ${Math.round(result.recipe.calories)}</p>
          <p>Total time: ${result.recipe.totalTime > 0 ? timeFormat(result.recipe.totalTime) : "Varies"}</p>
          <p>Cuisine type: ${result.recipe.cuisineType[0]}</p>
          <p>Fat: ${Math.round(result.recipe.digest[0].total)} g</p>
          <p>Carbs: ${Math.round(result.recipe.digest[1].total)} g</p>
          <p>Protein: ${Math.round(result.recipe.digest[2].total)} g</p>
          <p>Diet label: 
            ${result.recipe.dietLabels.length > 0 ? 
              result.recipe.dietLabels : 
              "No data found"}
          </p>
        </div>
        <div>
          <h2>Ingredients:</h2>
          <ul>${ingredients}</ul>
        </div>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
}
