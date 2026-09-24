/* JIN's two worlds on a tactile, off-screen ring. Canvas stops painting when still. */
(() => {
  'use strict';
  const scene = document.querySelector('.ring-scene');
  const canvas = document.getElementById('ring-canvas');
  const ctx = canvas && canvas.getContext('2d', { alpha: false });
  if (!scene || !ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const chapters = [
    { number:'01', title:'JIN with Phoebe', type:'Character world', status:'Ongoing', world:'q', art:'chibi', tone:'q' },
    { number:'02', title:'Three small hellos', type:'Welcome film', status:'In progress', world:'q', art:'type', tone:'q' },
    { number:'03', title:'Social stories', type:'Phoebe · Nuonuo · Sera', status:'Ongoing', world:'q', art:'chibi', tone:'q' },
    { number:'04', title:'Sera', type:'Character world', status:'Ongoing', world:'sera', art:'adult', tone:'sera' },
    { number:'05', title:'The greeting', type:'Moving image', status:'15 seconds', world:'sera', art:'poster', tone:'sera' },
    { number:'06', title:'Worldbuilding', type:'Visual development', status:'Ongoing', world:'sera', art:'adult', tone:'sera' }
  ];
  const sources = {
    chibi: 'assets/sera-chibi-hero.webp',
    adult: 'assets/sera-homeworld-hero.webp',
    poster: 'assets/sera-world-welcome-poster.webp'
  };
  const pictures = {};
  for (const [key, src] of Object.entries(sources)) {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    image.onload = schedule;
    pictures[key] = image;
  }
  const number = document.getElementById('meta-number');
  const title = document.getElementById('meta-title');
  const type = document.getElementById('meta-type');
  const status = document.getElementById('meta-status');
  const count = document.getElementById('chapter-count');
  const pairs = [...document.querySelectorAll('.meta-pair')];
  const index = [...document.querySelectorAll('[data-card]')];
  const tag = scene.querySelector('.cursor-tag');
  const worldDialog = document.getElementById('world-dialog');
  const infoDialog = document.getElementById('info-dialog');
  const film = document.querySelector('.world-film-video');
  const state = { turn: 0, intro: motion.matches ? 1 : 0, hover: 0 };
  const STEP = Math.PI * 2 / 18;
  let active = 0;
  let width = 0, height = 0, ratio = 1, cardWidth = 0, cardHeight = 0, ringRadius = 0;
  let scheduled = false, drag = null, suppressClick = false, lastWheel = 0, hoverTarget = 0;

  function mod(n, m) { return ((n % m) + m) % m; }
  function resize() {
    const rect = scene.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (width < 761) {
      cardWidth = Math.min(width * .77, 340);
      ringRadius = Math.max(height * .93, width * 1.25);
    } else {
      cardWidth = Math.min(Math.max(width * .28, 285), 505);
      ringRadius = Math.max(width * .86, height * .91);
    }
    cardHeight = cardWidth / 1.5;
    scene.style.setProperty('--action-y', Math.round(height * (width < 761 ? .46 : .49) + cardHeight / 2 + 24) + 'px');
    schedule();
  }
  function schedule() {
    if (scheduled || !width) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; paint(); });
  }
  function cardPosition(slot) {
    const angle = (slot - state.turn) * STEP;
    const r = ringRadius * state.intro + cardWidth * .62 * (1 - state.intro);
    const cx = width / 2 - ringRadius * state.intro;
    const cy = height * (width < 761 ? .46 : .49);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle };
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  function imageCover(image, x, y, w, h, focusX=.5, focusY=.5) {
    if (!image.complete || !image.naturalWidth) return;
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = w / h;
    let sw = image.naturalWidth, sh = image.naturalHeight;
    if (sourceRatio > targetRatio) sw = sh * targetRatio;
    else sh = sw / targetRatio;
    const sx = (image.naturalWidth - sw) * focusX;
    const sy = (image.naturalHeight - sh) * focusY;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }
  function cardArt(chapter, w, h) {
    const q = chapter.tone === 'q';
    const gradient = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
    if (q) { gradient.addColorStop(0,'#f4e5de'); gradient.addColorStop(.65,'#e9d7ca'); gradient.addColorStop(1,'#d7aaa1'); }
    else { gradient.addColorStop(0,'#527266'); gradient.addColorStop(.55,'#283f37'); gradient.addColorStop(1,'#172924'); }
    ctx.fillStyle = gradient;
    ctx.fillRect(-w/2,-h/2,w,h);

    if (chapter.art === 'poster' && pictures.poster.complete && pictures.poster.naturalWidth) {
      // The greeting is portrait. Keep Sera's face, her wave and the channel together.
      ctx.save();
      ctx.globalAlpha = .38;
      imageCover(pictures.poster,-w/2,-h/2,w,h,.48,.38);
      ctx.restore();
      const wash = ctx.createLinearGradient(-w/2,0,w/2,0);
      wash.addColorStop(0,'#182c27e8'); wash.addColorStop(.63,'#1f3731a0'); wash.addColorStop(1,'#18322b15');
      ctx.fillStyle = wash; ctx.fillRect(-w/2,-h/2,w,h);
      const posterW = h * .5625;
      ctx.save(); ctx.shadowColor='#10221c9e'; ctx.shadowBlur=22;
      ctx.drawImage(pictures.poster,w*.15-posterW/2,-h/2,posterW,h);
      ctx.restore();
    } else if (chapter.art === 'chibi' && pictures.chibi.complete && pictures.chibi.naturalWidth) {
      // The supplied illustration depicts chibi Sera alone; the film is separately marked pending.
      const iw = h*.95;
      ctx.drawImage(pictures.chibi,w*.12-iw/2,-h*.62,iw,h*1.14);
    } else if (chapter.art === 'adult' && pictures.adult.complete && pictures.adult.naturalWidth) {
      const portraitH = h * 1.45;
      const portraitW = portraitH * pictures.adult.naturalWidth / pictures.adult.naturalHeight;
      ctx.drawImage(pictures.adult,w*.13-portraitW/2,-h*.46,portraitW,portraitH);
    }

    const labelX = -w*.43;
    ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillStyle=q?'#694d4a':'#f7f5ea';
    ctx.font = `500 ${Math.max(9,w*.024)}px Arial`;
    ctx.fillText('JIN STUDIO  /  0'+(chapters.indexOf(chapter)+1),labelX,-h*.39);
    if (chapter.art === 'type') {
      ctx.fillStyle='#6c4a48'; ctx.font=`italic ${Math.round(w*.095)}px Georgia`;
      ctx.fillText('Three small',labelX,-h*.15);
      ctx.fillText('hellos.',labelX,h*.05);
      ctx.fillStyle='#896b64'; ctx.font=`${Math.max(10,w*.028)}px Arial`;
      ctx.fillText('Phoebe · Nuonuo · chibi Sera',labelX,h*.32);
    } else {
      const dark = chapter.art === 'chibi';
      ctx.fillStyle=dark?'#493332':'#fffaf1';
      ctx.font=`italic ${Math.max(25,w*.074)}px Georgia`;
      const words = chapter.title === 'JIN with Phoebe' ? 'with Phoebe' : chapter.title;
      ctx.fillText(words,labelX,h*.23,w*.85);
      ctx.font=`${Math.max(9,w*.025)}px Arial`;
      ctx.fillText(chapter.world==='q'?'PHOEBE · NUONUO · SERA':'CHARACTER · CINEMA · WORLD',labelX,h*.39);
    }
  }
  function paintCard(slot) {
    const chapter=chapters[mod(slot,chapters.length)];
    const p=cardPosition(slot);
    if(p.x < -cardWidth*1.3 || p.x > width+cardWidth || p.y < -cardHeight*1.4 || p.y > height+cardHeight*1.4) return;
    const distance=Math.abs(slot-state.turn);
    const front=distance<.8;
    const scale=(.94+Math.max(0,1-distance)*.06+state.hover*.08*(front?1:0)) * (.75+.25*state.intro);
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.angle*.34);
    ctx.scale(scale,scale);
    ctx.globalAlpha=1-(Math.min(distance,2)*.12)-(state.hover*(front?0:.1));
    ctx.shadowColor='rgba(41,44,39,.18)';ctx.shadowBlur=24;ctx.shadowOffsetY=14;
    roundRect(-cardWidth/2,-cardHeight/2,cardWidth,cardHeight,Math.max(17,cardWidth*.055));
    ctx.fillStyle='#eee9e2';ctx.fill();ctx.shadowColor='transparent';
    ctx.clip();
    cardArt(chapter,cardWidth,cardHeight);
    ctx.restore();
  }
  function paint() {
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.fillStyle='#faf9f6';ctx.fillRect(0,0,width,height);
    const front=Math.round(state.turn);
    if (state.intro > .05) {
      const radius=ringRadius*state.intro+cardWidth*.62*(1-state.intro);
      const cx=width/2-ringRadius*state.intro;
      const cy=height*(width<761?.46:.49);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2);
      ctx.lineWidth=1.2+state.hover*2;
      ctx.strokeStyle='rgba(126,131,115,.18)'; ctx.stroke();
      ctx.restore();
    }
    // Connected soft seams join cards along the passing ring.
    for(let slot=front-3;slot<front+3;slot++){
      const a=cardPosition(slot),b=cardPosition(slot+1);
      if((a.y < -cardHeight && b.y < -cardHeight)||(a.y > height+cardHeight&&b.y>height+cardHeight))continue;
      const rise=state.hover*(Math.abs(slot-state.turn)<1.2?.28:0);
      const thickness=(18+cardWidth*.075+rise*cardWidth)*state.intro;
      const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
      grad.addColorStop(0,chapters[mod(slot,6)].tone==='q'?'#e5d2c7':'#557466');
      grad.addColorStop(1,chapters[mod(slot+1,6)].tone==='q'?'#e5d2c7':'#557466');
      ctx.save();ctx.globalAlpha=.48;
      ctx.beginPath();ctx.moveTo(a.x,a.y);
      ctx.bezierCurveTo(a.x-thickness,a.y+(b.y-a.y)*.32,b.x+thickness,b.y-(b.y-a.y)*.32,b.x,b.y);
      ctx.lineCap='round';ctx.lineWidth=thickness;ctx.strokeStyle=grad;ctx.stroke();ctx.restore();
    }
    const slots=[];
    for(let i=front-3;i<=front+3;i++)slots.push(i);
    slots.sort((a,b)=>Math.abs(b-state.turn)-Math.abs(a-state.turn));
    slots.forEach(paintCard);
  }
  function updateMetadata() {
    const item=chapters[active];
    number.textContent=item.number;
    title.textContent=item.title;
    type.textContent=item.type;
    status.textContent=item.status;
    count.textContent=`${item.number} / 06`;
    index.forEach((button,i)=>button.setAttribute('aria-current',i===active?'true':'false'));
    document.getElementById('open-world').setAttribute('aria-label',`Enter ${item.world==='q'?'JIN with Phoebe':'Sera'}`);
    if(gsap&&!motion.matches){
      gsap.to(pairs,{filter:'blur(0px)',opacity:1,y:0,duration:.34,ease:'power2.out',clearProps:'filter,opacity,transform'});
    } else pairs.forEach(el=>el.classList.remove('is-changing'));
  }
  function select(next) {
    if(worldDialog.open||infoDialog.open)return;
    const newIndex=mod(next,chapters.length);
    const current=mod(Math.round(state.turn),chapters.length);
    let delta=newIndex-current;
    if(delta>3)delta-=6;
    if(delta< -3)delta+=6;
    const destination=Math.round(state.turn)+delta;
    if(gsap)gsap.killTweensOf(state,'turn');
    if(newIndex!==active){
      active=newIndex;
      if(gsap&&!motion.matches){
        gsap.to(pairs,{filter:'blur(9px)',opacity:0,y:8,duration:.15,onComplete:updateMetadata});
      } else updateMetadata();
    }
    if(motion.matches||!gsap){state.turn=destination;schedule();return}
    gsap.to(state,{turn:destination,duration:Math.min(1.05,.52+Math.abs(delta)*.14),ease:'power3.inOut',onUpdate:schedule,onComplete:schedule});
  }
  function openWorld() {
    const world=chapters[active].world;
    worldDialog.querySelector('[data-world=q]').hidden=world!=='q';
    worldDialog.querySelector('[data-world=sera]').hidden=world!=='sera';
    worldDialog.setAttribute('aria-labelledby',world==='q'?'world-dialog-title':'sera-dialog-title');
    worldDialog.showModal();
  }
  function openInfo(which) {
    infoDialog.querySelector('[data-info-panel=about]').hidden=which!=='about';
    infoDialog.querySelector('[data-info-panel=contact]').hidden=which!=='contact';
    infoDialog.setAttribute('aria-labelledby',which==='about'?'info-title':'contact-title');
    infoDialog.showModal();
  }
  for(const button of index)button.addEventListener('click',()=>select(Number(button.dataset.card)));
  document.getElementById('previous-card').addEventListener('click',()=>select(active-1));
  document.getElementById('next-card').addEventListener('click',()=>select(active+1));
  document.getElementById('open-world').addEventListener('click',openWorld);
  document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>openInfo(button.dataset.info)));
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  for(const dialog of [worldDialog,infoDialog]){
    dialog.addEventListener('click',event=>{
      const box=dialog.getBoundingClientRect();
      if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
    });
  }
  worldDialog.addEventListener('close',()=>{film.pause();film.currentTime=0;});
  scene.addEventListener('wheel',event=>{
    if(worldDialog.open||infoDialog.open)return;
    event.preventDefault();
    if(Math.abs(event.deltaY)+Math.abs(event.deltaX)<12)return;
    if(performance.now()-lastWheel<520)return;
    lastWheel=performance.now();
    select(active+(event.deltaY+event.deltaX>0?1:-1));
  },{passive:false});
  function frontHit(x,y){
    const p=cardPosition(state.turn);
    return Math.abs(x-p.x)<cardWidth*.51&&Math.abs(y-p.y)<cardHeight*.55;
  }
  canvas.addEventListener('pointermove',event=>{
    const rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    if(drag)return;
    tag.style.left=x+'px';tag.style.top=y+'px';
    hoverTarget=frontHit(x,y)&&event.pointerType==='mouse'&&!motion.matches?1:0;
    scene.classList.toggle('is-hovering',!!hoverTarget);
    if(state.hover!==hoverTarget){
      if(gsap){gsap.killTweensOf(state,'hover');gsap.to(state,{hover:hoverTarget,duration:hoverTarget?.35:.6,ease:'power2.out',onUpdate:schedule});}
      else{state.hover=hoverTarget;schedule()}
    }
  });
  canvas.addEventListener('pointerleave',()=>{
    scene.classList.remove('is-hovering');
    if(gsap){gsap.killTweensOf(state,'hover');gsap.to(state,{hover:0,duration:.4,onUpdate:schedule});}
    else{state.hover=0;schedule()}
  });
  canvas.addEventListener('pointerdown',event=>{
    drag={x:event.clientX,y:event.clientY,id:event.pointerId};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointerup',event=>{
    if(!drag)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    drag=null;
    if(Math.abs(dy)+Math.abs(dx)>35){
      suppressClick=true;
      select(active+(Math.abs(dy)>Math.abs(dx)?(dy<0?1:-1):(dx<0?1:-1)));
      setTimeout(()=>{suppressClick=false},80);
    }
  });
  canvas.addEventListener('pointercancel',()=>{drag=null});
  canvas.addEventListener('click',event=>{
    if(suppressClick)return;
    const rect=canvas.getBoundingClientRect();
    if(frontHit(event.clientX-rect.left,event.clientY-rect.top))openWorld();
  });
  document.addEventListener('keydown',event=>{
    if(worldDialog.open||infoDialog.open||event.altKey||event.ctrlKey||event.metaKey)return;
    if(['ArrowDown','ArrowRight'].includes(event.key)){event.preventDefault();select(active+1)}
    if(['ArrowUp','ArrowLeft'].includes(event.key)){event.preventDefault();select(active-1)}
    if(event.key==='Enter'&&document.activeElement===canvas)openWorld();
  });
  motion.addEventListener('change',()=>{
    if(motion.matches){
      gsap&&gsap.killTweensOf(state);
      state.turn=Math.round(state.turn);state.intro=1;state.hover=0;scene.classList.remove('is-hovering');
      active=mod(state.turn,chapters.length);updateMetadata();schedule();
    }
  });
  window.addEventListener('resize',resize,{passive:true});
  document.body.classList.add('is-ready');
  document.querySelector('.skip-link').href='#main';
  resize();
  updateMetadata();
  if(!motion.matches&&gsap)gsap.to(state,{intro:1,duration:1.35,ease:'power3.inOut',onUpdate:schedule,onComplete:schedule});
  else{state.intro=1;schedule()}
})();
