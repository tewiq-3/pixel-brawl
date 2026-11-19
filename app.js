(() => {
  const $ = id => document.getElementById(id);
  const tg = window.Telegram?.WebApp;
  if (tg) { tg.ready(); tg.expand(); }
  let activeSkin = localStorage.getItem('pb_skin') || 'classic';
  const data = {coins: Number(localStorage.getItem('pb_coins')||0), wins:Number(localStorage.getItem('pb_wins')||0), best:Number(localStorage.getItem('pb_best')||0)};
  const save = () => { for (const k of Object.keys(data)) localStorage.setItem('pb_'+k,data[k]); updateStats(); };
  function updateStats(){ $('coins').textContent=data.coins; $('trophies').textContent=data.wins*5; $('statWins').textContent=data.wins; $('statBest').textContent=data.best; $('statCoins').textContent=data.coins; }
  function showScreen(name){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(name).classList.add('active'); }
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
  $('playBtn').onclick=startGame; $('againBtn').onclick=startGame; $('homeBtn').onclick=()=>{stopGame();showScreen('home')};
  $('quitBtn').onclick=()=>{stopGame();showScreen('home')};
  $('pauseBtn').onclick=pauseGame; $('resumeBtn').onclick=resumeGame;
  function drawPortraits(){
    document.querySelectorAll('[data-byte-portrait]').forEach(canvas=>{
      const pink=canvas.dataset.bytePortrait==='pink'||(canvas.dataset.bytePortrait==='home'||canvas.dataset.bytePortrait==='profile')&&activeSkin==='pink';
      const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.save();c.scale(w/180,h/190);
      const body=pink?'#f58acb':'#a9eaf0',mid=pink?'#e95eae':'#58c5d2',deep=pink?'#a9367e':'#167080',edge=pink?'#67284f':'#123d50';
      // soft shadow and antenna
      c.fillStyle='#101827';c.beginPath();c.ellipse(90,169,67,13,0,0,Math.PI*2);c.fill();
      c.fillStyle='#553c64';c.beginPath();c.ellipse(90,29,22,10,0,0,Math.PI*2);c.fill();c.fillRect(85,13,10,20);
      c.fillStyle='#ffad27';c.beginPath();c.arc(90,14,14,0,Math.PI*2);c.fill();c.fillStyle='#ffe17a';c.beginPath();c.arc(85,9,5,0,Math.PI*2);c.fill();
      // side ear modules
      c.fillStyle='#7c263b';c.fillRect(10,78,18,64);c.fillRect(152,78,18,64);
      c.fillStyle=pink?'#ff7fca':'#ff514e';c.fillRect(12,76,14,55);c.fillRect(154,76,14,55);
      c.fillStyle='#ffb1b1';c.fillRect(15,82,4,39);c.fillRect(157,82,4,39);
      // rounded square head
      c.fillStyle=edge;c.beginPath();c.roundRect(21,40,138,128,27);c.fill();
      const g=c.createLinearGradient(0,45,0,165);g.addColorStop(0,body);g.addColorStop(.55,mid);g.addColorStop(1,deep);c.fillStyle=g;c.beginPath();c.roundRect(25,39,130,124,25);c.fill();
      c.fillStyle='#ffffff66';c.beginPath();c.roundRect(34,45,112,18,10);c.fill();
      // big ring eyes
      for(const x of [62,118]){c.fillStyle=pink?'#a82d7c':'#087f9c';c.beginPath();c.arc(x,94,20,0,Math.PI*2);c.fill();c.fillStyle=pink?'#ff8ed1':'#22d5ed';c.beginPath();c.arc(x,91,16,0,Math.PI*2);c.fill();c.fillStyle='#f8ffff';c.beginPath();c.arc(x,95,11,0,Math.PI*2);c.fill();}
      // red triangular nose
      c.fillStyle='#9b2634';c.beginPath();c.moveTo(90,103);c.lineTo(76,132);c.lineTo(104,132);c.closePath();c.fill();c.fillStyle='#ff5b5d';c.beginPath();c.moveTo(90,108);c.lineTo(81,128);c.lineTo(99,128);c.closePath();c.fill();
      // friendly grille mouth with teeth
      c.fillStyle='#172b3a';c.beginPath();c.roundRect(55,140,70,20,10);c.fill();c.fillStyle='#f6f5e9';c.fillRect(64,143,7,14);c.fillRect(77,143,8,14);c.fillRect(94,143,8,14);c.fillRect(108,143,7,14);
      c.restore();
    });
  }
  drawPortraits();
  function chooseSkin(name){
    if(name==='neon'||name==='gold'){alert('Этот скин появится в одном из следующих обновлений.');return;}
    activeSkin=name;localStorage.setItem('pb_skin',name);drawPortraits();
    document.querySelectorAll('[data-skin]').forEach(b=>{
      const card=b.closest('.skin-card');card.classList.toggle('selected',b.dataset.skin===name);
      b.textContent=b.dataset.skin===name?'Выбран':'Выбрать';
      b.classList.toggle('equipped',b.dataset.skin===name);
    });
  }
  document.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>chooseSkin(b.dataset.skin));
  chooseSkin(activeSkin);
  updateStats();

  const canvas=$('arena'), ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height, tile=50;
  let raf=0,last=0,running=false,paused=false,player,enemies=[],bullets=[],enemyBullets=[],particles=[],wave=1,spawned=0,defeated=0,superCharge=0,attackHeld=false,joy={x:0,y:0};
  const walls=[{x:180,y:120,w:150,h:45},{x:570,y:120,w:150,h:45},{x:180,y:430,w:150,h:45},{x:570,y:430,w:150,h:45},{x:400,y:245,w:100,h:110},{x:55,y:260,w:75,h:70},{x:770,y:260,w:75,h:70}];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function rectHit(x,y,r,rect){return x+r>rect.x&&x-r<rect.x+rect.w&&y+r>rect.y&&y-r<rect.y+rect.h}
  function blocked(x,y,r){return walls.some(w=>rectHit(x,y,r,w))}
  function moveEntity(e,dx,dy){let nx=clamp(e.x+dx,18,W-18),ny=clamp(e.y+dy,18,H-18);if(!blocked(nx,e.y,e.r))e.x=nx;if(!blocked(e.x,ny,e.r))e.y=ny}
  function startGame(){showScreen('game');$('pauseOverlay').classList.add('hidden');$('endOverlay').classList.add('hidden');wave=1;spawned=0;defeated=0;superCharge=0;bullets=[];enemyBullets=[];particles=[];player={x:W/2,y:390,r:17,hp:100,maxHp:100,speed:220,cd:0,faceX:1,faceY:0,inv:0};enemies=[];spawnWave();running=true;paused=false;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
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
    ctx.clearRect(0,0,W,H);
    // Rich pixel-dungeon floor
    ctx.fillStyle='#477b50';ctx.fillRect(0,0,W,H);
    for(let y=0;y<H;y+=50)for(let x=0;x<W;x+=50){
      ctx.fillStyle=((x/50+y/50)%2===0)?'#548b58':'#4b8052';ctx.fillRect(x,y,50,50);
      ctx.fillStyle='#3c7048';ctx.fillRect(x+7,y+11,3,3);ctx.fillRect(x+34,y+31,4,3);
      ctx.fillStyle='#ffffff12';ctx.fillRect(x+2,y+2,46,2);
    }
    // Decorative grass tufts and tiny flowers
    for(let i=0;i<48;i++){let x=(i*137+23)%W,y=(i*83+19)%H;if(!walls.some(w=>x>w.x-5&&x<w.x+w.w+5&&y>w.y-5&&y<w.y+w.h+5)){
      ctx.fillStyle=i%4===0?'#f6d66b':'#2e6742';ctx.fillRect(x,y,3,5);ctx.fillRect(x+4,y-2,3,4);
    }}
    // Bushes with layered pixel leaves
    for(let i=0;i<12;i++){let x=(i*173+40)%W,y=(i*97+70)%H;if(!walls.some(w=>x>w.x-20&&x<w.x+w.w+20&&y>w.y-20&&y<w.y+w.h+20)){
      ctx.fillStyle='#244f39';ctx.fillRect(x-18,y-10,38,27);ctx.fillStyle='#2d7048';ctx.fillRect(x-14,y-17,28,28);ctx.fillStyle='#46985a';ctx.fillRect(x-9,y-15,12,10);ctx.fillRect(x+5,y-7,10,9);
    }}
    // Stone walls with chunky highlights and cracks
    for(let w of walls){ctx.fillStyle='#263b50';ctx.fillRect(w.x+3,w.y+7,w.w,w.h);ctx.fillStyle='#687f91';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='#91a8b7';ctx.fillRect(w.x,w.y,w.w,7);
      ctx.fillStyle='#536a7d';for(let xx=w.x+12;xx<w.x+w.w-8;xx+=38){ctx.fillRect(xx,w.y+10,3,13);ctx.fillRect(xx+14,w.y+28,3,12)}
      ctx.strokeStyle='#34495d';ctx.lineWidth=4;ctx.strokeRect(w.x+2,w.y+2,w.w-4,w.h-4);
    }
    // Projectile trails and bright shots
    for(let b of bullets){ctx.globalAlpha=.35;ctx.fillStyle='#ffe36b';ctx.fillRect(b.x-b.vx*.035,b.y-b.vy*.035,12,12);ctx.globalAlpha=1;ctx.fillStyle='#fff2a1';ctx.fillRect(b.x-5,b.y-5,10,10);ctx.fillStyle='#ffae36';ctx.fillRect(b.x-2,b.y-2,5,5)}
    for(let e of enemies){drawBot(e.x,e.y,'enemy',e.flash>0);bar(e.x-18,e.y-31,36,5,e.hp/e.maxHp,'#ff7777')}
    drawBot(player.x,player.y,'player',player.inv>0);bar(player.x-22,player.y-34,44,6,player.hp/100,'#65e58b');
    for(let p of particles){ctx.globalAlpha=clamp(p.life/.5,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,6,6)}ctx.globalAlpha=1;
    ctx.fillStyle='#fff';ctx.font='bold 15px Nunito';ctx.fillText('⚡ '+Math.floor(superCharge)+'%',14,24);
  }
  function bar(x,y,w,h,pct,color){ctx.fillStyle='#172536';ctx.fillRect(x,y,w,h);ctx.fillStyle='#dce8ee';ctx.fillRect(x-1,y-1,w+2,h+2);ctx.fillStyle='#172536';ctx.fillRect(x,y,w,h);ctx.fillStyle=color;ctx.fillRect(x+1,y+1,(w-2)*clamp(pct,0,1),h-2)}
  function drawBot(x,y,kind,flash){
    if(kind==='player'){
      ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(.39,.39);
      const pink=activeSkin==='pink',body=pink?'#f58acb':'#a9eaf0',mid=pink?'#e95eae':'#58c5d2',deep=pink?'#a9367e':'#167080',edge=pink?'#67284f':'#123d50';
      ctx.fillStyle='#10182788';ctx.beginPath();ctx.ellipse(0,39,47,12,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#553c64';ctx.beginPath();ctx.ellipse(0,-53,16,8,0,0,Math.PI*2);ctx.fill();ctx.fillRect(-5,-72,10,22);
      ctx.fillStyle='#ffad27';ctx.beginPath();ctx.arc(0,-76,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe17a';ctx.fillRect(-5,-82,5,5);
      ctx.fillStyle='#7c263b';ctx.fillRect(-51,-9,15,48);ctx.fillRect(36,-9,15,48);
      ctx.fillStyle=pink?'#ff7fca':'#ff514e';ctx.fillRect(-49,-12,11,42);ctx.fillRect(38,-12,11,42);
      ctx.fillStyle='#ffb1b1';ctx.fillRect(-46,-7,3,28);ctx.fillRect(41,-7,3,28);
      ctx.fillStyle='#172a3b';ctx.beginPath();ctx.roundRect(-43,-58,86,102,19);ctx.fill();
      const grad=ctx.createLinearGradient(0,-55,0,43);grad.addColorStop(0,body);grad.addColorStop(.55,mid);grad.addColorStop(1,deep);ctx.fillStyle=flash?'#fff':grad;ctx.beginPath();ctx.roundRect(-39,-60,78,96,17);ctx.fill();
      ctx.fillStyle='#ffffff66';ctx.beginPath();ctx.roundRect(-31,-54,62,12,7);ctx.fill();
      for(const ex of [-17,17]){ctx.fillStyle=pink?'#a82d7c':'#087f9c';ctx.beginPath();ctx.arc(ex,-10,13,0,Math.PI*2);ctx.fill();ctx.fillStyle=pink?'#ff8ed1':'#22d5ed';ctx.beginPath();ctx.arc(ex,-12,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f8ffff';ctx.beginPath();ctx.arc(ex,-9,7,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#9b2634';ctx.beginPath();ctx.moveTo(0,-3);ctx.lineTo(-10,17);ctx.lineTo(10,17);ctx.closePath();ctx.fill();ctx.fillStyle='#ff5b5d';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-7,14);ctx.lineTo(7,14);ctx.closePath();ctx.fill();
      ctx.fillStyle='#172b3a';ctx.beginPath();ctx.roundRect(-22,22,44,13,7);ctx.fill();ctx.fillStyle='#f6f5e9';ctx.fillRect(-16,24,5,9);ctx.fillRect(-7,24,5,9);ctx.fillRect(3,24,5,9);ctx.fillRect(12,24,5,9);
      ctx.restore();return;
    }
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    // Enemy bots retain a clearly different red, angular design.
    ctx.fillStyle='#142b2a88';ctx.fillRect(-18,15,38,8);ctx.fillStyle='#792f49';ctx.fillRect(-2,-24,5,10);ctx.fillStyle='#ff9a8e';ctx.fillRect(-5,-29,11,7);ctx.fillStyle='#ffbd55';ctx.fillRect(-2,-31,5,4);
    ctx.fillStyle='#792f49';ctx.fillRect(-19,-7,7,17);ctx.fillRect(12,-7,7,17);ctx.fillStyle='#db5962';ctx.fillRect(-21,-5,7,10);ctx.fillRect(14,-5,7,10);
    ctx.fillStyle='#182a3b';ctx.fillRect(-12,11,9,8);ctx.fillRect(4,11,9,8);ctx.fillStyle='#792f49';ctx.fillRect(-13,14,11,4);ctx.fillRect(3,14,11,4);
    ctx.fillStyle='#172a3b';ctx.fillRect(-15,-17,30,31);ctx.fillStyle=flash?'#fff':'#db5962';ctx.fillRect(-12,-17,24,26);ctx.fillStyle='#ff9a8e';ctx.fillRect(-9,-15,17,4);ctx.fillRect(-12,-9,3,12);
    ctx.fillStyle='#792f49';ctx.fillRect(-9,-8,18,12);ctx.fillStyle='#ffe7a0';ctx.fillRect(-6,-6,4,5);ctx.fillRect(3,-6,4,5);ctx.fillStyle='#ff9b55';ctx.fillRect(-5,-5,2,3);ctx.fillRect(4,-5,2,3);ctx.fillStyle='#15283a';ctx.fillRect(-3,2,7,2);ctx.restore();
  }
  // stop accidental page zoom while using the game controls
  document.addEventListener('gesturestart',e=>e.preventDefault());
})();