// TRIDENT FITNESS interactions
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Light / Dark mode
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'light' ? '☀️' : '🌙';
  try{ localStorage.setItem('trident-theme', t); }catch(e){}
}
let savedTheme = 'dark';
try{ savedTheme = localStorage.getItem('trident-theme') || 'dark'; }catch(e){}
applyTheme(savedTheme);
themeBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// Navbar shadow + top button
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow = window.scrollY > 10 ? '0 6px 24px rgba(0,0,0,.4)' : 'none';
  topBtn.style.display = window.scrollY > 600 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Counters
const counters = document.querySelectorAll('.counter');
const io = new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.target; let cur = 0;
  const step = Math.max(1, Math.floor(target/60));
  const t = setInterval(() => { cur += step; if(cur >= target){cur = target; clearInterval(t);} el.textContent = cur.toLocaleString('en-IN'); }, 25);
  io.unobserve(el);
}), {threshold:.5});
counters.forEach(c => io.observe(c));

// Reveal on scroll
document.querySelectorAll('.pcard,.tcard,.price,.feat,.bmi-box,.faq').forEach(el => el.classList.add('reveal'));
const rio = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); rio.unobserve(e.target);} }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

// Plans -> signup + payment modal
const PLANS = {
  '1 Month – ₹1500': {price:1500, days:30, label:'1 Month – ₹1500', sub:'Validity 30 days • 7 days FREE trainer with membership'},
  '3 Months – ₹2900': {price:2900, days:90, label:'3 Months – ₹2900', sub:'Validity 90 days • Save ₹1,600 • 7 days FREE trainer with membership'},
  '6 Months – ₹6000': {price:6000, days:180, label:'6 Months – ₹6000', sub:'Validity 180 days • Renewal ₹5500 • 7 days FREE trainer with membership'},
  '1 Year – ₹8500': {price:8500, days:365, label:'1 Year – ₹8500', sub:'Validity 365 days • Renewal ₹8000 • 7 days FREE trainer with membership'}
};
let curPlan = PLANS['3 Months – ₹2900'];
let curTotal = 2900;
const payModal = document.getElementById('payModal');
function openPay(planKey){
  curPlan = PLANS[planKey] || PLANS['3 Months – ₹2900'];
  curTotal = curPlan.price;
  document.getElementById('payPlanTitle').textContent = curPlan.label;
  document.getElementById('payPlanSub').textContent = curPlan.sub;
  document.getElementById('payErr').textContent = '';
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'none';
  payModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePay(){ payModal.classList.remove('open'); document.body.style.overflow = ''; }
document.querySelectorAll('.plan-btn').forEach(b => b.addEventListener('click', e => {
  e.preventDefault();
  const plan = b.dataset.plan; const sel = document.getElementById('fPlan');
  if(sel) [...sel.options].forEach((o,i) => { if(o.text.includes(plan.split(' – ')[0])) sel.selectedIndex = i; });
  openPay(plan);
}));
document.getElementById('payClose').addEventListener('click', closePay);
payModal.addEventListener('click', e => { if(e.target === payModal) closePay(); });

document.getElementById('toPay').addEventListener('click', () => {
  const name = document.getElementById('pName').value.trim();
  const phone = document.getElementById('pPhone').value.trim();
  const age = parseInt(document.getElementById('pAge').value, 10);
  const gender = document.getElementById('pGender').value;
  const addr = document.getElementById('pAddr').value.trim();
  const err = document.getElementById('payErr');
  if(name.length < 3){ err.textContent = '⚠️ Enter your full name'; return; }
  if(!/^[6-9][0-9]{9}$/.test(phone)){ err.textContent = '⚠️ Enter valid 10-digit mobile number'; return; }
  if(!age || age < 12 || age > 100){ err.textContent = '⚠️ Enter valid age (12–100)'; return; }
  if(!gender){ err.textContent = '⚠️ Select gender'; return; }
  if(addr.length < 3){ err.textContent = '⚠️ Enter your address'; return; }
  curTotal = curPlan.price + (document.getElementById('pTrainer').checked ? 1000 : 0);
  document.getElementById('payAmt').textContent = '₹' + curTotal.toLocaleString('en-IN');
  const upiLink = `upi://pay?pa=6294593283@upi&pn=TRIDENT%20FITNESS&am=${curTotal}&cu=INR&tn=${encodeURIComponent(curPlan.label)}`;
  document.getElementById('upiBtn').href = upiLink;
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
});
document.getElementById('backStep').addEventListener('click', () => {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
});
document.getElementById('copyUpi').addEventListener('click', e => {
  const t = document.getElementById('upiId').textContent;
  if(navigator.clipboard) navigator.clipboard.writeText(t);
  e.target.textContent = 'Copied ✓';
  setTimeout(() => e.target.textContent = 'Copy', 1500);
});
function finishPay(mode){
  const name = document.getElementById('pName').value.trim();
  const phone = document.getElementById('pPhone').value.trim();
  const dstr = document.getElementById('pDate').value;
  const start = dstr ? new Date(dstr + 'T00:00:00') : new Date();
  const expiry = new Date(start); expiry.setDate(expiry.getDate() + curPlan.days);
  const mid = 'TF' + Date.now().toString(36).toUpperCase().slice(-6);
  const fmt = d => d.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
  document.getElementById('paySuccess').innerHTML =
    `Thanks <b>${name}</b>! 🔱<br>Member ID: <b>${mid}</b><br>Plan: <b>${curPlan.label}</b>${document.getElementById('pTrainer').checked ? ' + Trainer ₹1000' : ''}<br>Total: <b>₹${curTotal.toLocaleString('en-IN')}</b> (${mode})<br>Valid: <b>${fmt(start)} → ${fmt(expiry)}</b><br><span class="small muted">Show this + payment screenshot on ${phone} at front desk (Mon–Sat).</span>`;
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
}
document.getElementById('paidBtn').addEventListener('click', () => finishPay('UPI'));
document.getElementById('payCash').addEventListener('click', () => finishPay('Cash at gym'));
document.getElementById('payDone').addEventListener('click', closePay);

// Schedule filter
document.querySelectorAll('.fbtn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.fbtn').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.f;
  document.querySelectorAll('.sched tr[data-cat]').forEach(r => {
    r.style.display = (f === 'all' || r.dataset.cat === f) ? '' : 'none';
  });
}));

