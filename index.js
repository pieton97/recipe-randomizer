const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");
let searchQuery = "";
const APP_ID = "74176646";
const APP_key = "55d890b681970d871b17e004556d946e";
const APP_ID_Key = `app_id=${APP_ID}&app_key=${APP_key}`;

// const cuisineType = "&cuisineType=American";

// input to search recipe
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchAPI();
});

const baseURL = `https://api.edamam.com/search?q=${searchQuery}&${APP_ID_Key}&from=0&to=20&random=true`;

// fetches recipe from api 
async function fetchAPI() {
  const testURL2 = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&${APP_ID_Key}&mealType=Dinner&random=true`

  const response = await fetch(testURL2);
  const data = await response.json();
  console.log("data:", data);
  // console.log("data part:", data.hits[0].recipe.digest);


  const recipeArray = data.hits;
  // console.log("array1" ,recipeArray[1]);

  generateHTML(recipeArray.slice(0,6));
}

// convert time to x hrs x minutes
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

// maps over each recipe and displays it
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
        <p>Meap type: ${result.recipe.mealType}</p>
        <p class="item-data">Diet label: ${
          result.recipe.dietLabels.length > 0
            ? result.recipe.dietLabels
            : "No Data Found"
        }</p>
        <p class="item-data">Health labels: ${result.recipe.healthLabels}</p>
        <ul>${ingredients}</ul>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
}
