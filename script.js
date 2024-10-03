"use strict";
window.addEventListener("load", () => {
  retriveCategories();
});

const form = document.getElementById("form-category");
const category = document.getElementById("select-category");
const game = document.getElementById("display-game");
const gameQuestion = document.getElementById("question");
const options = document.getElementById("options");
// const wrap1 = document.getElementById("wrapper1");
// const wrap2 = document.getElementById("wrapper2");
// const wrap3 = document.getElementById("wrapper3");
// const wrap4 = document.getElementById("wrapper4");
const allWrappers = document.getElementsByClassName("option");
const inputOption1 = document.getElementById("option1");
const inputOption2 = document.getElementById("option2");
const inputOption3 = document.getElementById("option3");
const inputOption4 = document.getElementById("option4");
const inputlabel1 = document.getElementById("label1");
const inputlabel2 = document.getElementById("label2");
const inputlabel3 = document.getElementById("label3");
const inputlabel4 = document.getElementById("label4");

let globalIndex = 0;
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
  console.log("allQuestions: ", allQuestions);

  displayQuestion();
  displayAnswers();
  globalIndex++;
  //detecting when an option is selected
  //and making a continue button.
  options.addEventListener("change", (e) => {
    e.preventDefault();
    let btnProceed = document.querySelector("#button-proceed");
    if (!btnProceed) {
      btnProceed = document.createElement("button");
      btnProceed.type = "submit";
      btnProceed.id = "button-proceed";
      btnProceed.innerHTML = "Proceed";
      options.appendChild(btnProceed);
    }
  });
  //jumping into the next question
  options.addEventListener("submit", (e) => {
    e.preventDefault();
    let selectedOption = document.querySelector(
      'input[name="option-input"]:checked'
    );
    let userInput = selectedOption.value;
    userAnswers.push(userInput);
    globalIndex++;

    console.log("userAnswers: ", userAnswers);
    gameQuestion.innerHTML = allQuestions[globalIndex].question;
  });
}

function displayQuestion() {
  let questionArray = allQuestions[globalIndex];
  console.log("QuestionArray: ", questionArray);
  gameQuestion.innerHTML = questionArray.question;
}

function displayAnswers() {
  const questionsArray = allQuestions[globalIndex];
  const answers = questionsArray.answers;
  console.log("answers", answers);

  // answers.forEach((answer) => {
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

  // const wrapper = document.createElement("div");
  // wrapper.classList.add("option");
  // wrapper.id = `wrapper${i}`;
  // const inputLabel = document.createElement("label");
  // const inputOption = document.createElement("input");
  // inputOption.style.width = "fit-content";
  // inputOption.id = `option${i}`;
  // inputOption.type = "radio";
  // inputOption.classList.add("option");
  // inputOption.value = answer;
  // inputOption.name = "option-input";
  // inputLabel.htmlFor = inputOption.id;
  // inputLabel.innerHTML = answer;

  //appending child elements to display them
  // options.appendChild(wrapper);
  // wrapper.appendChild(inputOption);
  // wrapper.appendChild(inputLabel);

  // });
}
