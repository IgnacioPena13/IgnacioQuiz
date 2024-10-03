"use strict";
window.addEventListener("load", () => {
  //retrieves categories as soon as the window is loading
  retriveCategories();
});
//Assignment of HTML-elements
const form = document.getElementById("form-category");
const category = document.getElementById("select-category");
const game = document.getElementById("display-game");
const gameQuestion = document.getElementById("question");
const options = document.getElementById("options");
let btnProceed = document.querySelector("#button-proceed"); //not constant because it's values are going to be changed
const playAgain = document.getElementById("play-again-button");
let failsCount = document.getElementById("fails-counter");
let correctCount = document.getElementById("question-counter");
let pointsCount = document.getElementById("score-counter");
//Option items
const allWrappers = document.getElementsByClassName("option");
const inputOption1 = document.getElementById("option1");
const inputOption2 = document.getElementById("option2");
const inputOption3 = document.getElementById("option3");
const inputOption4 = document.getElementById("option4");
const inputlabel1 = document.getElementById("label1");
const inputlabel2 = document.getElementById("label2");
const inputlabel3 = document.getElementById("label3");
const inputlabel4 = document.getElementById("label4");
//arrays and global index to go to the next question
let globalIndex = 0;
let allQuestions = [];
let userAnswers = [];
let correctAnswers = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData(category.value);
});

/*this function gets the categories from the API  
and adds each one to the select element(category) as an option*/
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
/* fetch the data using the category that the user input */
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
  const itemsArray = await data.results;
  //getting a new object from data to use each key later.
  allQuestions = itemsArray.map((item) => ({
    question: item.question,
    answers: [item.correct_answer, ...item.incorrect_answers].sort(
      () => Math.random() - 0.5
    ), //answers are sorted inmediately so the correct answer is not always in the same place
    correctAnswer: item.correct_answer,
  }));
  console.log("allQuestions: ", allQuestions);
  console.log("correctAnswers: ", correctAnswers);
  //Starting the display of information
  displayQuestion();
  displayAnswers();
  console.log("My answers", userAnswers);
  console.log(globalIndex);
  /*detecting when an option is selected and making a continue button.*/
  options.addEventListener("change", (e) => {
    e.preventDefault();
    if (!btnProceed) {
      btnProceed = document.createElement("button");
      btnProceed.type = "submit";
      btnProceed.id = "button-proceed";
      btnProceed.innerHTML = "Proceed";
      options.appendChild(btnProceed);
    }
  });
  /*adding an event listener to the options
  to display a new button to continue to the next question*/
  options.addEventListener("submit", (e) => {
    e.preventDefault();
    globalIndex++;
    let selectedOption = document.querySelector(
      'input[name="option-input"]:checked'
    );
    let userInput = selectedOption.value;
    userAnswers.push(userInput); //passing the answer to a new array for the final check
    if (!globalIndex === 9) {
      correctAnswers.push(allQuestions[globalIndex].correctAnswer);
    }
    console.log("correct: ", correctAnswers);

    if (globalIndex === 9) {
      endGame();
      return;
    } else if (globalIndex >= 1) {
      displayQuestion();
      displayAnswers();
      console.log("My answers", userAnswers);
      console.log(globalIndex);
    }
  });
}

function displayQuestion() {
  let questionArray = allQuestions[globalIndex];
  gameQuestion.innerHTML = `Question ${globalIndex + 1}: ${
    questionArray.question
  }`;
}

function displayAnswers() {
  const questionsArray = allQuestions[globalIndex];
  const answers = questionsArray.answers;
  // assignment of an answer to each option.
  inputOption1.value = answers[0];
  inputlabel1.htmlFor = inputOption1.id;
  inputlabel1.innerHTML = inputOption1.value;
  inputOption2.value = answers[1];
  inputlabel2.htmlFor = inputOption2.id;
  inputlabel2.innerHTML = inputOption2.value;
  inputOption3.value = answers[2];
  inputlabel3.htmlFor = inputOption3.id;
  inputlabel3.innerHTML = inputOption3.value;
  inputOption4.value = answers[3];
  inputlabel4.htmlFor = inputOption4.id;
  inputlabel4.innerHTML = inputOption4.value;
}
function endGame() {
  //checking the value of the global index, if it's 9 the game is ending
  playAgain.style.display = "flex";
  gameQuestion.style.display = "none";
  options.style.display = "none";
  options.removeChild(btnProceed);
  getScore();
}
/**
 * compares two arrays to count how many questions are correct
 * and how many fails there are
 * for every correct answer player gets 10p.
 */
function getScore() {
  // userAnswers
  // correctAnswers
  let failsNumber = 0;
  let correctNumber = 0;
  let points = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    userAnswers.filter(() => {
      if (!correctAnswers.includes(userAnswers[i])) {
        failsNumber++;
      } else {
        correctNumber++;
        points + 10;
      }
    });
  }
  pointsCount.innerHTML = "Score: " + points;
  failsCount.innerHTML = "Fails: " + failsNumber;
  correctCount.innerHTML = "Correct: " + correctNumber;
}