// BMI
// Members-only BMI: verify membership first
let isMember = false;
document.getElementById('mVerify').addEventListener('click', () => {
  const phone = document.getElementById('mPhone').value.trim();
  const days = parseInt(document.getElementById('mPlan').value, 10);
  const dstr = document.getElementById('mDate').value;
  const out = document.getElementById('mOut');
  if(!/^[0-9]{10}$/.test(phone)){ out.innerHTML = '⚠️ Enter your 10-digit member phone number'; out.style.color = '#ff7b7b'; return; }
  if(!dstr){ out.innerHTML = '⚠️ Please select your joining date'; out.style.color = '#ff7b7b'; return; }
  const start = new Date(dstr + 'T00:00:00');
  const expiry = new Date(start); expiry.setDate(expiry.getDate() + days);
  const today = new Date(); today.setHours(0,0,0,0);
  if(expiry < today){ out.innerHTML = `❌ Membership EXPIRED on <b>${expiry.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</b><br>Please <a href="#pricing">renew your plan</a> to unlock BMI.`; out.style.color = '#ff5b5b'; return; }
  isMember = true;
  document.getElementById('memberLock').style.display = 'none';
  document.getElementById('bmiLocked').style.display = 'block';
  document.getElementById('memberBadge').textContent = `✅ Member verified • Valid till ${expiry.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`;
});

