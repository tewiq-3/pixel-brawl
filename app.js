const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const $ = (id) => document.getElementById(id);
const state = {stars:0, coins:0, wins:0, skins:["Классический"], completed:false, playerHp:100, enemyHp:60};
const screens = ["home","battle","shop","profile"];

function showScreen(name){
  screens.forEach(s => $(s).classList.toggle("active",s===name));
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.go===name));
}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showScreen(b.dataset.go)));
$("playBtn").addEventListener("click",()=>{resetBattle();showScreen("battle")});

function toast(message){
  const el=$("toast"); el.textContent=message; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2100);
}
function render(){
  $("stars").textContent=state.stars;
  $("coins").textContent=state.coins;
  $("wins").textContent=state.wins;
  $("skinCount").textContent=state.skins.length;
  $("progressText").textContent=(state.completed?1:0)+" / 1 испытаний";
  $("progressBar").style.width=state.completed?"100%":"0%";
}
function resetBattle(){
  state.playerHp=100;state.enemyHp=60;
  $("playerHp").style.width="100%";$("enemyHp").style.width="100%";
  $("hpText").textContent="100/100";$("enemyHpText").textContent="60/60";
  $("battleMessage").textContent="Компьютерный противник готов. Начинай бой!";
  $("attackBtn").disabled=false;
}
$("attackBtn").addEventListener("click",()=>{
  if(state.enemyHp<=0||state.playerHp<=0)return;
  state.enemyHp=Math.max(0,state.enemyHp-20);
  if(state.enemyHp>0) state.playerHp=Math.max(0,state.playerHp-12);
  $("playerHp").style.width=state.playerHp+"%";
  $("enemyHp").style.width=(state.enemyHp/60*100)+"%";
  $("hpText").textContent=state.playerHp+"/100";
  $("enemyHpText").textContent=state.enemyHp+"/60";
  if(state.enemyHp===0){
    $("battleMessage").textContent="Победа! Ты прошёл тренировочное испытание.";
    $("attackBtn").disabled=true;
    if(!state.completed){state.completed=true;state.wins++;state.coins+=25;render();}
    toast("Победа! +25 монет");
  }else if(state.playerHp===0){
    $("battleMessage").textContent="Противник оказался сильнее. Попробуй ещё раз!";
    $("attackBtn").disabled=true;
  }else{
    $("battleMessage").textContent="Байт атаковал! Противник ответил. Продолжай!";
  }
});
$("resetBtn").addEventListener("click",resetBattle);

document.querySelectorAll(".buy").forEach(button=>button.addEventListener("click",()=>{
  const skin=button.dataset.skin;
  if(state.skins.includes(skin)){toast("Этот образ уже открыт");return;}
  // Demo-only purchase. Replace with a server-created Telegram Stars invoice.
  toast("Оплата пока не подключена — это демонстрация магазина");
}));

const user=tg?.initDataUnsafe?.user;
if(user?.first_name) $("playerName").textContent=user.first_name.toUpperCase();
render();
