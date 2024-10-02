"use strict";
window.addEventListener("load", () => {
  retriveCategories();
});

const form = document.querySelector("form");
const category = document.getElementById("select-category");
const game = document.getElementById("display-game");
const gameQuestion = document.getElementById("question");
const options = document.getElementById("options");
let index = 0;
let allQuestions = [];
let userAnswers = [];
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
  const itemsArray = data.results;
  //getting a new object from data to use each key later.
  allQuestions = itemsArray.map((item) => ({
    question: item.question,
    answers: [item.correct_answer, ...item.incorrect_answers].sort(
      () => Math.random() - 0.5
    ),
    correctAnswer: item.correct_answer,
  }));
  console.log(allQuestions);

  displayQuestion();
  displayAnswers();
}

function displayQuestion() {
  let questionArray = allQuestions[index];
  console.log("QuestionArray: ", questionArray);
  gameQuestion.innerHTML = questionArray.question;
}

function displayAnswers() {
  const questionArray = allQuestions[index];
  const answers = questionArray.answers;
  answers.forEach((answer, i) => {
    // const questionsdiv = document.getElementById("options");
    const wrapper = document.createElement("div");
    wrapper.classList.add("option");
    const inputLabel = document.createElement("label");
    const inputOption = document.createElement("input");
    inputOption.style.width = "fit-content";
    inputOption.id = `option${i}`;
    inputOption.type = "radio";
    inputOption.classList.add("option");
    inputOption.value = answer;
    inputOption.name = "option-input";
    inputLabel.htmlFor = inputOption.id;
    inputLabel.innerHTML = answer;
    //appending child elements to display them

    options.appendChild(wrapper);
    wrapper.appendChild(inputOption);
    wrapper.appendChild(inputLabel);

    //detecting when an option is selected
    //and making a continue button.
    inputOption.addEventListener("change", (e) => {
      e.preventDefault();
      let btnProceed = document.querySelector("#button-proceed");
      if (!btnProceed) {
        btnProceed = document.createElement("button");
        btnProceed.type = "submit";
        btnProceed.id = "button-proceed";
        btnProceed.innerHTML = "Proceed";
        options.appendChild(btnProceed);
      }
      //making disappear the question and the options
      //to jump into the next question
      options.addEventListener("submit", (e) => {
        e.preventDefault();
        const userInput = inputOption.value;
        userAnswers.push(userInput);
        game.removeChild(options);
        gameQuestion.innerHTML = "";
        index++;
        console.log(index);
      });
    });
  });
}
