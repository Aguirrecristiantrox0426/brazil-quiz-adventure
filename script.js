const questions = [
  {
    category: "BRAZILIAN BASICS",
    question: "What is the official language of Brazil?",
    options: ["Spanish", "Portuguese", "English", "French"],
    answer: 1,
    explanation: "Portuguese is the official language of Brazil. Brazil is the largest Portuguese-speaking country in the world."
  },
  {
    category: "GEOGRAPHY",
    question: "What is the capital city of Brazil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    answer: 2,
    explanation: "Brasília is the capital of Brazil. It became the capital in 1960."
  },
  {
    category: "NATIONAL SYMBOLS",
    question: "Which colors appear on the Brazilian flag?",
    options: ["Red, white and blue", "Green, yellow and blue", "Black, red and yellow", "Green, white and orange"],
    answer: 1,
    explanation: "The Brazilian flag is mainly green and yellow, with a blue globe and white stars."
  },
  {
    category: "FAMOUS PLACES",
    question: "In which city can you visit Christ the Redeemer?",
    options: ["Brasília", "Manaus", "Rio de Janeiro", "Recife"],
    answer: 2,
    explanation: "Christ the Redeemer stands on Corcovado Mountain in Rio de Janeiro."
  },
  {
    category: "FESTIVALS",
    question: "What is the Brazilian Carnival famous for?",
    options: ["Snow and ice", "Music, dancing and colorful costumes", "Horse racing", "Traditional skiing"],
    answer: 1,
    explanation: "Brazilian Carnival is famous for samba parades, music, dancing and spectacular costumes."
  },
  {
    category: "NATURE",
    question: "Which famous rainforest is mostly located in Brazil?",
    options: ["Amazon Rainforest", "Black Forest", "Congo Forest", "Sherwood Forest"],
    answer: 0,
    explanation: "The Amazon Rainforest covers a large part of northern Brazil and is home to incredible biodiversity."
  },
  {
    category: "MONEY",
    question: "What is the currency of Brazil?",
    options: ["Peso", "Dollar", "Real", "Euro"],
    answer: 2,
    explanation: "Brazil's currency is the real. Its symbol is R$ and its plural form is reais."
  },
  {
    category: "SPORTS",
    question: "Which sport is Brazil especially famous for?",
    options: ["Basketball", "Football (soccer)", "Baseball", "Cricket"],
    answer: 1,
    explanation: "Brazil is internationally famous for football and has won the men's FIFA World Cup five times."
  },
  {
    category: "MUSIC & DANCE",
    question: "Which music and dance style is strongly associated with Brazil?",
    options: ["Samba", "Tango", "Flamenco", "Waltz"],
    answer: 0,
    explanation: "Samba is one of Brazil's best-known musical and dance styles, especially during Carnival."
  },
  {
    category: "FAMOUS PLACES",
    question: "What is the name of the famous statue on Corcovado Mountain?",
    options: ["The Statue of Liberty", "The Thinker", "Christ the Redeemer", "The Great Buddha"],
    answer: 2,
    explanation: "Christ the Redeemer is an iconic statue overlooking Rio de Janeiro from Corcovado Mountain."
  },
  {
    category: "WILDLIFE",
    question: "Which animal is a large cat native to the Amazon region?",
    options: ["Polar bear", "Jaguar", "Kangaroo", "Panda"],
    answer: 1,
    explanation: "The jaguar is the largest big cat in the Americas and lives in parts of the Amazon."
  },
  {
    category: "FOOD",
    question: "What is feijoada, a traditional Brazilian dish?",
    options: ["A bean and meat stew", "A fruit juice", "A sweet cake", "A seafood salad"],
    answer: 0,
    explanation: "Feijoada is a traditional Brazilian stew made with black beans and different cuts of meat."
  },
  {
    category: "GEOGRAPHY",
    question: "Which ocean borders Brazil to the east?",
    options: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Arctic Ocean"],
    answer: 2,
    explanation: "Brazil has a long coastline along the Atlantic Ocean."
  },
  {
    category: "LANDMARKS",
    question: "What is the name of the famous beach in Rio de Janeiro?",
    options: ["Copacabana", "Waikiki", "Bondi", "Barceloneta"],
    answer: 0,
    explanation: "Copacabana is one of Rio de Janeiro's most famous beaches."
  },
  {
    category: "NATURE",
    question: "What are the Iguaçu Falls famous for?",
    options: ["Being a desert", "Being a huge system of waterfalls", "Being a volcano", "Being a coral reef"],
    answer: 1,
    explanation: "Iguaçu Falls is a spectacular system of hundreds of waterfalls on the border of Brazil and Argentina."
  }
];

