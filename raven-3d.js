import * as T from './assets/vendor/three.module.min.js';
import { buildRaven } from './raven-model.js';

const host=document.getElementById('raven-3d');
if(host) start().catch(error=>{console.warn('3D raven unavailable; keeping the ink portrait.',error.message);host.dataset.state='fallback';});

async function start(){
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','3D raven gripping its perch and looking toward the pointer');
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(30,1,.1,40);camera.position.set(0,1.58,7.6);camera.lookAt(0,1.35,0);
  scene.add(new T.HemisphereLight(0xe6f0f4,0x44483d,2));
  for(const [color,intensity,x,y,z]of [[0xfff6e6,4,-3,5,5],[0xb8d4e7,2,4,3,-2],[0xd3e4de,1.5,1,1,5]]){const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);}
  const envScene=new T.Scene();envScene.background=new T.Color(0x777777);
  for(const [x,y,z,w,h]of [[-3,4,3,3,5],[4,3,1,2,5],[0,5,-3,4,2]]){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);envScene.add(panel);}
  const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene,0);scene.environment=environment.texture;pmrem.dispose();
  const rig=buildRaven();scene.add(rig.root);
  const state={yaw:.65,pitch:0,body:.65,lean:0,tail:0,eye:0};
  const target={yaw:.65,pitch:0};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let visible=true,frame=0,last=0,blinkAt=performance.now()+6500,blinkStart=0,contextLost=false;
  let step=null,stanceYaw=.65,nextFoot=0,stepClock=0,idleTimer=0;
  const damp=(a,b,rate,dt)=>T.MathUtils.lerp(a,b,1-Math.exp(-rate*dt));
  function size(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();request();}
  function update(now){
    frame=0;if(!visible||document.hidden||contextLost)return;
    const dt=Math.min((now-last)/1000||.016,.05);last=now;
    const motion=!reduced.matches;
    state.yaw=damp(state.yaw,target.yaw,motion?10:1000,dt);
    state.pitch=damp(state.pitch,target.pitch,motion?9:1000,dt);
    // Larger gaze changes recruit the torso; the supporting foot keeps its contact.
    const bodyTarget=.65+(target.yaw-.65)*.27;
    state.body=damp(state.body,bodyTarget,motion?3.6:1000,dt);
    state.lean=damp(state.lean,(target.yaw-.65)*.023,motion?3.2:1000,dt);
    state.tail=damp(state.tail,-(state.body-.65)*.42,motion?2.8:1000,dt);
    rig.torso.rotation.set(state.pitch*.12,state.body,-state.lean);
    rig.torso.position.x=state.lean*.38;
    const relative=state.yaw-state.body;
    rig.neck.rotation.set(state.pitch*.32,relative*.32,0);
    rig.head.rotation.set(state.pitch*.56,relative*.68,0);
    rig.tail.rotation.set(-state.pitch*.13,state.tail,state.lean*.6);
    // One foot moves at a time. Shift weight before opening the toes, then lift and regrip.
    if(motion && !step && Math.abs(target.yaw-stanceYaw)>.70){
      const index=nextFoot;nextFoot=1-nextFoot;const leg=rig.legs[index];
      step={index,from:leg.foot.position.x,to:leg.side*.20+Math.sin(target.yaw)*.07,yaw:target.yaw};stepClock=0;
    }
    if(step){
      stepClock+=dt;const t=Math.min(1,stepClock/.78),leg=rig.legs[step.index],support=rig.legs[1-step.index];
      const liftT=T.MathUtils.clamp((t-.18)/.60,0,1),lift=Math.sin(liftT*Math.PI)*.15;
      const opening=t<.25?T.MathUtils.smoothstep(t,.06,.25):1-T.MathUtils.smoothstep(t,.70,.94);
      // Support foot takes the load while the other one is airborne.
      const weightTransfer=T.MathUtils.smoothstep(t,0,.16)*(1-T.MathUtils.smoothstep(t,.80,1));
      rig.torso.position.x=T.MathUtils.lerp(rig.torso.position.x,support.foot.position.x,weightTransfer);
      leg.foot.position.x=T.MathUtils.lerp(step.from,step.to,T.MathUtils.smoothstep(liftT,0,1));
      leg.foot.position.y=lift;
      for(const toe of leg.toes)toe.rotation.x=-opening*.85;
      leg.rear.rotation.x=opening*.75;
      host.dataset.step=lift>.005?'lift':opening>.1?'release':'grip';
      host.dataset.support=support.side<0?'left':'right';
      if(t>=1){leg.foot.position.y=0;for(const toe of leg.toes)toe.rotation.x=0;leg.rear.rotation.x=0;stanceYaw=step.yaw;step=null;host.dataset.step='grip';}
    }
    rig.solveLegs();
    if(motion && fine.matches && now>blinkAt && !blinkStart){blinkStart=now;blinkAt=now+5500+Math.random()*4000;}
    const blinkPhase=blinkStart?(now-blinkStart)/190:2;
    const closure=blinkPhase<1?Math.sin(blinkPhase*Math.PI):0;
    if(blinkPhase>=1)blinkStart=0;
    for(const lid of rig.lids){lid.visible=closure>.03;lid.scale.y=.053*closure;}
    renderer.render(scene,camera);
    host.dataset.state='ready';host.dataset.gaze=state.yaw.toFixed(3);host.dataset.body=state.body.toFixed(3);host.dataset.contact=step?'one-foot-supported':'both-gripped';
    const moving=Math.abs(state.yaw-target.yaw)+Math.abs(state.pitch-target.pitch)+Math.abs(state.body-bodyTarget)+Math.abs(state.tail+(state.body-.65)*.42)>.0008;
    if(motion&&(moving||step||blinkStart))frame=requestAnimationFrame(update);
    else if(motion&&fine.matches){clearTimeout(idleTimer);idleTimer=setTimeout(request,Math.max(100,blinkAt-now));}
  }
  function request(){clearTimeout(idleTimer);if(!frame&&visible&&!document.hidden&&!contextLost){last=performance.now();frame=requestAnimationFrame(update);}}
  function point(event){
    if(reduced.matches||!fine.matches||event.pointerType==='touch')return;
    const r=host.getBoundingClientRect();
    // A point on a plane in front of the bird gives left/front/right gaze, not image tilt.
    const dx=(event.clientX-(r.left+r.width*.5))/Math.max(innerWidth*.36,260);
    const dy=(event.clientY-(r.top+r.height*.24))/Math.max(innerHeight*.5,260);
    target.yaw=T.MathUtils.clamp(Math.atan2(dx*3.5,1.35),-1.40,1.40);
    target.pitch=T.MathUtils.clamp(dy*.36,-.30,.42);
    request();
  }
  function reset(){target.yaw=.65;target.pitch=0;request();}
  window.addEventListener('pointermove',point,{passive:true});document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);clearTimeout(idleTimer);frame=0;}else{last=performance.now();request();}});
  reduced.addEventListener('change',()=>{target.yaw=.65;target.pitch=0;step=null;stanceYaw=.65;for(const leg of rig.legs){leg.foot.position.set(leg.side*.20,0,0);for(const toe of leg.toes)toe.rotation.x=0;leg.rear.rotation.x=0;}request();});fine.addEventListener('change',reset);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);clearTimeout(idleTimer);frame=0;}else request();},{threshold:.08}).observe(host);
  new ResizeObserver(size).observe(host);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;cancelAnimationFrame(frame);clearTimeout(idleTimer);frame=0;host.dataset.state='fallback';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;request();});
  size();
  // Review controls exist only in the dedicated 3D review page.
  document.querySelectorAll('[data-look]').forEach(button=>button.addEventListener('click',()=>{target.yaw=Number(button.dataset.look);target.pitch=0;request();}));
}
