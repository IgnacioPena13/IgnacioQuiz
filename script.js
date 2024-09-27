"use strict";
window.addEventListener("load", () => {
  retriveCategories();
});

const form = document.querySelector("form");
const category = document.getElementById("select-category");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("start the game");
});

async function retriveCategories() {
  const response = await fetch(`https://opentdb.com/api_category.php`);
  const data = await response.json();
  const { trivia_categories } = data;
  console.log(trivia_categories);
  trivia_categories &&
    trivia_categories.map((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      category.appendChild(option);
    });
}

async function fetchData(category) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`
    );
    const data = await response.json();
    console.log("data", data);
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function displayData(data) {
  console.log("Data: ", data);
}

function findCategory(array, userInput) {
  const results = array.results;
  const cats = results.map((cat) => cat.category);
  const selectedCategory = cats.find((category) => category === userInput);

  if (!selectedCategory || selectedCategory === undefined) {
    alert("Category not found");
  }

  console.log(selectedCategory);

  return selectedCategory;
}
