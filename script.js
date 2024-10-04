"use strict";

// Assignment of HTML-elements
const form = document.getElementById("form-category");
const category = document.getElementById("select-category");
const game = document.getElementById("display-game");
const gameQuestion = document.getElementById("question");
const options = document.getElementById("options");
let btnProceed = document.querySelector("#button-proceed"); // This will be created dynamically
const playAgain = document.getElementById("play-again-button");
let failsCount = document.getElementById("fails-counter");
let correctCount = document.getElementById("question-counter");
let pointsCount = document.getElementById("score-counter");
let highscoreText = document.getElementById("highscore");
let points = localStorage.getItem("score")
  ? Number(localStorage.getItem("score"))
  : 0;
let lastGame = document.getElementById("last-game");
let lastScore = Number(localStorage.getItem("last-game-points"));

// Option items
const inputOption1 = document.getElementById("option1");
const inputOption2 = document.getElementById("option2");
const inputOption3 = document.getElementById("option3");
const inputOption4 = document.getElementById("option4");
const inputlabel1 = document.getElementById("label1");
const inputlabel2 = document.getElementById("label2");
const inputlabel3 = document.getElementById("label3");
const inputlabel4 = document.getElementById("label4");

// Arrays and global index to move to the next question
let globalIndex = 0;
let allQuestions = [];
let userAnswers = new Set();
let correctSet = new Set();
let incorrect = new Set([]);

window.addEventListener("load", () => {
  // Retrieve categories as soon as the window loads
  retriveCategories();
  console.log(localStorage.getItem("score"));
  pointsCount.innerHTML = `Score: ${points}`;
  if (localStorage.getItem("last-game-points")) {
    lastGame.innerHTML = `Last Game Score: ${lastScore}`;
    console.log(lastScore);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData(category.value);
});

/* This function gets the categories from the API  
and adds each one to the select element (category) as an option */
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

/* Fetch the data using the category that the user selects */
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
  // Display the game
  game.style.display = "flex";
  form.style.display = "none";

  // Create the questions array and shuffle answers
  const itemsArray = await data.results;

  // Store each question with its answers, and store correct and incorrect answers
  allQuestions = itemsArray.map((item) => ({
    question: item.question,
    answers: [item.correct_answer, ...item.incorrect_answers].sort(
      () => Math.random() - 0.5
    ), // Shuffle answers
    correctAnswer: item.correct_answer, // Store correct answer
  }));

  // Store correct and incorrect answers in Sets for score calculation
  allQuestions.forEach((item) => {
    correctSet.add(item.correctAnswer);
    item.answers.forEach((answer) => {
      if (answer !== item.correctAnswer) incorrect.add(answer);
    });
  });

  // Start the display of information
  displayQuestion();
  displayAnswers();

  /* Detecting when an option is selected and making a continue button */
  options.addEventListener("change", (e) => {
    e.preventDefault();
    if (!btnProceed) {
      btnProceed = document.createElement("button");
      btnProceed.type = "button"; // Changed to button for click event
      btnProceed.id = "button-proceed";
      btnProceed.innerHTML = "Proceed";
      options.appendChild(btnProceed);
      btnProceed.addEventListener("click", proceedToNextQuestion); // Event listener for Proceed button
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
  // Assignment of answers to each option
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

function proceedToNextQuestion(e) {
  e.preventDefault();
  let selectedOption = document.querySelector(
    'input[name="option-input"]:checked'
  );
  let userInput = selectedOption ? selectedOption.value : null;

  if (userInput) {
    // Add user's answer to the set
    userAnswers.add(userInput);

    // If global index reaches the last question, end the game
    if (globalIndex === allQuestions.length - 1) {
      endGame();
    } else {
      globalIndex++;
      displayQuestion();
      displayAnswers();
    }
  }
}

function endGame() {
  // End the game and show the final score
  playAgain.style.display = "flex";
  gameQuestion.style.display = "none";
  options.style.display = "none";
  options.removeChild(btnProceed);
  getScore();
}

/**
 * Compares the user's answers with correct answers
 * and calculates the score based on correct answers.
 * For every correct answer, the player gets 10 points.
 */
function getScore() {
  let failsNumber = 0;
  let correctNumber = 0;

  userAnswers.forEach((answer) => {
    if (correctSet.has(answer)) {
      correctNumber++;
      points += 10;
    } else {
      failsNumber++;
    }
  });
  switch (true) {
    case failsNumber === 0:
      console.log("Perfect!!");
      break;
    case failsNumber < 3:
      console.log("Not bad!");
      break;
    case failsNumber > 5 && failsNumber != 10:
      console.log("Did you even try?");
      break;
    case failsNumber === 10:
      console.log("Bruh");
      break;
  }
  if (points > Number(localStorage.getItem("lastGamePoints"))) {
    highscoreText.innerHTML = "New Highscore!";
    highscoreText.style.display = "flex";
  }
  pointsCount.innerHTML = `Score: ${points}`;
  failsCount.innerHTML = "Fails: " + failsNumber;
  correctCount.innerHTML = "Correct: " + correctNumber;
  restartGame(points);
}

function restartGame(score) {
  playAgain.addEventListener("click", () => {
    localStorage.setItem("lastGamePoints", score);
    localStorage.setItem("score", score);
    console.log(localStorage.score);
    window.location.reload();
  });
}
