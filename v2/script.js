/*
 * Brazil Quiz Adventure V2
 * Uses local image assets in /v2/assets and optional shared Supabase storage.
 * Public leaderboard note: anyone can submit a result using the public key.
 */

const QUESTIONS = [
 {category:"BRAZILIAN BASICS",q:"What is the official language of Brazil?",a:["Spanish","Portuguese","English","French"],correct:1,why:"Portuguese is the official language of Brazil."},
 {category:"GEOGRAPHY",q:"What is the capital city of Brazil?",a:["São Paulo","Rio de Janeiro","Brasília","Salvador"],correct:2,why:"Brasília is the capital of Brazil."},
 {category:"NATIONAL SYMBOLS",q:"Which colors appear on the Brazilian flag?",a:["Red, white and blue","Green, yellow and blue","Black, red and yellow","Green, white and orange"],correct:1,why:"The Brazilian flag is mainly green and yellow, with a blue globe and white stars."},
 {category:"FAMOUS PLACES",q:"In which city can you visit Christ the Redeemer?",a:["Brasília","Manaus","Rio de Janeiro","Recife"],correct:2,why:"Christ the Redeemer stands on Corcovado Mountain in Rio de Janeiro."},
 {category:"FESTIVALS",q:"What is the Brazilian Carnival famous for?",a:["Snow and ice","Music, dancing and colorful costumes","Horse racing","Traditional skiing"],correct:1,why:"Brazilian Carnival is famous for samba parades, music and spectacular costumes."},
 {category:"NATURE",q:"Which famous rainforest is mostly located in Brazil?",a:["Amazon Rainforest","Black Forest","Congo Forest","Sherwood Forest"],correct:0,why:"The Amazon Rainforest covers a large part of northern Brazil."},
 {category:"MONEY",q:"What is the currency of Brazil?",a:["Peso","Dollar","Real","Euro"],correct:2,why:"Brazil's currency is the real."},
 {category:"SPORTS",q:"Which sport is Brazil especially famous for?",a:["Basketball","Football (soccer)","Baseball","Cricket"],correct:1,why:"Brazil is internationally famous for football."},
 {category:"MUSIC & DANCE",q:"Which music and dance style is strongly associated with Brazil?",a:["Samba","Tango","Flamenco","Waltz"],correct:0,why:"Samba is one of Brazil's best-known musical and dance styles."},
 {category:"FAMOUS PLACES",q:"What is the name of the famous statue on Corcovado Mountain?",a:["The Statue of Liberty","The Thinker","Christ the Redeemer","The Great Buddha"],correct:2,why:"Christ the Redeemer overlooks Rio de Janeiro from Corcovado Mountain."},
 {category:"WILDLIFE",q:"Which large cat is native to the Amazon region?",a:["Polar bear","Jaguar","Kangaroo","Panda"],correct:1,why:"The jaguar is the largest big cat in the Americas."},
 {category:"FOOD",q:"What is feijoada, a traditional Brazilian dish?",a:["A bean and meat stew","A fruit juice","A sweet cake","A seafood salad"],correct:0,why:"Feijoada is a traditional stew made with black beans and meat."},
 {category:"GEOGRAPHY",q:"Which ocean borders Brazil to the east?",a:["Pacific Ocean","Indian Ocean","Atlantic Ocean","Arctic Ocean"],correct:2,why:"Brazil has a long coastline along the Atlantic Ocean."},
 {category:"LANDMARKS",q:"What is the name of a famous beach in Rio de Janeiro?",a:["Copacabana","Waikiki","Bondi","Barceloneta"],correct:0,why:"Copacabana is one of Rio de Janeiro's most famous beaches."},
 {category:"NATURE",q:"What are Iguaçu Falls famous for?",a:["Being a desert","Being a huge system of waterfalls","Being a volcano","Being a coral reef"],correct:1,why:"Iguaçu Falls is a spectacular system of waterfalls on the Brazil–Argentina border."}
];

