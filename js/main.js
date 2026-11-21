// DEEP STELLAR — interactive front-end
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

window.addEventListener('load', () => setTimeout(() => $('#loader')?.classList.add('done'), 500));
$('#year').textContent = new Date().getFullYear();

// Mobile navigation
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Active navigation
const sections = $$('main section[id]');
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    $$('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  }
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

// Cursor glow
const glow = $('#cursorGlow');
window.addEventListener('pointermove', e => {
  if (window.matchMedia('(pointer:fine)').matches) {
    glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
  }
});

// Starfield canvas
(() => {
  const canvas = $('#starfield'), ctx = canvas.getContext('2d');
  let w, h, stars=[];
  function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';stars=Array.from({length:Math.min(180,Math.floor(innerWidth/7))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.25+.2,a:Math.random()*.65+.15,s:Math.random()*.18+.03}));}
  function draw(){ctx.clearRect(0,0,w,h);stars.forEach(star=>{star.a+=Math.sin(Date.now()/1100+star.x)*.001;star.y-=star.s*devicePixelRatio;if(star.y<0)star.y=h;ctx.beginPath();ctx.arc(star.x,star.y,star.r*devicePixelRatio,0,Math.PI*2);ctx.fillStyle=`rgba(190,215,255,${Math.max(.1,Math.min(.85,star.a))})`;ctx.fill();});requestAnimationFrame(draw);}
  resize();addEventListener('resize',resize);draw();
})();

// Documentary library filters + search
const filterButtons = $$('#videoFilters button'), videoCards = $$('#videoGrid .video-card');
let currentFilter = 'all';
function filterVideos(){
  const query = $('#videoSearch').value.trim().toLowerCase();
  videoCards.forEach(card => {
    const matchesCategory = currentFilter === 'all' || card.dataset.category === currentFilter;
    const matchesText = (card.dataset.title + ' ' + card.textContent).toLowerCase().includes(query);
    card.classList.toggle('hidden', !(matchesCategory && matchesText));
  });
}
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); currentFilter = btn.dataset.filter; filterVideos();
}));
$('#videoSearch').addEventListener('input', filterVideos);

// 3D solar system (Three.js CDN required)
const planetData = [
 {name:'The Sun',symbol:'☉',type:'Star',diameter:'1.39 million km',day:'About 25 Earth days',description:'The star at the heart of our solar system, holding eight planets in its gravitational embrace.',color:0xffbd55,size:1.05,orbit:0,period:0},
 {name:'Mercury',symbol:'☿',type:'Terrestrial planet',diameter:'4,879 km',day:'58.6 Earth days',description:'A small, cratered world that races around the Sun faster than any other planet.',color:0x9b9690,size:.19,orbit:2.0,period:0.24},
 {name:'Venus',symbol:'♀',type:'Terrestrial planet',diameter:'12,104 km',day:'243 Earth days',description:'A bright world wrapped in thick clouds, with an intense greenhouse atmosphere.',color:0xd8ad78,size:.29,orbit:2.8,period:0.62},
 {name:'Earth',symbol:'♁',type:'Terrestrial planet',diameter:'12,742 km',day:'23 hours 56 minutes',description:'Our home world: a planet with liquid-water oceans, a protective atmosphere and abundant life.',color:0x3f8ee8,size:.31,orbit:3.8,period:1,earth:true},
 {name:'Mars',symbol:'♂',type:'Terrestrial planet',diameter:'6,779 km',day:'24 hours 37 minutes',description:'The Red Planet, home to giant volcanoes, ancient river valleys and future exploration dreams.',color:0xc96d4b,size:.24,orbit:4.8,period:1.88},
 {name:'Jupiter',symbol:'♃',type:'Gas giant',diameter:'139,820 km',day:'9 hours 56 minutes',description:'The largest planet, with swirling cloud bands and a centuries-old giant storm.',color:0xd4a77e,size:.72,orbit:6.3,period:11.86},
 {name:'Saturn',symbol:'♄',type:'Gas giant',diameter:'116,460 km',day:'10 hours 42 minutes',description:'A gas giant famous for its spectacular rings made mostly of ice and rocky fragments.',color:0xd8c18e,size:.61,orbit:8.0,period:29.45,ring:true},
 {name:'Uranus',symbol:'♅',type:'Ice giant',diameter:'50,724 km',day:'17 hours 14 minutes',description:'An ice giant that rotates on its side, giving it some of the most unusual seasons.',color:0x8bd9dc,size:.43,orbit:9.7,period:84},
 {name:'Neptune',symbol:'♆',type:'Ice giant',diameter:'49,244 km',day:'16 hours 6 minutes',description:'A distant blue world with supersonic winds, far beyond the orbit of Uranus.',color:0x416de0,size:.42,orbit:11.4,period:164.8}
];
function setPlanet(index){
  const p=planetData[index];
  $('#planetSymbol').textContent=p.symbol;$('#planetName').textContent=p.name;$('#planetDescription').textContent=p.description;
  $('#planetType').textContent=p.type;$('#planetDiameter').textContent=p.diameter;$('#planetDay').textContent=p.day;
  $$('#planetSelector button').forEach((b,i)=>b.classList.toggle('active',i===index));
}
planetData.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i===0?'☉':String(i);b.title=p.name;b.setAttribute('aria-label',p.name);b.addEventListener('click',()=>{setPlanet(i);if(window.solarObjects?.[i])window.solarControls?.target?.set(...window.solarObjects[i].position);});$('#planetSelector').appendChild(b);});
setPlanet(0);

