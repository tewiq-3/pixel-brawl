(() => {
  const $ = id => document.getElementById(id);
  const tg = window.Telegram?.WebApp;
  if (tg) { tg.ready(); tg.expand(); }
  const data = {coins: Number(localStorage.getItem('pb_coins')||0), wins:Number(localStorage.getItem('pb_wins')||0), best:Number(localStorage.getItem('pb_best')||0)};
  const save = () => { for (const k of Object.keys(data)) localStorage.setItem('pb_'+k,data[k]); updateStats(); };
  function updateStats(){ $('coins').textContent=data.coins; $('trophies').textContent=data.wins*5; $('statWins').textContent=data.wins; $('statBest').textContent=data.best; $('statCoins').textContent=data.coins; }
  function showScreen(name){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(name).classList.add('active'); }
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
  $('playBtn').onclick=startGame; $('againBtn').onclick=startGame; $('homeBtn').onclick=()=>{stopGame();showScreen('home')};
  $('quitBtn').onclick=()=>{stopGame();showScreen('home')};
  $('pauseBtn').onclick=pauseGame; $('resumeBtn').onclick=resumeGame;
  document.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>alert('Скины и оплата будут подключены позже. Сейчас магазин — демонстрационный.'));
  updateStats();

  const canvas=$('arena'), ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height, tile=50;
  let raf=0,last=0,running=false,paused=false,player,enemies=[],bullets=[],enemyBullets=[],particles=[],wave=1,spawned=0,defeated=0,superCharge=0,attackHeld=false,joy={x:0,y:0};
  const walls=[{x:180,y:120,w:150,h:45},{x:570,y:120,w:150,h:45},{x:180,y:430,w:150,h:45},{x:570,y:430,w:150,h:45},{x:400,y:245,w:100,h:110},{x:55,y:260,w:75,h:70},{x:770,y:260,w:75,h:70}];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function rectHit(x,y,r,rect){return x+r>rect.x&&x-r<rect.x+rect.w&&y+r>rect.y&&y-r<rect.y+rect.h}
  function blocked(x,y,r){return walls.some(w=>rectHit(x,y,r,w))}
  function moveEntity(e,dx,dy){let nx=clamp(e.x+dx,18,W-18),ny=clamp(e.y+dy,18,H-18);if(!blocked(nx,e.y,e.r))e.x=nx;if(!blocked(e.x,ny,e.r))e.y=ny}
  function startGame(){showScreen('game');$('pauseOverlay').classList.add('hidden');$('endOverlay').classList.add('hidden');wave=1;spawned=0;defeated=0;superCharge=0;bullets=[];enemyBullets=[];particles=[];player={x:W/2,y:H/2,r:17,hp:100,maxHp:100,speed:220,cd:0,faceX:1,faceY:0,inv:0};enemies=[];spawnWave();running=true;paused=false;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  function stopGame(){running=false;cancelAnimationFrame(raf)}
  function pauseGame(){if(!running)return;paused=true;$('pauseOverlay').classList.remove('hidden')}
  function resumeGame(){paused=false;$('pauseOverlay').classList.add('hidden');last=performance.now();raf=requestAnimationFrame(loop)}
  function spawnWave(){let n=3+wave*2;spawned=n;for(let i=0;i<n;i++){let side=i%4,x=side===0?35:side===1?W-35:Math.random()*(W-100)+50,y=side===2?35:side===3?H-35:Math.random()*(H-100)+50;if(Math.hypot(x-W/2,y-H/2)<150){x=40;y=40}enemies.push({x,y,r:16,hp:35+wave*8,maxHp:35+wave*8,speed:62+Math.min(wave*4,45),cd:Math.random(),flash:0})}updateHud()}
  function updateHud(){$('hp').textContent=Math.max(0,Math.ceil(player?.hp||0));$('wave').textContent='ВОЛНА '+wave;$('enemyCount').textContent='Враги: '+enemies.length}
  function shoot(){if(!running||paused||!player||player.cd>0)return;let target=enemies.reduce((best,e)=>!best||dist(player,e)<dist(player,best)?e:best,null);let dx=target?target.x-player.x:player.faceX,dy=target?target.y-player.y:player.faceY;let d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;player.faceX=dx;player.faceY=dy;bullets.push({x:player.x+dx*20,y:player.y+dy*20,vx:dx*460,vy:dy*460,r:7,life:1.2,damage:22});player.cd=.28}
  function useSuper(){if(superCharge<100||!running||paused)return;superCharge=0;for(let e of enemies){let d=dist(player,e);if(d<190)e.hp-=75}for(let i=0;i<28;i++){let a=i*Math.PI*2/28;particles.push({x:player.x,y:player.y,vx:Math.cos(a)*180,vy:Math.sin(a)*180,life:.55,color:'#b78aff'})}}
  $('attackBtn').addEventListener('pointerdown',e=>{e.preventDefault();attackHeld=true;shoot()});['pointerup','pointercancel','pointerleave'].forEach(ev=>$('attackBtn').addEventListener(ev,()=>attackHeld=false));
  $('superBtn').onclick=useSuper;
  const joyEl=$('joystick'),stick=$('stick');let joyPointer=null;
  joyEl.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joyEl.setPointerCapture(joyPointer);setJoy(e)});
  joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)setJoy(e)});
  function setJoy(e){let r=joyEl.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),max=35;if(len>max){dx=dx/len*max;dy=dy/len*max}joy.x=dx/max;joy.y=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`}
  function resetJoy(){joyPointer=null;joy.x=joy.y=0;stick.style.transform='translate(0,0)'}
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>joyEl.addEventListener(ev,resetJoy));
  const keys={};window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.code==='Space'){e.preventDefault();shoot()}if(e.key.toLowerCase()==='q')useSuper()});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
  function loop(t){if(!running||paused)return;let dt=Math.min((t-last)/1000,.035);last=t;update(dt);draw();raf=requestAnimationFrame(loop)}
  function update(dt){
    let ix=joy.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),iy=joy.y+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0),l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
    if(l>.05){moveEntity(player,ix*player.speed*dt,iy*player.speed*dt);player.faceX=ix;player.faceY=iy}
    player.cd=Math.max(0,player.cd-dt);player.inv=Math.max(0,player.inv-dt);if(attackHeld&&player.cd<=0)shoot();
    for(let b of bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(let e of enemies){if(e.hp>0&&Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=b.damage;b.life=0;superCharge=clamp(superCharge+12,0,100);e.flash=.1;break}}}
    bullets=bullets.filter(b=>b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H);
    for(let e of enemies){let dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||1;if(d>31){let vx=dx/d,vy=dy/d;moveEntity(e,vx*e.speed*dt,vy*e.speed*dt)}else if(e.cd<=0){player.hp-=9;player.inv=.18;e.cd=.75}e.cd-=dt;e.flash=Math.max(0,e.flash-dt)}
    enemies=enemies.filter(e=>{if(e.hp<=0){defeated++;data.coins+=3;for(let i=0;i<7;i++)particles.push({x:e.x,y:e.y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.4,color:'#ffd34e'});return false}return true});
    for(let p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);
    if(player.hp<=0){finish(false);return}
    if(enemies.length===0){wave++;data.best=Math.max(data.best,wave-1);player.hp=Math.min(100,player.hp+20);spawnWave();save()}
    updateHud();
  }
  function finish(win){stopGame();if(win){data.wins++;data.coins+=20}data.best=Math.max(data.best,wave-1);save();$('endTitle').textContent=win?'АРЕНА ОЧИЩЕНА!':'БАЙТУ НУЖЕН РЕМОНТ';$('endText').textContent=`Ты прошёл волн: ${wave-1}. Побеждено роботов: ${defeated}.`; $('endOverlay').classList.remove('hidden')}
  function draw(){
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#477d52';ctx.fillRect(0,0,W,H);
    for(let y=0;y<H;y+=tile)for(let x=0;x<W;x+=tile){ctx.fillStyle=((x/tile+y/tile)%2===0)?'#4c8759':'#477d52';ctx.fillRect(x,y,tile,tile);ctx.fillStyle='#ffffff0b';ctx.fillRect(x+4,y+4,3,3)}
    // bushes
    for(let i=0;i<12;i++){let x=(i*173+40)%W,y=(i*97+70)%H;if(!walls.some(w=>x>w.x-20&&x<w.x+w.w+20&&y>w.y-20&&y<w.y+w.h+20)&&Math.hypot(x-player.x,y-player.y)>60){ctx.fillStyle='#286044';ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3d9b5a';ctx.beginPath();ctx.arc(x-5,y-5,11,0,Math.PI*2);ctx.fill()}}
    for(let w of walls){ctx.fillStyle='#647b91';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#8da2b5';ctx.fillRect(w.x,w.y,w.w,8);ctx.strokeStyle='#344b61';ctx.lineWidth=5;ctx.strokeRect(w.x+2,w.y+2,w.w-4,w.h-4)}
    for(let b of bullets){ctx.fillStyle='#ffe36b';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff7c2';ctx.stroke()}
    for(let e of enemies){drawBot(e.x,e.y,'#e75d65',e.flash>0);bar(e.x-18,e.y-29,36,5,e.hp/e.maxHp,'#ff7474')}
    drawBot(player.x,player.y,'#51c9ff',player.inv>0);bar(player.x-22,player.y-32,44,6,player.hp/100,'#65e58b');
    for(let p of particles){ctx.globalAlpha=clamp(p.life/.5,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,5,5)}ctx.globalAlpha=1;
    ctx.fillStyle='#fff';ctx.font='bold 15px Nunito';ctx.fillText('⚡ '+Math.floor(superCharge)+'%',14,24);
  }
  function bar(x,y,w,h,pct,color){ctx.fillStyle='#172536';ctx.fillRect(x,y,w,h);ctx.fillStyle=color;ctx.fillRect(x+1,y+1,(w-2)*clamp(pct,0,1),h-2)}
  function drawBot(x,y,color,flash){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.fillStyle='#142235';ctx.fillRect(-14,-12,28,27);ctx.fillStyle=flash?'#fff':color;ctx.fillRect(-12,-15,24,25);ctx.fillStyle='#dff8ff';ctx.fillRect(-8,-8,5,5);ctx.fillRect(4,-8,5,5);ctx.fillStyle='#142235';ctx.fillRect(-5,3,10,3);ctx.fillStyle='#142235';ctx.fillRect(-10,12,7,5);ctx.fillRect(3,12,7,5);ctx.restore()}
  // stop accidental page zoom while using the game controls
  document.addEventListener('gesturestart',e=>e.preventDefault());
})();