const state = {
  current: 0,
  correct: 0,
  score: 0,
  answered: false,
  selected: null
};

const $ = (id) => document.getElementById(id);
const letters = ["A", "B", "C", "D"];

function renderStairs() {
  const stairs = $("stairs");
  stairs.innerHTML = "";
  questions.forEach((_, index) => {
    const step = document.createElement("div");
    step.className = "step";
    step.dataset.number = index + 1;
    step.style.setProperty("--i", index);
    if (index < state.correct) step.classList.add("done");
    if (index === state.correct && state.current < questions.length) step.classList.add("current");
    stairs.appendChild(step);
  });
}

function updateProgress() {
  const climbed = state.correct;
  const percent = Math.round((climbed / questions.length) * 100);
  $("score").textContent = state.score;
  $("step-count").textContent = `${climbed} / ${questions.length}`;
  $("accuracy").textContent = state.current === 0 ? "—" : `${Math.round((state.correct / state.current) * 100)}%`;
  $("progress-percent").textContent = `${percent}%`;
  $("progress-fill").style.width = `${percent}%`;
  $("level-badge").textContent = climbed === 0 ? "STARTING POINT" : climbed === questions.length ? "SUMMIT REACHED" : `${climbed} STEPS CLIMBED`;
  $("progress-note").textContent = climbed === 0
    ? "You are at the starting point. Let's begin!"
    : climbed === questions.length
      ? "You made it! Welcome to the summit!"
      : `Great progress! ${questions.length - climbed} more correct answer${questions.length - climbed === 1 ? "" : "s"} to reach the top.`;
  renderStairs();
}

function renderQuestion() {
  const q = questions[state.current];
  state.answered = false;
  state.selected = null;
  $("question-number").textContent = `QUESTION ${state.current + 1} OF ${questions.length}`;
  $("category").textContent = q.category;
  $("question-text").textContent = q.question;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("next-btn").disabled = true;
  $("next-btn").innerHTML = state.current === questions.length - 1 ? "See my results <span>→</span>" : "Next question <span>→</span>";

  const answers = $("answers");
  answers.innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.innerHTML = `<span class="answer-letter">${letters[index]}</span><span>${option}</span>`;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
  updateProgress();
}

function chooseAnswer(index) {
  if (state.answered) return;
  state.answered = true;
  state.selected = index;
  const q = questions[state.current];
  const buttons = [...$("answers").children];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) button.classList.add("correct");
    if (i === index && index !== q.answer) button.classList.add("incorrect");
  });

  if (index === q.answer) {
    state.correct += 1;
    state.score += 10;
    $("feedback").textContent = `✓ Correct! ${q.explanation}`;
    $("feedback").className = "feedback good";
  } else {
    $("feedback").textContent = `✗ Not quite! The correct answer is ${letters[q.answer]}. ${q.explanation}`;
    $("feedback").className = "feedback bad";
  }

  $("next-btn").disabled = false;
  updateProgress();
}

function showResults() {
  const accuracy = Math.round((state.correct / questions.length) * 100);
  $("final-score").textContent = state.score;
  $("final-correct").textContent = `${state.correct}/${questions.length}`;
  $("final-accuracy").textContent = `${accuracy}%`;

  if (state.correct === questions.length) {
    $("result-icon").textContent = "🏆";
    $("result-title").textContent = "Perfect! You reached the top!";
    $("result-message").textContent = "Amazing! You answered every question correctly and conquered the Brazil Quiz Adventure.";
  } else if (state.correct >= 10) {
    $("result-icon").textContent = "🎉";
    $("result-title").textContent = "Congratulations, explorer!";
    $("result-message").textContent = "You made great progress on your journey through Brazil. Keep learning and exploring!";
  } else {
    $("result-icon").textContent = "🌴";
    $("result-title").textContent = "Adventure completed!";
    $("result-message").textContent = "Thanks for playing! Try again to learn more about Brazil and climb even higher.";
  }
  $("result-modal").classList.remove("hidden");
}

$("next-btn").addEventListener("click", () => {
  if (!state.answered) return;
  if (state.current === questions.length - 1) {
    showResults();
    return;
  }
  state.current += 1;
  renderQuestion();
});

$("restart-btn").addEventListener("click", () => {
  state.current = 0;
  state.correct = 0;
  state.score = 0;
  state.answered = false;
  state.selected = null;
  $("result-modal").classList.add("hidden");
  renderQuestion();
});

renderQuestion();
