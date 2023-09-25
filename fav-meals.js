export let favMeal = JSON.parse(localStorage.getItem("favMeal")) || [];
export function addToFavourite(mealData) {
  const mealId = mealData.idMeal;
  const mealImage = mealData.strMealThumb;
  const mealName = mealData.strMeal;
  const obj = { mealId, mealImage, mealName };
  //push mealid,mealimage,name as object to favMeals list
  addMeal(obj);
}
function addMeal(obj) {
  for (const meal of favMeal) {
    if (meal.mealId === obj.mealId) {
      // alert("already added to favourite");
      return;
    }
  }
  favMeal.push(obj);
  localStorage.setItem("favMeal", JSON.stringify(favMeal));
}
//Tried another way of adding items to fav meals list in a more generic way
//instead of pushing id,name img into list we just use id iin that method
//and by the use of getMealById(id) we can retrieve meal data
