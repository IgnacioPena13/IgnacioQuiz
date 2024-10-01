"use strict";
window.addEventListener("load", () => {
  retriveCategories();
});

const form = document.querySelector("form");
const category = document.getElementById("select-category");
const game = document.getElementById("display-game");
const gameQuestion = document.getElementById("question");
const options = document.getElementById("options");

let correctAnswers = [];
let incorrectAnswers = [];
const allAnswers = [];
const questionTitles = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData(category.value);
});

/*this function gets the categories from the API  
and adds each one to the select element as an option*/
async function retriveCategories() {
  const response = await fetch(`https://opentdb.com/api_category.php`);
  const data = await response.json();
  const { trivia_categories } = data;
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
      `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`
    );
    const data = await response.json();
    displayGame(data);
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function displayGame(data) {
  //display of the game
  game.style.display = "flex";
  form.style.display = "none";

  //create the questions array and mapping the answers to enlist them in an empty array
  const questionsArray = data.results;
  //destructuring the questions array to separate each question
  const [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10] = questionsArray;
  //getting the question and displaying it
  for (let i = 0; i < questionsArray.length; i++) {
    let title = questionsArray[i].question;
    questionTitles.push(title);
    gameQuestion.innerHTML = title;
  }
  const [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10] = questionTitles;
  //push every answer to the array
  questionsArray.map((item) => {
    const { correct_answer, incorrect_answers } = item;
    allAnswers.push(correct_answer);
    for (let i = 0; i < incorrect_answers.length; i++) {
      allAnswers.push(incorrect_answers[i]);
    }
  });
  const [ans1, ans2, ans3, ans4] = allAnswers;
  //at this point there are 2 different destructured arrays : questionsArray, allAnswers, questionTitles

  console.log(questionsArray);
  console.log(questionTitles);
  createOption(allAnswers);
}

function displayQuestion(titleArray, answerArray) {
  //try using a switch statement and displaying all the cases.
  let questionNumber = 0;
  questionsArray.forEach((element, i) => {});
}
function createOption(answerArray) {
  //create an option for every answer of the question using the previous array
  answerArray.map((answer, index) => {
    if (index >= 4) return;
    const inputOption = document.createElement("input");
    inputOption.id = `option${index}`;
    inputOption.type = "radio";
    inputOption.classList.add("option");
    inputOption.value = answer;
    inputOption.name = "option-input";
    const inputLabel = document.createElement("label");
    inputLabel.setAttribute = `for, option${index}`;
    inputLabel.textContent = answer;
    inputLabel.classList.add("option");
    //appending child elements to display them
    game.appendChild(options);
    options.appendChild(inputOption);
    inputOption.appendChild(inputLabel);
  });
}
