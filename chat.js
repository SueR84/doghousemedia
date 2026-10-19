const root=document.querySelector('.dhts');
root.scrollIntoView({block:'center'});
window.dispatchEvent(new Event('scroll'));
await new Promise(r=>setTimeout(r,800));
const t0=Date.now();
while(!root.classList.contains('is-chat') && Date.now()-t0<60000) await new Promise(r=>setTimeout(r,150));
await new Promise(r=>setTimeout(r,3400));
const c=root.querySelector('.dhts-chat');
const ask=c.querySelector('.dhts-chat__ask'), rep=c.querySelector('.dhts-chat__reply'), img=c.querySelector('img');
return {text:c.querySelector('[data-chat-type]').textContent, cls:c.className,
 ask:[Math.round(ask.getBoundingClientRect().width),Math.round(ask.getBoundingClientRect().height)],
 replyOpacity:getComputedStyle(rep).opacity,
 imgH:Math.round(img.getBoundingClientRect().height), imgW:Math.round(img.getBoundingClientRect().width)};
