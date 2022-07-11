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
  choiesValue = (choices === null) ? 3 : 7;
  console.log(choiesValue);

  fetchAPI();
});

const baseURL = `https://api.edamam.com/search?q=${searchQuery}&${APP_ID_Key}&from=0&to=20&random=true`;
const testURL3 = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&${APP_ID_Key}&health=gluten-free&health=vegetarian&mealType=Dinner&mealType=Lunch&random=true`;

// fetches recipe from api 
async function fetchAPI() {
  const testURL2 = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&${APP_ID_Key}${glutenValue}${vegetarianValue}&mealType=${mealType}&random=true`

  const response = await fetch(testURL2);
  const data = await response.json();
  console.log("data:", data);

  const recipeArray = data.hits;
  // console.log("array1" ,recipeArray[1]);

  generateHTML(recipeArray.slice(0,choiesValue));
}

// convert (input:minutes) to (x hrs) (x minutes)
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
    // console.log(result);
    
    // sorts ingredients into an html numbered list, stores in ingredients variable
    let ingredients = "";
    for (let i = 0; i < result.recipe.ingredients.length; i++) {
      ingredients += "<li>" + result.recipe.ingredients[i].food + "</li>";
    };

    // accumulates each item into generatedHTML variable
    generatedHTML += `
      <div class="item">
        <img src="${result.recipe.image}" alt="img">
        <div class="flex-container">
          <h1 class="title">${result.recipe.label}</h1>
          <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
        </div>
        <p class="item-data">Calories: ${Math.round(result.recipe.calories)}</p>
        <p>Total time: ${result.recipe.totalTime > 0 ? timeFormat(result.recipe.totalTime) : "Varies"}</p>
        <p>Cuisine type: ${result.recipe.cuisineType[0]}</p>
        <p>Fat: ${Math.round(result.recipe.digest[0].total)} g</p>
        <p>Carbs: ${Math.round(result.recipe.digest[1].total)} g</p>
        <p>Protein: ${Math.round(result.recipe.digest[2].total)} g</p>
        <p class="item-data">Diet label: ${
          result.recipe.dietLabels.length > 0
            ? result.recipe.dietLabels
            : "No data found"}
        </p>
        <ul>${ingredients}</ul>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
}
