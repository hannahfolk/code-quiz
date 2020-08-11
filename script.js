// Set the necessary elements from the DOM
var body = document.body;
var container = document.querySelector(".container");
var pages = document.querySelectorAll(".page");
var startQuizBtn = document.querySelector("#start-quiz");
var h2El = document.querySelector("#question-header");
var choices = document.querySelectorAll(".choice");
var message = document.querySelector("#out-of-time-page");
var yesBtn = document.querySelector("#yes");
var noBtn = document.querySelector("#no");
var bye = document.querySelector("#bye-bye");
var score = document.querySelector("#score");
var formInput = document.querySelector("#initials");
var submitBtn = document.querySelector("#submit");
var ulEl = document.querySelector("ul");
var backBtn = document.querySelector("#back-btn");
var clearBtn = document.querySelector("#clear-btn");
var error = document.querySelector("#error");
var highscores = document.querySelector("#highscores");

// Set variable for which page user is currently on
var currentPage = 0;

// Set variable for which question user is currently on
var currentQuestion = 0;

// Setting evaluating variables
var evaluateDiv = document.createElement("div");
evaluateDiv.setAttribute("class", "evaluate off");
var hrEl = document.createElement("hr");
var rightOrWrongEl = document.createElement("p");
rightOrWrongEl.setAttribute("id", "right-or-wrong");
container.appendChild(evaluateDiv);
evaluateDiv.appendChild(hrEl);
evaluateDiv.appendChild(rightOrWrongEl);

// Create an array of users
var users = [];

// Set index for which user
var userNum;
// If there are no users, set userNum = 1
if (JSON.parse(localStorage.getItem("users")) === null) {
  userNum = 1;
} // If there are users, userNum = the number of users + 1
else {
  userNum = JSON.parse(localStorage.getItem("users")).length + 1;
}

// Create questions array.
var questions = [
  {
    title: "Which of the following is NOT one of the six FRIENDS?",
    choices: ["Joey", "Monica", "Ellen", "Phoebe"],
    answer: "Ellen",
  },
  {
    title: "How many seasons of FRIENDS are there?",
    choices: ["12", "10", "9", "11"],
    answer: "10",
  },
  {
    title:
      "What is the name of the Central Perk barista who has a crush on Rachel?",
    choices: ["James", "Arnold", "Donald", "Gunther"],
    answer: "Gunther",
  },
  {
    title:
      "What is the name that appears on the address label of Chandler's TV guide?",
    choices: [
      "Ms. Chanandler Bong",
      "Chanandler Bong",
      "Chandler Bing",
      "Chandler Bong",
    ],
    answer: "Ms. Chanandler Bong",
  },
  {
    title:
      'In what season is "The One With the Prom Video", where Rachel and Ross finally get together?',
    choices: ["3", "6", "2", "10"],
    answer: "2",
  },
];

// Setting the time in the top right corner
var timeEl = document.querySelector("#time-left");
var secondsLeft = questions.length * 15;
var timer;

// FUNCTIONS

function loadPage(n) {
  pages[currentPage].classList.remove("active");
  pages[n].classList.add("active");
  currentPage = n;
}

function loadNextPage() {
  loadPage(currentPage + 1);
  timeEl.textContent = secondsLeft;

  // Starts the clock
  if (currentPage === 1) {
    setTime();
  }

  // This is the "All done!" page
  if (currentPage === 6) {
    // Setting user's score
    score.textContent = secondsLeft;

    // Stops the clock
    clearInterval(timer);
  }
}

// Checks to see if the answer is right or wrong
function evaluateAnswer(event) {
  event.preventDefault();

  evaluateDiv.classList.remove("off");
  evaluateDiv.classList.add("on");

  // If answer is right, show "Correct!" for a second.
  if (event.target.textContent === questions[currentQuestion].answer) {
    rightOrWrongEl.textContent = "Correct!";
  } // If answer is wrong, show "Wrong!" for a second.
  else {
    rightOrWrongEl.textContent = "Wrong!";

    // Time penalty for getting the answer wrong.
    if (secondsLeft > 10) {
      secondsLeft -= 10;
      timeEl.textContent = secondsLeft;
    }
  }
  currentQuestion++;

  // Make the evaluate div disappear
  setRightOrWrongTime();
}

