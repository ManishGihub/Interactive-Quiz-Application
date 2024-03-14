// Array of quiz questions
const questions = [
  {
    question: "which is largest animal in the world?",
    answers: [
      { text: "Shark", correct: false },
      { text: "Elephant", correct: false },
      { text: "Blue Whale", correct: true },
      { text: "Giraffe", correct: false },
    ],
  },
  {
    question: "which is largest continent in the world?",
    answers: [
      { text: "Africa", correct: false },
      { text: "Asia", correct: true },
      { text: "Australia", correct: false },
      { text: "Antarctica", correct: false },
    ],
  },
  {
    question: "which is fruit among the following?",
    answers: [
      { text: "Mango", correct: true },
      { text: "Jawar", correct: false },
      { text: "Wheat", correct: false },
      { text: "Cauliflower", correct: false },
    ],
  },
  {
    question: "which is largest statue in the world",
    answers: [
      { text: "Vishwas Swaroopam", correct: false },
      { text: "Laykyun Sekkya", correct: false },
      { text: "Spring Temple Buddha", correct: false },
      { text: "Statue of Unity", correct: true },
    ],
  },
];

// DOM elements
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prevous-btn");
const submitButton = document.getElementById("submit-btn");
const timerElement = document.getElementById("timer");
const headingElement = document.getElementById("heading");
const submitModalButton = document.querySelector(
  "#staticBackdrop .modal-footer button.btn-primary"
);

// Variables
let currentQuestionIndex = 0; // Index of the current question
let score = 0; // Player's score
let timeLeft = 20; // Timer duration in seconds
let timerInterval; // Timer interval variable

// Function to shuffle questions array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to start the quiz
function startQuize() {
  shuffle(questions); // Shuffle the questions array
  score = 0;
  showQuestion();
  startTimer(); // Start the timer
}

// Function to display the current question
function showQuestion() {
  resetState(); // Reset the answer buttons
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("answer-btn", "btn", "btn-primary");
    answerButtons.appendChild(button);
    if (answer.selected) {
      // Check if answer was previously selected
      button.classList.add("selected");
    }
    button.addEventListener("click", selectAnswer);
  });

  // Disable previous button if it's the first question
  prevButton.disabled = currentQuestionIndex === 0;
  // Disable next button if it's the last question
  nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

// Function to reset the state of answer buttons
function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

// Function to handle answer selection
function selectAnswer(e) {
  const selectedBtn = e.target;

  // Remove "selected" class from all buttons
  answerButtons.querySelectorAll(".btn").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add "selected" class to the clicked button
  selectedBtn.classList.add("selected");

  // Update answer selection state
  questions[currentQuestionIndex].answers.forEach((answer) => {
    answer.selected = false;
    if (answer.text === selectedBtn.innerHTML) {
      answer.selected = true;
    }
  });

  // Update score
  score = 0;
  questions.forEach((question) => {
    question.answers.forEach((answer) => {
      if (answer.selected && answer.correct) {
        score++;
      }
    });
  });
}

// Function to display the final score
function showScore() {
  resetState(); // Reset the answer buttons
  headingElement.innerHTML = "Score"; // Update heading
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`; // Display score
  // Hide navigation buttons
  nextButton.style.display = "none";
  prevButton.style.display = "none";
  submitButton.style.display = "none";
  timerElement.style.display = "none"; // Hide timer
}

// Function to handle "Previous" button click
function handlePrevButton() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

prevButton.addEventListener("click", handlePrevButton);

// Function to handle "Next" button click
function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  }
});

// Function to handle "Submit" button click
submitModalButton.addEventListener("click", () => {
  // Close the modal
  const modal = document.getElementById("staticBackdrop");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  // Call showScore only when the submit button inside the modal is clicked
  showScore();
  stopTimer(); // Stop the timer when submitting
});

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    timerElement.textContent = "Time Left = " + timeLeft; // Update timer display
    timeLeft--; // Decrement time left

    if (timeLeft < 0) {
      // If time is up, display "Time is up!" message
      clearInterval(timerInterval); // Stop the timer
      document.getElementById("time-up-message").textContent = "Time is up!";
      showScore(); // Display the final score
    }
  }, 1000); // Update every second
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Start the quiz when the page loads
startQuize();