(function initSolarSystem(){
  const host=$('#solarCanvas');
  if(!window.THREE){$('#solarLoading').textContent='3D library unavailable. Check your internet connection.';return;}
  const THREE=window.THREE;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,host.clientWidth/host.clientHeight,.1,1000);
  camera.position.set(0,15,24);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff,1.1));
  const sunLight=new THREE.PointLight(0xffd28a,2.4,100);scene.add(sunLight);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(1.05,48,48),new THREE.MeshBasicMaterial({color:0xffbd55}));scene.add(sun);
  const sunGlow=new THREE.Mesh(new THREE.SphereGeometry(1.35,32,32),new THREE.MeshBasicMaterial({color:0xffa43b,transparent:true,opacity:.12}));scene.add(sunGlow);
  const planetMeshes=[], orbitLines=[];
  planetData.slice(1).forEach((p,i)=>{
    const geometry=new THREE.SphereGeometry(p.size,32,32);
    const material=new THREE.MeshStandardMaterial({color:p.color,roughness:.88,metalness:.02});
    const mesh=new THREE.Mesh(geometry,material);mesh.userData={index:i+1,orbit:p.orbit,period:p.period,phase:Math.random()*Math.PI*2};scene.add(mesh);
    if(p.ring){const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.25,p.size*1.85,64),new THREE.MeshBasicMaterial({color:0xcbb98e,side:THREE.DoubleSide,transparent:true,opacity:.7}));ring.rotation.x=Math.PI/2.35;mesh.add(ring);}
    const points=[];for(let j=0;j<=160;j++){const a=j/160*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*p.orbit,0,Math.sin(a)*p.orbit));}
    const orbit=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x405a82,transparent:true,opacity:.42}));scene.add(orbit);orbitLines.push(orbit);planetMeshes.push(mesh);
  });
  // Background stars
  const starPositions=[];for(let i=0;i<900;i++){starPositions.push((Math.random()-.5)*70,(Math.random()-.5)*45,(Math.random()-.5)*70);}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
  scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xb8d5ff,size:.055})));
  let dragging=false,previous={x:0,y:0},rotY=0,rotX=-.22,zoom=24;
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;previous={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;rotY+=(e.clientX-previous.x)*.006;rotX+=(e.clientY-previous.y)*.004;rotX=Math.max(-1,Math.min(1,rotX));previous={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(13,Math.min(38,zoom+e.deltaY*.018));},{passive:false});
  window.solarObjects=[{position:new THREE.Vector3(0,0,0)},...planetMeshes.map(m=>({position:new THREE.Vector3()}))];
  window.solarControls={target:{set:(x,y,z)=>{camera.position.set(x+8,y+7,z+10);}}};
  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);const t=clock.getElapsedTime();
    planetMeshes.forEach((mesh,i)=>{const d=planetData[i+1],angle=t*(.12/Math.sqrt(d.period)) + mesh.userData.phase;mesh.position.set(Math.cos(angle)*d.orbit,0,Math.sin(angle)*d.orbit);mesh.rotation.y=t*.25;window.solarObjects[i+1].position.copy(mesh.position);});
    sun.rotation.y=t*.08;camera.position.x=Math.sin(rotY)*zoom;camera.position.z=Math.cos(rotY)*zoom;camera.position.y=rotX*8+5;camera.lookAt(0,0,0);
    renderer.render(scene,camera);
  }
  function resize(){const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
  addEventListener('resize',resize);$('#solarLoading').style.display='none';animate();
})();