document.getElementById('bmiBtn').addEventListener('click', () => {
  const out = document.getElementById('bmiOut');
  if(!isMember){ out.textContent = '🔒 Members only — verify membership above first'; out.style.color = '#ff7b7b'; return; }
  const h = parseFloat(document.getElementById('height').value);
  const w = parseFloat(document.getElementById('weight').value);
  if(!h || !w || h < 100 || h > 250 || w < 25 || w > 300){ out.textContent = '⚠️ Enter valid height (100-250cm) & weight (25-300kg)'; out.style.color = '#ff7b7b'; return; }
  const bmi = w / Math.pow(h/100, 2);
  let cat = '', color = '', plan = '', key = '';
  if(bmi < 18.5){cat='UNDERWEIGHT'; color='#ffc300'; key='uw';}
  else if(bmi < 25){cat='FIT'; color='#22c55e'; key='fit';}
  else if(bmi < 30){cat='OVERWEIGHT'; color='#fb923c'; key='ow';}
  else{cat='OBESE'; color='#ff5b5b'; key='ob';}
  out.innerHTML = `Your BMI: <b>${bmi.toFixed(1)}</b> — <b>${cat}</b>`;
  out.style.color = color;
  const rows = [
    {r:'Below 18.5', c:'Underweight', d:'Build muscle', k:'uw'},
    {r:'18.5 – 24.9', c:'Fit', d:'Maintain', k:'fit'},
    {r:'25 – 29.9', c:'Overweight', d:'Fat loss', k:'ow'},
    {r:'30 & above', c:'Obese', d:'Guided loss', k:'ob'}
  ];
  document.getElementById('bmiChart').innerHTML =
    `<h4>📊 Full BMI Chart</h4><table class="bmi-table"><tr><th>BMI</th><th>Category</th><th>Focus</th></tr>` +
    rows.map(x => `<tr class="${x.k===key?'hl':''}"><td>${x.r}</td><td>${x.c}</td><td>${x.d}</td></tr>`).join('') + `</table>`;
  const plans = {
    uw:`<h4>🥗 Your Action Plan — Build Up</h4><ul><li>🏋️ <strong>Strength 4x/week</strong> (Mon/Wed/Fri/Sat) + use your <strong>7 days trainer FREE with membership</strong></li><li>🍚 <strong>Calorie surplus:</strong> rice, dal, eggs/chicken, milk, peanuts + 3 meals + 2 snacks</li><li>🥛 <strong>MuscleBlaze Biozyme Whey</strong> 1 scoop daily after workout</li><li>😴 Sleep 7–8 hrs. Recheck BMI every 30 days.</li></ul>`,
    fit:`<h4>💪 Your Action Plan — Stay Forged</h4><ul><li>🏋️ <strong>Strength 3x + HIIT/Cardio 2x</strong> per week</li><li>🥗 <strong>Balanced diet:</strong> protein each meal, 3–4L water</li><li>⚡ Creatine only if trainer advises for strength goals</li><li>📅 Maintain validity — renew before expiry.</li></ul>`,
    ow:`<h4>🔥 Your Action Plan — Fat Loss</h4><ul><li>🔥 <strong>HIIT 4x/week</strong> (6AM or 6:30PM batch) + 8k steps daily</li><li>🥗 <strong>Calorie deficit:</strong> less rice/oil/sugar, more veg + protein. Ask desk for diet chart</li><li>👊 Use your <strong>7 days trainer FREE with membership</strong> for form + cardio plan</li><li>📅 Recheck BMI every 15 days.</li></ul>`,
    ob:`<h4>❤️ Your Action Plan — Guided Start</h4><ul><li>🚶 <strong>Start slow:</strong> brisk walk + beginner circuits 3x/week. No heavy lifting alone</li><li>👨‍🏫 <strong>Personal trainer strongly advised</strong> (₹1000, 7 days FREE with membership)</li><li>🥗 <strong>Nutrition plan:</strong> small frequent meals, cut sweets/fried. Get trainer diet chart</li><li>🩺 If BP/sugar issues, consult doctor first. Recheck BMI every 15 days.</li></ul>`
  };
  document.getElementById('bmiPlan').innerHTML = plans[key];
});

