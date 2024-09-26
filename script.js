"use strict";

async function fetchData() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=9"
    );
    const data = await response.json();
    displayData(data);
  } catch {
    console.error(error);
  }
}
async function displayData(data) {
  console.log(data);
}

fetchData();