// Sets the timer for the quiz
function setTime() {
  timer = setInterval(function () {
    secondsLeft--;
    timeEl.textContent = secondsLeft;

    if (secondsLeft === 0) {
      clearInterval(timer);

      // Sends the "Out of time!" message
      sendMessage();
    }
  }, 1000);
}

// Send an "Out of time!" message
function sendMessage() {
  pages[currentPage].classList.remove("active");
  message.classList.remove("off");
  message.classList.add("on");

  // If yes, return to start page.
  yesBtn.addEventListener("click", function (event) {
    event.preventDefault();

    loadPage(0);
    message.classList.remove("on");
    message.classList.add("off");
    secondsLeft = questions.length * 15;
  });

  // If no, say goodbye.
  noBtn.addEventListener("click", function (event) {
    event.preventDefault();

    bye.classList.remove("off");
    bye.classList.add("on");
    message.classList.remove("on");
    message.classList.add("off");
  });
}

// Makes the "Correct!" or "Wrong!" only appear for a second
function setRightOrWrongTime() {
  var timer = setInterval(function () {
    var second = 1;
    second--;

    if (second === 0) {
      clearInterval(timer);
      evaluateDiv.classList.remove("on");
      evaluateDiv.classList.add("off");
    }
  }, 1000);
}

// Iterate through the users array to show the highscore on the page
function renderUsers() {
  // Clear the list element so that its a clean slate every time
  ulEl.innerHTML = "";

  // Render a new li for each highscore
  for (var i = 0; i < users.length; i++) {
    // Create a new user object that pulls from the user array
    var user = users[i];

    // Set the text content of the list element to the user's information
    var li = document.createElement("li");
    li.textContent = user.userNum + ". " + user.initials + " - " + user.score;

    // Append the list element to the unordered list
    ulEl.appendChild(li);
  }
}

// Store the users in local storage
function storeUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function init() {
  // Get stored past highscores from local storage
  // Parse the JSON string into an object
  var storedUsers = JSON.parse(localStorage.getItem("users"));

  // If there are users in the local storage, set the users array to that array
  if (storedUsers !== null) {
    users = storedUsers;
  }

  renderUsers();
}

// Iterate through all the choices buttons to add an "ON CLICK" event for them to
// 1. load the next page
// 2. evaluate if the answer is right or wrong
for (var i = 0; i < choices.length; i++) {
  choices[i].addEventListener("click", evaluateAnswer);
  choices[i].addEventListener("click", loadNextPage);
}

// If "Submit" button is clicked,
// load the highscores page
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // Data validation on initials form
  if (
    formInput.value !== "null" &&
    formInput.value !== "" &&
    (formInput.value.length == 2 || formInput.value.length == 3)
  ) {
    loadNextPage();
    formInput.value = formInput.value.toUpperCase();
  } else {
    error.classList.remove("off");
    error.classList.add("on");
  }

  // Create a user object to store in users array
  var user = {
    userNum: userNum,
    initials: formInput.value,
    score: secondsLeft,
  };

  // Add new highscore to users array
  users.push(user);

  renderUsers();
  storeUsers();
});

// If "Go back" button is clicked,
// load the start page
// reset all the values
// raise the userNum by one, since its a new quiz
backBtn.addEventListener("click", function (event) {
  event.preventDefault();

  loadPage(0);
  currentQuestion = 0;
  formInput.value = "";
  secondsLeft = questions.length * 15;
  userNum++;
});

// If "Clear highscores" button is clicked,
// clear the list of highscores
// reset the userNum back to 0
// clear the local storage
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();

  ulEl.innerHTML = "";

  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  userNum = 0;
});

// If "View Highscores" is clicked, take user to highscore page
highscores.addEventListener("click", function () {
  loadPage(7);

  // If there are no users, set userNum = 1
  if (JSON.parse(localStorage.getItem("users")) === null) {
    userNum = 1;
  } // If there are users, userNum = the number of users
  else {
    userNum = JSON.parse(localStorage.getItem("users")).length;
  }

  // Stops the clock
  clearInterval(timer);
});

// Call the functions
loadPage(0);
startQuizBtn.addEventListener("click", loadNextPage);
init();
