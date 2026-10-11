// Menu, project filters, scroll progress, and small animations. Works on GitHub Pages.
(()=>{
  const nav=document.getElementById('site-nav');
  const menu=document.querySelector('.menu-button');
  const menuText=menu?.querySelector('.menu-text');
  const closeMenu=()=>{if(!nav||!menu)return;nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');if(menuText)menuText.textContent='Menu';};
  if(nav&&menu){
    menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(isOpen));menu.setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');if(menuText)menuText.textContent=isOpen?'Close':'Menu';});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
    document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu();});
    window.addEventListener('resize',()=>{if(window.innerWidth>760)closeMenu();});
  }
  const header=document.querySelector('.site-header');
  const bar=document.querySelector('.scroll-progress');
  let ticking=false;
  const drawScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(bar)bar.style.width=(Math.min(100,scrollY/max*100)).toFixed(2)+'%';header?.classList.toggle('is-scrolled',scrollY>12);ticking=false;};
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(drawScroll);ticking=true;}},{passive:true});drawScroll();
  const filters=document.querySelectorAll('[data-filter]');
  const projects=document.querySelectorAll('.work-item[data-category]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const category=button.dataset.filter;
    projects.forEach(project=>{const match=category==='all'||project.dataset.category===category;project.hidden=!match;if(!match)project.open=false;});
  }));
  // Native <details> keeps the project list usable when JavaScript is off.
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.work-item').forEach(item=>item.addEventListener('toggle',()=>{
    if(!item.open||reduceMotion)return;
    const content=item.querySelector('.work-content-inner');
    content?.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
  }));
  const hash=decodeURIComponent(location.hash.slice(1));
  if(hash){const target=document.getElementById(hash);if(target?.matches('.work-item')){target.open=true;setTimeout(()=>target.scrollIntoView({block:'start'}),130);}}
  if(!reduceMotion&&'IntersectionObserver' in window){
    document.documentElement.classList.add('js-motion');
    const observer=new IntersectionObserver((entries,o)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');o.unobserve(entry.target);}}),{threshold:.06,rootMargin:'0px 0px -10px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const old=button.textContent;try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(button.dataset.copy);
      else{const t=document.createElement('textarea');t.value=button.dataset.copy;document.body.append(t);t.select();if(!document.execCommand('copy'))throw Error('unavailable');t.remove();}
      button.textContent='Copied';
    }catch{button.textContent='Select the text above to copy';}
    setTimeout(()=>button.textContent=old,1900);
  }));
})();