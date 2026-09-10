(function(){
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  const gtm=document.createElement('script');
  gtm.async=true;
  gtm.src='https://www.googletagmanager.com/gtm.js?id=GTM-WGG8SQK8';
  document.head.appendChild(gtm);

  const GOOGLE_SHEETS_WEBAPP='https://script.google.com/macros/s/AKfycbzVyCQu0njJcM3vJzAwRavQf8kj7nbEloxoGttWIrlmJDoFKyvd0iaaTLdOyxfPX2J9/exec';
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
  const params=new URLSearchParams(window.location.search);

  const normalizeUsPhone=input=>{
    const digits=String(input||'').replace(/\D/g,'');
    if(digits.length===10) return '+1'+digits;
    if(digits.length===11&&digits.startsWith('1')) return '+'+digits;
    return '';
  };

  const sendToGoogleSheets=lead=>{
    const sheetPayload=new URLSearchParams({
      timestamp:new Date().toISOString(),
      name:lead.name,
      phone:lead.phone,
      email:lead.email,
      address:lead.address,
      zip_code:lead.zip_code,
      additional_info:lead.additional_info,
      service:lead.service,
      page_url:lead.page_url,
      utm_source:params.get('utm_source')||'',
      utm_medium:params.get('utm_medium')||'',
      utm_campaign:params.get('utm_campaign')||'',
      utm_content:params.get('utm_content')||'',
      gclid:params.get('gclid')||''
    });

    return fetch(GOOGLE_SHEETS_WEBAPP,{
      method:'POST',
      mode:'no-cors',
      body:sheetPayload
    });
  };

  form.addEventListener('submit',async(event)=>{
    event.preventDefault();

    const name=value('f-name');
    const phone=normalizeUsPhone(value('f-phone'));
    const email=value('f-email');
    const address=value('f-address');
    const zipcode=value('f-zipcode');
    const info=value('f-info');

    if(!name||!phone||!email||!zipcode){
      alert('Please fill in your name, a valid US phone number, email and ZIP code.');
      return;
    }

    const button=form.querySelector('button[type="submit"]');
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Sending...';

    const lead={
      name,
      phone,
      email,
      address,
      zip_code:zipcode,
      additional_info:info,
      service:body.dataset.service,
      page_url:window.location.href
    };

    const botPayload={
      name,
      phone,
      email,
      address,
      additional_info:info
    };

    const sheetsRequest=sendToGoogleSheets(lead).catch(error=>{
      console.error('Google Sheets lead capture failed',error);
      return null;
    });

    try{
      const response=await fetch(body.dataset.webhook,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(botPayload)
      });

      if(!response.ok) throw new Error('BotConversa request failed with status '+response.status);

      await sheetsRequest;

      if(typeof window.gtag==='function'){
        window.gtag('event','conversion',{
          send_to:body.dataset.conversion,
          value:1,
          currency:'USD'
        });
      }

      window.dataLayer.push({
        event:'form_submit_success',
        service:body.dataset.service,
        lead_type:'form'
      });

      form.style.display='none';
      success.style.display='block';
      success.scrollIntoView({behavior:'smooth',block:'center'});
    }catch(error){
      await sheetsRequest;
      console.error('BotConversa lead delivery failed',error);
      alert('We could not complete the automated confirmation. Your estimate request was still recorded for follow-up. Please call (404) 641-0139 or email portsidecleanusa@gmail.com if you need immediate assistance.');
      button.disabled=false;
      button.textContent=original;
    }
  });
})();
