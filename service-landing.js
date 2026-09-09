(function(){
  const body=document.body;
  const form=document.getElementById('booking-form');
  const success=document.getElementById('form-success');
  const mobileBtn=document.getElementById('mobile-menu-btn');
  const mobileNav=document.getElementById('mobile-nav');

  if(mobileBtn&&mobileNav){
    mobileBtn.addEventListener('click',()=>{
      const open=mobileNav.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded',String(open));
    });
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
  }

  document.querySelectorAll('a[href="#estimate"]').forEach(link=>{
    link.addEventListener('click',()=>{
      window.setTimeout(()=>{
        const first=document.getElementById('f-name');
        if(first) first.focus({preventScroll:true});
      },500);
    });
  });

  if(!form) return;

  const value=id=>document.getElementById(id)?.value.trim()||'';

  form.addEventListener('submit',async(event)=>{
    event.preventDefault();

    const name=value('f-name');
    const phone=value('f-phone');
    const email=value('f-email');
    const address=value('f-address');
    const zipcode=value('f-zipcode');
    const info=value('f-info');

    if(!name||!phone||!email||!zipcode){
      alert('Please fill in your name, phone, email and ZIP code.');
      return;
    }

    const button=form.querySelector('button[type="submit"]');
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Sending...';

    try{
      if(typeof window.gtag==='function'){
        window.gtag('event','conversion',{
          send_to:body.dataset.conversion,
          value:1,
          currency:'USD'
        });
      }

      const response=await fetch(body.dataset.webhook,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name,
          phone,
          email,
          address,
          zip_code:zipcode,
          additional_info:info,
          service:body.dataset.service,
          page_url:window.location.href
        })
      });

      if(!response.ok) throw new Error('Request failed');

      form.style.display='none';
      success.style.display='block';
      success.scrollIntoView({behavior:'smooth',block:'center'});
    }catch(error){
      alert('We could not send your request. Please call (404) 641-0139 or email portsidecleanusa@gmail.com.');
      button.disabled=false;
      button.textContent=original;
    }
  });
})();