// Validity checker
document.getElementById('vBtn').addEventListener('click', () => {
  const days = parseInt(document.getElementById('vPlan').value, 10);
  const dstr = document.getElementById('vDate').value;
  const out = document.getElementById('vOut');
  if(!dstr){ out.textContent = '⚠️ Please select your joining date'; out.style.color = '#ff7b7b'; return; }
  const start = new Date(dstr + 'T00:00:00');
  const expiry = new Date(start); expiry.setDate(expiry.getDate() + days);
  const today = new Date(); today.setHours(0,0,0,0);
  const left = Math.ceil((expiry - today) / 86400000);
  const fmt = d => d.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
  if(left < 0){ out.innerHTML = `Expired on <b>${fmt(expiry)}</b> ❌<br>Please renew at the front desk.`; out.style.color = '#ff5b5b'; }
  else if(left === 0){ out.innerHTML = `Expires <b>TODAY (${fmt(expiry)})</b> ⚠️<br>Renew today to continue.`; out.style.color = '#ffc300'; }
  else{ out.innerHTML = `Valid till <b>${fmt(expiry)}</b> ✅<br>${left} days left (started ${fmt(start)})<br><span class="small">📲 You will get a WhatsApp reminder before expiry — opt in below.</span>`; out.style.color = '#22c55e'; }
});

// WhatsApp expiry reminder (via gym number — no backend needed)
document.getElementById('vWa').addEventListener('click', () => {
  const phone = document.getElementById('vPhone').value.trim();
  const days = parseInt(document.getElementById('vPlan').value, 10);
  const dstr = document.getElementById('vDate').value;
  const out = document.getElementById('vOut');
  if(!/^[6-9][0-9]{9}$/.test(phone)){ out.innerHTML = '⚠️ Enter valid 10-digit WhatsApp number'; out.style.color = '#ff7b7b'; return; }
  if(!dstr){ out.innerHTML = '⚠️ Select your joining date first'; out.style.color = '#ff7b7b'; return; }
  const planTxt = document.getElementById('vPlan').selectedOptions[0].text;
  const start = new Date(dstr + 'T00:00:00');
  const expiry = new Date(start); expiry.setDate(expiry.getDate() + days);
  const remind = new Date(expiry); remind.setDate(remind.getDate() - 3);
  const fmt = d => d.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
  const msg = `Hi TRIDENT FITNESS! Remind me on WhatsApp before my membership expires.%0AMy No: ${phone}%0APlan: ${encodeURIComponent(planTxt)}%0AJoined: ${fmt(start)}%0AExpires: ${fmt(expiry)}`;
  const link = document.getElementById('vWaLink');
  link.href = `https://wa.me/916294593283?text=${msg}`;
  link.style.display = 'block';
  out.innerHTML = `✅ Reminder set! You will receive a WhatsApp message around <b>${fmt(remind)}</b> (3 days before expiry on ${fmt(expiry)}).<br>Tap <b>Confirm on WhatsApp →</b> below to register.`;
  out.style.color = '#22c55e';
});

// Testimonials
const slides = document.querySelectorAll('.t-slide'); let idx = 0;
function show(i){ slides.forEach(s => s.classList.remove('active')); idx = (i+slides.length)%slides.length; slides[idx].classList.add('active'); }
document.getElementById('tNext').addEventListener('click', () => show(idx+1));
document.getElementById('tPrev').addEventListener('click', () => show(idx-1));
setInterval(() => show(idx+1), 6000);

// Join form
document.getElementById('joinForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const msg = document.getElementById('formMsg');
  if(name.length < 2){ msg.textContent = '⚠️ Please enter your name'; msg.style.color='#ff7b7b'; return; }
  if(!/^[0-9+ ]{10,15}$/.test(phone)){ msg.textContent = '⚠️ Enter a valid 10-digit phone number'; msg.style.color='#ff7b7b'; return; }
  const plan = document.getElementById('fPlan').value;
  const trainer = document.getElementById('fTrainer') && document.getElementById('fTrainer').checked ? ' + Personal Trainer (7 days FREE with membership, then ₹1000)' : '';
  msg.textContent = `🔱 Thanks ${name}! Your ${plan}${trainer} request is received. We'll call ${phone} shortly.`;
  msg.style.color = '#22c55e';
  e.target.reset();
});
