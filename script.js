//import { favMeal, addToFavourite } from "./fav-meals.js";
const mealContainer = document.getElementById("meal-container");
const favContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const search = document.getElementById("search");
const mealDesc = document.getElementById("desc-container");
const mealPopup = document.getElementById("meal-popup");
const closePopup = document.getElementById("close-popup");
getRandomMeal();
fetchFavourite();
async function getRandomMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const respData = await res.json();
  const mealData = respData.meals[0];
  loadMeal(mealData, true);
  //loadFavourites();
  console.log(mealData);
}
async function getMealById(id) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await res.json();
  const meal = respData.meals[0];
  return meal;
}
async function getMealByName(name) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
  );
  const resData = await res.json();
  const meal = await resData.meals;
  return meal;
}
function loadMeal(mealData, random = false) {
  //console.log(mealData.strMealThumb);
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = ` <div class="meal-header">
    ${random ? ` <span class="random-recipe">Random recipe</span>` : ""}
    <img
      src=${mealData.strMealThumb}
      alt=${mealData.strMeal}
    />
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="favourite"><i class="fa-regular fa-heart"></i></button>
  </div>`;
  //1.when we click the favourite buttoon the recipe has to be added to the favourite Meals.
  //2. The favourite button has to change its color
  //3.we have to select a specific meal so instead of document use meal.
  const favouriteButton = meal.querySelector(".favourite");
  const favouriteIcon = meal.querySelector(".favourite i");
  favouriteButton.addEventListener("click", () => {
    if (favouriteIcon.classList.contains("fa-solid")) {
      deleteMealLs(mealData.idMeal);
      favouriteIcon.classList.remove("fa-solid");
    } else {
      addMealLs(mealData.idMeal);
      favouriteIcon.classList.add("fa-solid");
    }
    fetchFavourite();
  });
  const mealHeader = meal.querySelector(".meal-header");
  mealHeader.addEventListener("click", () => {
    console.log("meal info clicked");
    //calling the show des method when meal is clicked
    showDesc(mealData);
  });
  mealContainer.appendChild(meal);
}
function loadFavourites(mealData) {
  const favMeal = document.createElement("li");
  // favMeal.classList.add("new-meal");
  favMeal.innerHTML = `
    <img
      src=${mealData.strMealThumb}
      alt="${mealData.strMeal}"
    /><span >${mealData.strMeal}</span>
    <button class="close-favmeal"><i class="fa-solid fa-xmark"></i></button>
  `;
  //select the close-favmeal class by using favMeal *** not by document
  const removebtn = favMeal.querySelector(".close-favmeal");
  removebtn.addEventListener("click", () => {
    console.log("close clicked:" + mealData.strMeal);
    deleteMealLs(mealData.idMeal);
    document.querySelector(".favourite").classList.remove("fa-solid");
    fetchFavourite();
  });
  favMeal.addEventListener("click", () => {
    showDesc(mealData);
  });

  favContainer.appendChild(favMeal);
}
function getMealsLs() {
  const meals = JSON.parse(localStorage.getItem("meals"));
  return meals === null ? [] : meals;
}
function addMealLs(mealId) {
  const mealIds = getMealsLs();
  localStorage.setItem("meals", JSON.stringify([...mealIds, mealId]));
  // console.log(mealIds);
}
function deleteMealLs(mealId) {
  const mealIds = getMealsLs();
  localStorage.setItem(
    "meals",
    JSON.stringify(mealIds.filter((id) => id !== mealId)) //check the syntax clearly {id!==mealId} not gonna work
  );
}
async function fetchFavourite() {
  favContainer.innerHTML = "";
  const mealIds = getMealsLs();
  // console.log(mealIds.length);
  for (const id of mealIds) {
    const mealData = await getMealById(id);
    loadFavourites(mealData);
  }
}
//retrieving recipe by using search
search.addEventListener("click", async () => {
  mealContainer.innerHTML = "";
  const meals = await getMealByName(searchTerm.value);
  if (meals) {
    meals.forEach((meal) => {
      loadMeal(meal);
    });
  }
});
closePopup.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
function showDesc(mealData) {
  mealPopup.classList.remove("hidden");
  const desc = document.getElementById("desc");
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]}-${mealData["strMeasure" + i]}`
      );
    } else break;
  }
  let li = "";
  for (const ingredient of ingredients) {
    li += `<li>${ingredient}</li>`;
  }
  desc.innerHTML = `
   <h2>${mealData.strMeal}</h2>
  <img
    src="${mealData.strMealThumb}"
    alt=""
  />
  <p>
    ${mealData.strInstructions}
  </p>
  <h4>Ingredients:</h4>
  <ul>
  ${li}
  </ul>`;
}
