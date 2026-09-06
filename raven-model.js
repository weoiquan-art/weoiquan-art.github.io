import * as T from './assets/vendor/three.module.min.js';

// A native, editable mesh model. +Z is forward; Y is up. Dimensions are in model units.
export function buildRaven() {
  const root = new T.Group(); root.name = 'JIN_Raven';
  const torso = new T.Group(); torso.name = 'Torso'; torso.position.y = .72; root.add(torso);
  const neck = new T.Group(); neck.name = 'Neck'; neck.position.set(0, 1.08, .02); torso.add(neck);
  const head = new T.Group(); head.name = 'Head'; head.position.set(0, .28, .10); neck.add(head);
  const tail = new T.Group(); tail.name = 'Tail'; tail.position.set(0, .12, -.28); torso.add(tail);
  const dark = new T.MeshPhysicalMaterial({ color: 0x101518, roughness: .63, metalness: .16 });
  const beakMat = new T.MeshPhysicalMaterial({ color: 0x101316, roughness: .29, metalness: .32 });
  const footMat = new T.MeshStandardMaterial({ color: 0x282c2d, roughness: .64, metalness: .14 });
  const clawMat = new T.MeshPhysicalMaterial({ color: 0x080b0d, roughness: .25, metalness: .22 });
  const featherMat = new T.MeshPhysicalMaterial({ color: 0x172124, roughness: .47, metalness: .38, iridescence: .18, iridescenceIOR: 1.3, iridescenceThicknessRange: [220,390], side: T.DoubleSide });
  const wingMat = featherMat.clone(); wingMat.color.setHex(0x11181c); wingMat.roughness = .42;
  const bodyFeatherMat = featherMat.clone(); bodyFeatherMat.color.setHex(0x141c1b); bodyFeatherMat.metalness = .22;
  const sphere = new T.SphereGeometry(1, 32, 24);
  function ellipsoid(parent, material, pos, scale, name) {
    const mesh = new T.Mesh(sphere, material); mesh.position.set(...pos); mesh.scale.set(...scale); mesh.name = name || 'Contour'; parent.add(mesh); return mesh;
  }
  ellipsoid(torso, dark, [0,.64,-.02], [.43,.77,.39], 'Body');
  ellipsoid(neck, dark, [0,.10,.025], [.315,.46,.305], 'Neck_base');
  ellipsoid(head, dark, [0,.17,0], [.335,.32,.355], 'Skull');
  ellipsoid(head, dark, [0,.08,.15], [.23,.14,.20], 'Face');

  // Shallow curved feather surfaces with a raised rachis and a tapered tip.
  function featherGeometry() {
    const pos=[], uv=[], indices=[]; const rows=14, cols=8;
    for(let r=0;r<=rows;r++) {
      const t=r/rows, width=Math.pow(Math.sin(Math.PI*t),.68)*.5;
      for(let c=0;c<=cols;c++) {
        const u=c/cols*2-1;
        const barb=.005*Math.sin(t*155+Math.abs(u)*12)*Math.abs(u);
        pos.push(u*width,-t,.075*t*t+.035*Math.sin(Math.PI*t)*(1-Math.abs(u))+barb);
        uv.push(c/cols,t);
      }
    }
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const a=r*(cols+1)+c,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  const fg=featherGeometry();
  let seed=82027;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  function featherBatch(parent, material, specifications, name) {
    const mesh=new T.InstancedMesh(fg,material,specifications.length);mesh.name=name;
    const dummy=new T.Object3D(),basis=new T.Matrix4();
    const z=new T.Vector3(),y=new T.Vector3(),x=new T.Vector3();
    specifications.forEach((f,i)=>{
      z.copy(f.normal).normalize();y.copy(f.down).multiplyScalar(-1).normalize();x.crossVectors(y,z).normalize();y.crossVectors(z,x).normalize();basis.makeBasis(x,y,z);
      dummy.position.copy(f.position);dummy.quaternion.setFromRotationMatrix(basis);dummy.scale.set(f.width,f.length,f.length);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
      mesh.setColorAt(i,new T.Color().setRGB(.78+random()*.20,.80+random()*.20,.83+random()*.17));
    });
    mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);return mesh;
  }
  function plumage(parent,center,radii,count,length,width,material,exclude,name) {
    const feathers=[];
    for(let i=0;i<count;i++){
      const v=(i+.5)/count,phi=Math.acos(1-2*v),theta=i*2.3999632297;
      const n=new T.Vector3(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta));
      if(exclude?.(n))continue;
      const position=new T.Vector3(n.x*radii[0]+center[0],n.y*radii[1]+center[1],n.z*radii[2]+center[2]);
      const normal=new T.Vector3(n.x/radii[0],n.y/radii[1],n.z/radii[2]).normalize();
      let down=new T.Vector3(0,-1,-.12).addScaledVector(normal,normal.y+normal.z*.12).normalize();
      if(down.lengthSq()<.1)down=new T.Vector3(0,-1,0);
      const size=.8+random()*.35;
      feathers.push({position,normal,down,length:length*size,width:width*size});
    }
    return featherBatch(parent,material,feathers,name);
  }
  plumage(torso,[0,.67,-.015],[.442,.76,.405],440,.23,.11,bodyFeatherMat,null,'Body_plumage');
  plumage(neck,[0,.12,.03],[.325,.44,.32],230,.15,.075,bodyFeatherMat,null,'Neck_plumage');
  plumage(head,[0,.18,0],[.34,.323,.36],310,.105,.058,featherMat,n=>n.z>.56 && n.y<.20,'Head_plumage');

  // Folded wings are distinct overlapping feathers rather than a painted flat surface.
  for(const side of [-1,1]) {
    const wing=new T.Group();wing.name=side<0?'Left_wing':'Right_wing';wing.position.set(side*.32,.84,-.10);wing.rotation.z=side*.08;torso.add(wing);
    ellipsoid(wing,dark,[0,-.10,-.03],[.16,.63,.31]);
    const feathers=[];
    for(let row=0;row<5;row++)for(let j=0;j<9;j++){
      const t=j/8;
      feathers.push({position:new T.Vector3(side*(.12+Math.sin(t*Math.PI)*.027),.40-row*.145,-.24+t*.47),normal:new T.Vector3(side,0,.14),down:new T.Vector3(side*.03,-1,-.24),length:.27+row*.04,width:.105});
    }
    for(let j=0;j<10;j++)feathers.push({position:new T.Vector3(side*.135,.10-j*.019,-.25+j*.047),normal:new T.Vector3(side,0,.07),down:new T.Vector3(side*.05,-1,-.16-j*.018),length:.88-j*.025,width:.11});
    featherBatch(wing,wingMat,feathers,'Wing_flights');
  }
  const tailFeathers=[];
  for(let i=0;i<9;i++)tailFeathers.push({position:new T.Vector3((i-4)*.041,0,0),normal:new T.Vector3(0,.25,1),down:new T.Vector3((i-4)*.035,-1,-.37),length:1.12-Math.abs(i-4)*.025,width:.13});
  featherBatch(tail,wingMat,tailFeathers,'Tail_flights');

  // Raven bill, defined by cross-sections: broad base, long closed cutting line, tapered tip.
  function bill(upper) {
    const p=[],index=[],rings=20,around=20;
    for(let i=0;i<=rings;i++){
      const t=i/rings,z=.26+t*.67;
      const w=.17*Math.pow(1-t,.75)+.001;
      const top=.125*Math.pow(1-t,.8),base=.06-.075*t*t;
      for(let j=0;j<=around;j++){
        const a=j/around*Math.PI*2;
        const y=upper?base+Math.sin(a)*top*.50+top*.5:base-.003-Math.sin(a)*top*.18-top*.18;
        p.push(Math.cos(a)*w,y,z);
      }
    }
    for(let i=0;i<rings;i++)for(let j=0;j<around;j++){const a=i*(around+1)+j,b=a+around+1;index.push(a,a+1,b,b,a+1,b+1);}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(index);g.computeVertexNormals();
    const m=new T.Mesh(g,beakMat);m.name=upper?'Upper_bill':'Lower_bill';head.add(m);
  }
  bill(true);bill(false);
  const eyeMat=new T.MeshPhysicalMaterial({color:0x020303,roughness:.075,metalness:.1,clearcoat:1,clearcoatRoughness:.03});
  const eyeRim=dark.clone();eyeRim.color.setHex(0x222728);eyeRim.roughness=.38;
  const eyes=[],lids=[];
  for(const side of [-1,1]){
    const socket=new T.Group();socket.position.set(side*.277,.205,.192);socket.rotation.y=side*.92;head.add(socket);
    ellipsoid(socket,eyeRim,[0,0,0],[.062,.056,.048],'Eye_rim');
    const eye=ellipsoid(socket,eyeMat,[0,0,.024],[.046,.045,.035],'Eye');eyes.push(eye);
    ellipsoid(socket,new T.MeshBasicMaterial({color:0xd7e3e4}),[-.010,.014,.057],[.006,.004,.003],'Catchlight');
    const lid=ellipsoid(socket,dark,[0,0,.027],[.059,.001,.047],'Eyelid');lid.visible=false;lids.push(lid);
  }
  // Short throat hackles help the head/neck read as a raven from the front.
  const throat=[];
  for(let i=0;i<24;i++){
    const a=(random()-.5)*1.6;
    throat.push({position:new T.Vector3(Math.sin(a)*.20,-.06+random()*.09,.23+Math.cos(a)*.06),normal:new T.Vector3(Math.sin(a),0,Math.cos(a)),down:new T.Vector3(0,-1,.22),length:.16+random()*.11,width:.052});
  }
  featherBatch(head,bodyFeatherMat,throat,'Throat_hackles');

  function tube(parent,points,radius,material,name){
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const m=new T.Mesh(new T.TubeGeometry(curve,24,radius,8,false),material);m.name=name;parent.add(m);return m;
  }
  const rod=new T.Mesh(new T.CylinderGeometry(.035,.035,2.35,24),new T.MeshPhysicalMaterial({color:0x222627,roughness:.45,metalness:.75}));rod.rotation.z=Math.PI/2;rod.position.y=.12;rod.name='Fixed_perch';root.add(rod);
  const legs=[];
  const boneGeometry=new T.CylinderGeometry(1,1,1,10);
  for(const side of [-1,1]){
    const ankle=new T.Vector3(side*.20,.235,.07);
    const foot=new T.Group();foot.name=side<0?'Left_foot':'Right_foot';foot.position.x=side*.20;root.add(foot);
    const toes=[];
    for(let j=0;j<3;j++){
      const x=(j-1)*.045,toe=new T.Group();toe.position.set(0,.23,.055);foot.add(toe);toes.push(toe);
      tube(toe,[[0,0,0],[x,-.055,-.035],[x,-.095,-.003],[x,-.14,-.010],[x,-.16,-.043]],.019,footMat,'Gripping_toe');
      tube(toe,[[x,-.16,-.043],[x,-.165,-.070],[x,-.146,-.090]],.009,clawMat,'Hooked_claw');
    }
    const rear=new T.Group();rear.position.set(0,.23,.035);foot.add(rear);
    tube(rear,[[0,0,0],[-.035,-.06,-.075],[-.045,-.10,-.089],[-.035,-.148,-.063]],.021,footMat,'Opposing_toe');
    tube(rear,[[-.035,-.148,-.063],[-.025,-.165,-.040],[-.015,-.153,-.018]],.009,clawMat,'Rear_claw');
    const upper=new T.Mesh(boneGeometry,footMat),lower=new T.Mesh(boneGeometry,footMat);root.add(upper,lower);
    upper.name='Thigh';lower.name='Tarsus';legs.push({side,ankle,upper,lower,foot,toes,rear});
  }
  const legUp=new T.Vector3(0,1,0),direction=new T.Vector3();
  function bone(mesh,a,b,radius){direction.subVectors(b,a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.set(radius,direction.length(),radius);mesh.quaternion.setFromUnitVectors(legUp,direction.normalize());}
  function solveLegs(){
    torso.updateWorldMatrix(true,false);
    for(const leg of legs){
      leg.foot.updateWorldMatrix(true,false);
      leg.ankle.copy(leg.foot.localToWorld(new T.Vector3(0,.235,.07)));root.worldToLocal(leg.ankle);
      const hip=torso.localToWorld(new T.Vector3(leg.side*.19,.055,.01));
      root.worldToLocal(hip);
      const delta=new T.Vector3().subVectors(leg.ankle,hip),distance=delta.length();
      const axis=delta.normalize(),length=.34;
      const middle=new T.Vector3().copy(hip).addScaledVector(axis,distance*.5);
      const pole=new T.Vector3(0,0,-1).addScaledVector(axis,axis.z).normalize();
      const knee=middle.addScaledVector(pole,Math.sqrt(Math.max(.001,length*length-distance*distance*.25)));
      bone(leg.upper,hip,knee,.035);bone(leg.lower,knee,leg.ankle,.024);
    }
  }

  // White J as a raised dry-brush ribbon following the front of the breast.
  const jCurve=new T.CatmullRomCurve3([new T.Vector3(-.14,1.50,.25),new T.Vector3(-.27,1.20,.34),new T.Vector3(-.16,.87,.411),new T.Vector3(.025,.54,.415),new T.Vector3(.025,.30,.33),new T.Vector3(-.15,.23,.27),new T.Vector3(-.34,.35,.21)]);
  const jPositions=[],jIndex=[];
  for(let i=0;i<=80;i++){
    const t=i/80,p=jCurve.getPoint(t),tangent=jCurve.getTangent(t);
    const cross=new T.Vector3(-tangent.y,tangent.x,0).normalize();
    const width=(.008+.033*Math.sin(Math.PI*t))*Math.min(1,(1-t)*16+.1);
    for(const s of [-1,1]){const q=p.clone().addScaledVector(cross,width*s*(1+.08*Math.sin(i*7)));jPositions.push(q.x,q.y,q.z+.067);}
    if(i<80){const a=i*2;jIndex.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  const jGeo=new T.BufferGeometry();jGeo.setAttribute('position',new T.Float32BufferAttribute(jPositions,3));jGeo.setIndex(jIndex);jGeo.computeVertexNormals();
  const jMesh=new T.Mesh(jGeo,new T.MeshStandardMaterial({color:0xf2f0e6,roughness:1,side:T.DoubleSide}));jMesh.name='White_ink_J';torso.add(jMesh);
  return {root,torso,neck,head,tail,eyes,lids,legs,solveLegs};
}