/*
 * Paths are relative to v2/index.html.
 * Each stage uses an image uploaded in v2/assets.
 * The Corcovado approach uses corcovado trail.png and the summit uses
 * cristo redentor.jpg.
 */
const STAGES = [
 {name:"Copacabana Beach",desc:"Your adventure begins beside Rio's famous coastline.",image:"assets/rio%20de%20janeiro.jpg"},
 {name:"Sugarloaf Mountain",desc:"Keep climbing and discover one of Rio's best-known landmarks.",image:"assets/Sugarloaf%20Mountain.jpg"},
 {name:"Tijuca National Park",desc:"Travel through the lush green nature of Brazil.",image:"assets/tropical%20forest.jpg"},
 {name:"Corcovado Mountain",desc:"The summit is getting closer. Continue your climb toward the famous statue.",image:"assets/corcovado%20trail.png"},
 {name:"Christ the Redeemer",desc:"You made it to the top! Enjoy the view over Rio de Janeiro.",image:"assets/cristo%20redentor.jpg"}
];

const PENALTY_SECONDS = 10;
const $ = id => document.getElementById(id);
const letters = ["A","B","C","D"];

let player = null;
let questionIndex = 0;
let correctCount = 0;
let penaltySeconds = 0;
let startedAt = 0;
let timerHandle = null;
let answered = false;
let supabaseClient = null;

function initializeSupabase() {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url.includes("YOUR_") || key.includes("YOUR_")) {
    console.info("Supabase is not configured. The game will use local browser storage.");
    return;
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase JS library did not load.");
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(url, key);
  } catch (error) {
    console.error("Could not initialize Supabase:", error);
  }
}

