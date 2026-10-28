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

// Replace these image URLs with your own hosted images whenever you like.
const STAGES = [
 {name:"Copacabana Beach",desc:"Your adventure begins beside Rio's famous coastline.",image:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1500&q=85"},
 {name:"Sugarloaf Mountain",desc:"Keep climbing and discover one of Rio's best-known landmarks.",image:"https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1500&q=85"},
 {name:"Tijuca National Park",desc:"Travel through the lush green nature of Brazil.",image:"https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1500&q=85"},
 {name:"Corcovado Mountain",desc:"The summit is getting closer. One more challenge awaits!",image:"https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1500&q=85"},
 {name:"Christ the Redeemer",desc:"You made it to the top! Enjoy the view over Rio de Janeiro.",image:"https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1500&q=85"}
];
const PENALTY_SECONDS = 10;
const $ = id => document.getElementById(id);
const letters = ["A","B","C","D"];
let player = null, questionIndex = 0, correctCount = 0, penaltySeconds = 0, startedAt = 0, timerHandle = null, answered = false, finishedAt = 0;
let supabaseClient = null;
const hasSupabaseConfig = window.SUPABASE_URL && window.SUPABASE_ANON_KEY && !window.SUPABASE_URL.includes("YOUR_") && !window.SUPABASE_ANON_KEY.includes("YOUR_");
if (hasSupabaseConfig && window.supabase) supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

function showScreen(id){["welcome-screen","game-screen","results-screen","leaderboard-screen"].forEach(s=>$(s).classList.toggle("hidden",s!==id));}
function formatTime(seconds){const whole=Math.max(0,Math.floor(seconds));return `${String(Math.floor(whole/60)).padStart(2,"0")}:${String(whole%60).padStart(2,"0")}`;}
function elapsedSeconds(){return Math.floor((Date.now()-startedAt)/1000);}
function updateTimer(){ $("timer").textContent=formatTime(elapsedSeconds()); $("penalty-label").textContent=`+${formatTime(penaltySeconds)} penalty`; }
function stageIndex(){return Math.min(4,Math.floor(questionIndex/3));}
function updateJourney(){
 const stage=STAGES[stageIndex()];
 $("scene-image").style.backgroundImage=`url("${stage.image}")`;
 $("stage-tag").textContent=`STAGE ${stageIndex()+1} OF 5`;
 $("scene-title").textContent=stage.name;
 $("scene-description").textContent=stage.desc;
 $("progress-label").textContent=`Step ${questionIndex+1} of 15`;
 $("progress-percent").textContent=`${Math.round(questionIndex/15*100)}% completed`;
 $("progress-fill").style.width=`${questionIndex/15*100}%`;
 $("stage-dots").innerHTML=STAGES.map((s,i)=>`<span class="${i<=stageIndex()?"active":""}" title="${s.name}"></span>`).join("");
}
function renderQuestion(){
 answered=false; const q=QUESTIONS[questionIndex];
 $("question-counter").textContent=`QUESTION ${questionIndex+1} OF 15`;
 $("question-category").textContent=q.category; $("question-text").textContent=q.q;
 $("feedback").textContent=""; $("feedback").className="feedback";
 $("next-button").disabled=true; $("next-button").textContent=questionIndex===14?"Finish adventure →":"Next question →";
 $("answers").innerHTML=q.a.map((a,i)=>`<button class="answer" type="button" data-index="${i}"><span class="letter">${letters[i]}</span><span>${a}</span></button>`).join("");
 [...$("answers").children].forEach(btn=>btn.addEventListener("click",()=>chooseAnswer(Number(btn.dataset.index))));
 updateJourney();
}
function chooseAnswer(index){
 if(answered)return; answered=true;
 const q=QUESTIONS[questionIndex], buttons=[...$("answers").children];
 buttons.forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");if(i===index&&i!==q.correct)b.classList.add("wrong");});
 if(index===q.correct){correctCount++;$("feedback").textContent=`✓ Correct! ${q.why} Keep climbing!`;$("feedback").className="feedback good";}
 else{penaltySeconds+=PENALTY_SECONDS;$("feedback").textContent=`✗ Not quite! +10 seconds penalty. The correct answer is ${letters[q.correct]}. ${q.why} You can continue!`;$("feedback").className="feedback bad";}
 $("header-score").textContent=correctCount*10; $("penalty-label").textContent=`+${formatTime(penaltySeconds)} penalty`;
 $("next-button").disabled=false;
}
function startGame(name,nickname){
 player={name:name.trim(),nickname:nickname.trim()};
 questionIndex=0;correctCount=0;penaltySeconds=0;startedAt=Date.now();finishedAt=0;
 $("greeting").textContent=`Good luck, ${player.nickname}!`;
 $("header-score").textContent="0";showScreen("game-screen");renderQuestion();
 clearInterval(timerHandle);timerHandle=setInterval(updateTimer,250);updateTimer();
}
async function saveResult(result){
 if(supabaseClient){
  const {error}=await supabaseClient.from("game_results").insert([result]);
  if(error){console.error(error);$("save-status").textContent="Your result could not be saved online. Please check the database setup.";return false;}
  $("save-status").textContent="Your result has been saved to the global leaderboard!";
  return true;
 }
 const local=JSON.parse(localStorage.getItem("brazilQuizResults")||"[]");local.push({...result,id:Date.now()});localStorage.setItem("brazilQuizResults",JSON.stringify(local));
 $("save-status").textContent="Saved on this device only. Connect Supabase to share results across all players.";
 return true;
}
async function finishGame(){
 clearInterval(timerHandle);finishedAt=Date.now();
 const rawSeconds=Math.floor((finishedAt-startedAt)/1000);
 const finalSeconds=rawSeconds+penaltySeconds;
 $("final-time").textContent=formatTime(finalSeconds);
 $("final-penalty").textContent=formatTime(penaltySeconds);
 $("final-correct").textContent=`${correctCount} / 15`;
 $("finish-title").textContent=correctCount===15?"Perfect climb! You reached the summit!":"You reached Christ the Redeemer!";
 $("finish-copy").textContent=`Well done, ${player.nickname}! Your adventure through Brazil is complete.`;
 showScreen("results-screen");$("save-status").textContent="Saving your result…";
 const result={player_name:player.name,nickname:player.nickname,correct_answers:correctCount,total_questions:15,penalty_seconds:penaltySeconds,elapsed_seconds:rawSeconds,final_seconds:finalSeconds,completed_at:new Date().toISOString()};
 await saveResult(result);
}
async function loadResults(){
 const note=$("data-note");let rows=[];
 if(supabaseClient){
  const {data,error}=await supabaseClient.from("game_results").select("*").order("final_seconds",{ascending:true}).limit(100);
  if(error){note.textContent="Could not load online results. Check your Supabase configuration and table policies.";console.error(error);}
  else rows=data||[];
 }else{
  rows=JSON.parse(localStorage.getItem("brazilQuizResults")||"[]");
  note.textContent="Preview mode: these records are stored only in this browser. Configure Supabase to create a shared leaderboard for all phones.";
 }
 const ranking=[...rows].sort((a,b)=>a.final_seconds-b.final_seconds);
 $("leaderboard-body").innerHTML=ranking.length?ranking.map((r,i)=>`<tr><td>${i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</td><td><b>${escapeHtml(r.nickname)}</b><br><small>${escapeHtml(r.player_name)}</small></td><td>${r.correct_answers}/15</td><td>+${r.penalty_seconds}s</td><td><b>${formatTime(r.final_seconds)}</b></td></tr>`).join(""):`<tr><td colspan="5" class="empty">No completed adventures yet. Be the first explorer!</td></tr>`;
 const history=[...rows].sort((a,b)=>new Date(b.completed_at)-new Date(a.completed_at)).slice(0,30);
 $("history-body").innerHTML=history.length?history.map(r=>`<tr><td><b>${escapeHtml(r.nickname)}</b></td><td>${new Date(r.completed_at).toLocaleString()}</td><td>${r.correct_answers}/15</td><td>${formatTime(r.final_seconds)}</td></tr>`).join(""):`<tr><td colspan="4" class="empty">No player history yet.</td></tr>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

$("player-form").addEventListener("submit",e=>{e.preventDefault();const name=$("player-name").value.trim(),nick=$("player-nickname").value.trim();if(!name||!nick)return;startGame(name,nick);});
$("next-button").addEventListener("click",()=>{if(!answered)return;if(questionIndex===14){finishGame();return;}questionIndex++;renderQuestion();});
$("view-ranking").addEventListener("click",async()=>{showScreen("leaderboard-screen");await loadResults();});
$("leaderboard-shortcut").addEventListener("click",async()=>{showScreen("leaderboard-screen");await loadResults();});
$("back-button").addEventListener("click",()=>showScreen("welcome-screen"));
$("play-again").addEventListener("click",()=>{clearInterval(timerHandle);$("player-name").value=player.name;$("player-nickname").value=player.nickname;showScreen("welcome-screen");});
showScreen("welcome-screen");
