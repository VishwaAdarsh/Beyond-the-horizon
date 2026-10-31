(function(){
  var NS='http://www.w3.org/2000/svg',W=1440,H=600;
  function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  var gen={
    ridge:function(a){var b=a[0],amp=a[1],r=rng(a[2]),p='M0 '+H,x=0,ph=r()*6;
      while(x<=W){var y=b+Math.sin(x/190+ph)*amp*.5+Math.sin(x/70+ph*2)*amp*.25+(r()-.5)*amp*.35;p+=' L'+x+' '+y.toFixed(1);x+=24}
      return p+' L'+W+' '+H+' Z'},
    trees:function(a){var b=a[0],s=a[1],n=a[2],r=rng(a[3]),p='M0 '+H+' L0 '+b,step=W/n;
      for(var i=0;i<n;i++){var cx=i*step+step/2+(r()-.5)*step*.5,h=s*(.7+r()*.8),w=h*.28,base=b+r()*24;
        p+=' L'+(cx-w).toFixed(0)+' '+base.toFixed(0);
        for(var t=0;t<3;t++){var y0=base-h*t*.3,y1=base-h*(t*.3+.42),ww=w*(1-t*.28);
          p+=' L'+(cx-ww*.45).toFixed(0)+' '+y0.toFixed(0)+' L'+(cx-ww).toFixed(0)+' '+y0.toFixed(0)+' L'+cx.toFixed(0)+' '+y1.toFixed(0)+' L'+(cx+ww).toFixed(0)+' '+y0.toFixed(0)+' L'+(cx+ww*.45).toFixed(0)+' '+y0.toFixed(0)}
        p+=' L'+(cx+w).toFixed(0)+' '+base.toFixed(0)}
      return p+' L'+W+' '+b+' L'+W+' '+H+' Z'},
    wave:function(a){var b=a[0],amp=a[1],wl=a[2],ph=a[3],p='M0 '+H;
      for(var x=0;x<=W;x+=20)p+=' L'+x+' '+(b+Math.sin(x/wl*6.283+ph)*amp+Math.sin(x/wl*13+ph)*amp*.25).toFixed(1);
      return p+' L'+W+' '+H+' Z'}
  };
  var layers=[].slice.call(document.querySelectorAll('.layer'));
  layers.forEach(function(el){
    var k=el.dataset.k;if(!k)return;
    var svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('preserveAspectRatio','none');
    var path=document.createElementNS(NS,'path');path.setAttribute('d',gen[k](el.dataset.a.split(',').map(Number)));path.setAttribute('fill',el.dataset.f);
    svg.appendChild(path);el.appendChild(svg);
  });

  var secs=[].slice.call(document.querySelectorAll('section')).map(function(s){return{el:s,c:s.querySelector('.content'),ls:layers.filter(function(l){return s.contains(l)})}});
  var bar=document.getElementById('progress'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),ticking=false,sy=scrollY;
  function measure(){secs.forEach(function(s){var b=s.el.getBoundingClientRect();s.t=b.top+scrollY;s.h=b.height})}
  measure();addEventListener('load',function(){measure();req()});addEventListener('resize',measure);
  function update(){
    ticking=false;var vh=innerHeight,mob=innerWidth<760?.6:1;sy+=(scrollY-sy)*.14;if(Math.abs(scrollY-sy)<.2)sy=scrollY;else req();
    var max=document.documentElement.scrollHeight-vh;
    bar.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';
    if(reduce.matches)return;
    secs.forEach(function(s){
      var r={top:s.t-sy,height:s.h,bottom:s.t-sy+s.h};
      if(r.bottom<-vh*.5||r.top>vh*1.5)return;
      s.ls.forEach(function(l){var v=(r.top*parseFloat(l.dataset.s)*mob).toFixed(1);l.style.transform=l.dataset.x?'translate3d('+v+'px,0,0)':'translate3d(0,'+v+'px,0)'});
      var p=Math.min(1,Math.max(0,(-r.top-r.height*.25)/(r.height*.55))),q=Math.min(1,Math.max(0,r.top/vh));
      if(s.c){s.c.style.opacity=((1-p)*(1-q*.6)).toFixed(3);s.c.style.transform='translate3d(0,'+(-p*50).toFixed(1)+'px,0) scale('+(1-p*.06).toFixed(3)+')'}
    });
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);reduce.addEventListener&&reduce.addEventListener('change',function(){if(reduce.matches)layers.forEach(function(l){l.style.transform=''});req()});
  update();

  var names=['Night','Forest','Desert','Ocean','Aurora','Space'],hn=document.getElementById('hudN'),ht=document.getElementById('hudT');
  var ho=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var i=secs.findIndex(function(s){return s.el===e.target});hn.textContent='0'+(i+1)+' / 0'+secs.length;ht.textContent=names[i];cur=i;scene(i)})},{rootMargin:'-50% 0px -50% 0px'});
  secs.forEach(function(s){ho.observe(s.el)});
  var sb=document.getElementById('snap');
  sb.addEventListener('click',function(){var on=document.documentElement.classList.toggle('snap');sb.setAttribute('aria-pressed',on);sb.textContent='Snap: '+(on?'on':'off')});
  addEventListener('keydown',function(e){if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;var n=parseInt(e.key,10);if(n>=1&&n<=secs.length)glide(secs[n-1].t)});
  var raf=0;
  function glide(y){cancelAnimationFrame(raf);var h=document.documentElement,y0=scrollY,d=y-y0;if(!d)return;if(reduce.matches){scrollTo(0,y);return}
    var dur=Math.min(1700,Math.max(800,Math.abs(d)*.45)),t0=performance.now();h.classList.add('jumping');
    function step(t){var k=Math.min(1,(t-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo(0,y0+d*e);if(k<1)raf=requestAnimationFrame(step);else h.classList.remove('jumping')}
    raf=requestAnimationFrame(step)}
  function stopGlide(e){if(e.type!=='keydown'||/Arrow|Page|Home|End| /.test(e.key)){cancelAnimationFrame(raf);document.documentElement.classList.remove('jumping')}}
  ['wheel','touchstart','keydown'].forEach(function(n){addEventListener(n,stopGlide,{passive:true})});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var el=document.getElementById(a.getAttribute('href').slice(1));if(!el)return;e.preventDefault();glide(el.getBoundingClientRect().top+scrollY);history.replaceState(null,'',a.getAttribute('href'))});
  var nv=document.querySelector('nav'),lastY=scrollY;
  addEventListener('scroll',function(){var y=scrollY;nv.classList.toggle('hide',y>lastY&&y>140&&!document.getElementById('links').classList.contains('open')&&!nv.contains(document.activeElement));lastY=y},{passive:true});
  nv.addEventListener('focusin',function(){nv.classList.remove('hide')});
  var cur=0,ac,master,nf,ng,lg,lfo,pg,pads=[],soundOn=false,snd=document.getElementById('snd');
  var prof=[[300,.03,.1,.01,[110,165,220],.05],[900,.05,.2,.03,[98,147,196],.03],[1800,.04,.08,.02,[87,131,174],.035],[600,.09,.12,.06,[130,196,261],.02],[200,.015,.3,.01,[174,261,349],.06],[120,.01,.05,.005,[55,82,110],.08]];
  function scene(i){if(!ac)return;var p=prof[i],t=ac.currentTime;nf.frequency.setTargetAtTime(p[0],t,1.5);ng.gain.setTargetAtTime(p[1],t,1.5);lfo.frequency.setTargetAtTime(p[2],t,1.5);lg.gain.setTargetAtTime(p[3],t,1.5);pads.forEach(function(o,k){o.frequency.setTargetAtTime(p[4][k],t,2)});pg.gain.setTargetAtTime(p[5],t,2)}
  function initAudio(){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;var p=prof[cur];ac=new AC();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
    var len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;
    var ns=ac.createBufferSource();ns.buffer=buf;ns.loop=true;nf=ac.createBiquadFilter();nf.type='lowpass';nf.frequency.value=p[0];ng=ac.createGain();ng.gain.value=p[1];ns.connect(nf);nf.connect(ng);ng.connect(master);ns.start();
    lfo=ac.createOscillator();lfo.frequency.value=p[2];lg=ac.createGain();lg.gain.value=p[3];lfo.connect(lg);lg.connect(ng.gain);lfo.start();
    pg=ac.createGain();pg.gain.value=p[5];pg.connect(master);for(var k=0;k<3;k++){var o=ac.createOscillator();o.type='sine';o.frequency.value=p[4][k];o.detune.value=(k-1)*6;o.connect(pg);o.start();pads.push(o)}
    return true}
  snd.addEventListener('click',function(){if(!ac&&!initAudio())return;soundOn=!soundOn;snd.setAttribute('aria-pressed',soundOn);snd.textContent='Sound: '+(soundOn?'on':'off');if(soundOn)ac.resume();master.gain.setTargetAtTime(soundOn?.6:0,ac.currentTime,.4)});
  document.addEventListener('visibilitychange',function(){if(!ac)return;if(document.hidden)ac.suspend();else if(soundOn)ac.resume()});
  var sc=document.getElementById('scenes'),lastF;
  function openMenu(){lastF=document.activeElement;sc.hidden=false;document.documentElement.style.overflow='hidden';[].forEach.call(sc.querySelectorAll('a'),function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+secs[cur].el.id)});document.getElementById('scClose').focus()}
  function closeMenu(){sc.hidden=true;document.documentElement.style.overflow='';if(lastF&&lastF.focus)lastF.focus({preventScroll:true})}
  document.getElementById('menuBtn').addEventListener('click',openMenu);
  document.getElementById('scClose').addEventListener('click',closeMenu);
  sc.addEventListener('click',function(e){if(e.target===sc||e.target.closest('a'))closeMenu()});
  addEventListener('keydown',function(e){var k=e.key;if(!sc.hidden){if(k==='Escape'){closeMenu();return}if(k==='Tab'){var f=sc.querySelectorAll('a,button'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}return}if((k==='m'||k==='M')&&!e.altKey&&!e.ctrlKey&&!e.metaKey)openMenu()});
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
    rv.forEach(function(e){io.observe(e)});
  }else rv.forEach(function(e){e.classList.add('in')});

  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var id=e.target.id;document.querySelectorAll('.dots a,.links a').forEach(function(a){var on=a.getAttribute('href')==='#'+id;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})})},{rootMargin:'-50% 0px -50% 0px'});
  secs.forEach(function(s){so.observe(s.el)});
  if(matchMedia('(pointer:fine)').matches)addEventListener('pointermove',function(e){if(reduce.matches)return;var d=document.documentElement.style;d.setProperty('--px',(e.clientX/innerWidth*2-1).toFixed(3));d.setProperty('--py',(e.clientY/innerHeight*2-1).toFixed(3))},{passive:true});
  var menu=document.querySelector('.menu'),links=document.getElementById('links');
  menu.addEventListener('click',function(){var o=links.classList.toggle('open');menu.setAttribute('aria-expanded',o)});
  links.addEventListener('click',function(e){if(e.target.tagName==='A'){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
})();