function showScreen(id) {
  ["welcome-screen","game-screen","results-screen","leaderboard-screen"]
    .forEach(screen => $(screen).classList.toggle("hidden", screen !== id));
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(whole / 60)).padStart(2,"0")}:${String(whole % 60).padStart(2,"0")}`;
}

function elapsedSeconds() {
  return Math.floor((Date.now() - startedAt) / 1000);
}

function updateTimer() {
  $("timer").textContent = formatTime(elapsedSeconds());
  $("penalty-label").textContent = `+${formatTime(penaltySeconds)} penalty`;
}

function stageIndex() {
  return Math.min(STAGES.length - 1, Math.floor(questionIndex / 3));
}

function updateJourney() {
  const stage = STAGES[stageIndex()];
  const stageImage = $("scene-image");
  stageImage.style.backgroundImage = `url("${stage.image}")`;
  stageImage.style.backgroundColor = "#277d50";

  $("stage-tag").textContent = `STAGE ${stageIndex() + 1} OF ${STAGES.length}`;
  $("scene-title").textContent = stage.name;
  $("scene-description").textContent = stage.desc;

  // Count the current question as the active step. This allows the bar
  // to reach 100% while question 15 is displayed.
  const progress = Math.round(((questionIndex + 1) / QUESTIONS.length) * 100);
  $("progress-label").textContent = `Step ${questionIndex + 1} of ${QUESTIONS.length}`;
  $("progress-percent").textContent = `${progress}% completed`;
  $("progress-fill").style.width = `${progress}%`;

  $("stage-dots").innerHTML = STAGES
    .map((item, index) => `<span class="${index <= stageIndex() ? "active" : ""}" title="${escapeHtml(item.name)}"></span>`)
    .join("");
}

function renderQuestion() {
  answered = false;
  const question = QUESTIONS[questionIndex];

  $("question-counter").textContent = `QUESTION ${questionIndex + 1} OF ${QUESTIONS.length}`;
  $("question-category").textContent = question.category;
  $("question-text").textContent = question.q;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("next-button").disabled = true;
  $("next-button").textContent = questionIndex === QUESTIONS.length - 1
    ? "Finish adventure →"
    : "Next question →";

  $("answers").innerHTML = question.a.map((answer, index) =>
    `<button class="answer" type="button" data-index="${index}">
      <span class="letter">${letters[index]}</span><span>${escapeHtml(answer)}</span>
    </button>`
  ).join("");

  [...$("answers").children].forEach(button => {
    button.addEventListener("click", () => chooseAnswer(Number(button.dataset.index)));
  });

  updateJourney();
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;

  const question = QUESTIONS[questionIndex];
  const buttons = [...$("answers").children];

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === question.correct) button.classList.add("correct");
    if (buttonIndex === index && index !== question.correct) button.classList.add("wrong");
  });

  if (index === question.correct) {
    correctCount += 1;
    $("feedback").textContent = `✓ Correct! ${question.why} Keep climbing!`;
    $("feedback").className = "feedback good";
  } else {
    penaltySeconds += PENALTY_SECONDS;
    $("feedback").textContent =
      `✗ Not quite! +${PENALTY_SECONDS} seconds penalty. The correct answer is ${letters[question.correct]}. ${question.why} You can continue!`;
    $("feedback").className = "feedback bad";
  }

  $("header-score").textContent = correctCount * 10;
  $("penalty-label").textContent = `+${formatTime(penaltySeconds)} penalty`;
  $("next-button").disabled = false;
}

function startGame(name, nickname) {
  player = { name: name.trim(), nickname: nickname.trim() };
  questionIndex = 0;
  correctCount = 0;
  penaltySeconds = 0;
  startedAt = Date.now();

  $("greeting").textContent = `Good luck, ${player.nickname}!`;
  $("header-score").textContent = "0";
  showScreen("game-screen");
  renderQuestion();

  clearInterval(timerHandle);
  timerHandle = setInterval(updateTimer, 250);
  updateTimer();
}

async function saveResult(result) {
  if (supabaseClient) {
    const { error } = await supabaseClient.from("game_results").insert([result]);

    if (error) {
      console.error("Supabase insert failed:", error);
      $("save-status").textContent =
        "Your result could not be saved online. Check the Supabase table, API key and RLS policies.";
      return false;
    }

    $("save-status").textContent = "Your result has been saved to the global leaderboard!";
    return true;
  }

  try {
    const local = JSON.parse(localStorage.getItem("brazilQuizResults") || "[]");
    local.push({ ...result, id: Date.now() });
    localStorage.setItem("brazilQuizResults", JSON.stringify(local));
    $("save-status").textContent =
      "Saved on this device only. Add your Supabase Project URL and Publishable key to share results across phones.";
    return true;
  } catch (error) {
    console.error("Local save failed:", error);
    $("save-status").textContent = "Your result could not be saved in this browser.";
    return false;
  }
}

async function finishGame() {
  clearInterval(timerHandle);

  const rawSeconds = elapsedSeconds();
  const finalSeconds = rawSeconds + penaltySeconds;

  $("final-time").textContent = formatTime(finalSeconds);
  $("final-penalty").textContent = formatTime(penaltySeconds);
  $("final-correct").textContent = `${correctCount} / ${QUESTIONS.length}`;
  $("finish-title").textContent = correctCount === QUESTIONS.length
    ? "Perfect climb! You reached the summit!"
    : "You reached Christ the Redeemer!";
  $("finish-copy").textContent =
    `Well done, ${player.nickname}! Your adventure through Brazil is complete.`;

  showScreen("results-screen");
  $("save-status").textContent = "Saving your result…";

  const result = {
    player_name: player.name,
    nickname: player.nickname,
    correct_answers: correctCount,
    total_questions: QUESTIONS.length,
    penalty_seconds: penaltySeconds,
    elapsed_seconds: rawSeconds,
    final_seconds: finalSeconds,
    completed_at: new Date().toISOString()
  };

  await saveResult(result);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function renderLeaderboard(rows) {
  const sorted = [...rows].sort((a, b) =>
    Number(a.final_seconds) - Number(b.final_seconds)
  );

  $("leaderboard-body").innerHTML = sorted.length
    ? sorted.map((row, index) => `
      <tr>
        <td>${index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}</td>
        <td><b>${escapeHtml(row.nickname)}</b><br><small>${escapeHtml(row.player_name)}</small></td>
        <td>${row.correct_answers}/15</td>
        <td>+${row.penalty_seconds}s</td>
        <td><b>${formatTime(row.final_seconds)}</b></td>
      </tr>
    `).join("")
    : `<tr><td colspan="5" class="empty">No completed adventures yet. Be the first explorer!</td></tr>`;
}

function renderHistory(rows) {
  const recent = [...rows].sort((a, b) =>
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  ).slice(0, 30);

  $("history-body").innerHTML = recent.length
    ? recent.map(row => `
      <tr>
        <td><b>${escapeHtml(row.nickname)}</b></td>
        <td>${new Date(row.completed_at).toLocaleString()}</td>
        <td>${row.correct_answers}/15</td>
        <td>${formatTime(row.final_seconds)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="4" class="empty">No player history yet.</td></tr>`;
}

async function loadResults() {
  let rankingRows = [];
  let historyRows = [];
  $("data-note").textContent = "";

  if (supabaseClient) {
    const [rankingResult, historyResult] = await Promise.all([
      supabaseClient
        .from("game_results")
        .select("player_name,nickname,correct_answers,penalty_seconds,final_seconds,completed_at")
        .order("final_seconds", { ascending: true })
        .limit(100),
      supabaseClient
        .from("game_results")
        .select("player_name,nickname,correct_answers,penalty_seconds,final_seconds,completed_at")
        .order("completed_at", { ascending: false })
        .limit(30)
    ]);

    if (rankingResult.error || historyResult.error) {
      console.error("Supabase read failed:", rankingResult.error || historyResult.error);
      $("data-note").textContent =
        "Could not load the shared leaderboard/history. Check the game_results SELECT policy and Supabase configuration.";
      $("leaderboard-body").innerHTML = `<tr><td colspan="5" class="empty">Could not load leaderboard.</td></tr>`;
      $("history-body").innerHTML = `<tr><td colspan="4" class="empty">Could not load player history.</td></tr>`;
      return;
    }

    rankingRows = rankingResult.data || [];
    historyRows = historyResult.data || [];
  } else {
    try {
      const local = JSON.parse(localStorage.getItem("brazilQuizResults") || "[]");
      rankingRows = local;
      historyRows = local;
      $("data-note").textContent =
        "Preview mode: these records are stored only in this browser. Configure Supabase to share the leaderboard across phones.";
    } catch (error) {
      console.error("Could not read local game history:", error);
      $("data-note").textContent = "Could not read this browser's local history.";
    }
  }

  renderLeaderboard(rankingRows);
  renderHistory(historyRows);
}

$("player-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("player-name").value.trim();
  const nickname = $("player-nickname").value.trim();

  if (!name || !nickname) return;
  startGame(name, nickname);
});

$("next-button").addEventListener("click", () => {
  if (!answered) return;

  if (questionIndex === QUESTIONS.length - 1) {
    finishGame();
    return;
  }

  questionIndex += 1;
  renderQuestion();
});

$("view-ranking").addEventListener("click", async () => {
  showScreen("leaderboard-screen");
  await loadResults();
});

$("leaderboard-shortcut").addEventListener("click", async () => {
  showScreen("leaderboard-screen");
  await loadResults();
});

$("back-button").addEventListener("click", () => showScreen("welcome-screen"));

$("play-again").addEventListener("click", () => {
  clearInterval(timerHandle);
  $("player-name").value = player.name;
  $("player-nickname").value = player.nickname;
  showScreen("welcome-screen");
});

initializeSupabase();
showScreen("welcome-screen");
