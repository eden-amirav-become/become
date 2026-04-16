// === STATE ===
var currentStep = 0;
var quizData = { amount: 50000, time: '', revenue: '', credit: '', name: '', email: '', phone: '', biz: '' };
var totalSteps = 7;

// === OPTIONS DATA ===
var timeOptions = [
  { label: 'Less than 1 year', sub: 'Startup / early stage', icon: '🌱', value: '<1' },
  { label: '1–2 years', sub: 'Growing business', icon: '📈', value: '1-2' },
  { label: '2–5 years', sub: 'Established business', icon: '🏢', value: '2-5' },
  { label: '5+ years', sub: 'Mature business', icon: '🏛️', value: '5+' }
];

var revenueOptions = [
  { label: 'Under $10,000', sub: 'Early revenue', icon: '💵', value: '<10k' },
  { label: '$10,000 – $25,000', sub: 'Growing revenue', icon: '💰', value: '10k-25k' },
  { label: '$25,000 – $50,000', sub: 'Solid revenue', icon: '📊', value: '25k-50k' },
  { label: '$50,000 – $100,000', sub: 'Strong revenue', icon: '🚀', value: '50k-100k' },
  { label: '$100,000+', sub: 'High revenue', icon: '⭐', value: '100k+' }
];

var creditOptions = [
  { label: 'Poor (300–579)', sub: 'Limited options, higher rates', icon: '🔴', value: 'poor', color: '#fef2f2' },
  { label: 'Fair (580–669)', sub: 'Some options available', icon: '🟠', value: 'fair', color: '#fff7ed' },
  { label: 'Good (670–739)', sub: 'Many options, competitive rates', icon: '🟡', value: 'good', color: '#fefce8' },
  { label: 'Excellent (740+)', sub: 'Best rates and terms', icon: '🟢', value: 'excellent', color: '#f0fdf4' }
];

// === INIT ===
document.addEventListener('DOMContentLoaded', function() {
  renderOptions('timeOptions', timeOptions, 'time', 2);
  renderOptions('revenueOptions', revenueOptions, 'revenue', 3);
  renderOptions('creditOptions', creditOptions, 'credit', 4);
  updateProgress();
});

// === RENDER OPTION CARDS ===
function renderOptions(containerId, options, dataKey, nextStep) {
  var container = document.getElementById(containerId);
  var html = '';
  for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var bgStyle = opt.color ? 'background:' + opt.color : 'background:#f0eefe';
    html += '<div class="option-card" data-value="' + opt.value + '" onclick="selectOption(this,\'' + dataKey + '\',' + nextStep + ')">';
    html += '<div class="option-icon" style="' + bgStyle + '">' + opt.icon + '</div>';
    html += '<div><div class="option-label">' + opt.label + '</div><div class="option-sub">' + opt.sub + '</div></div>';
    html += '<div class="option-check"><svg width="12" height="12" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// === SELECT OPTION ===
function selectOption(card, dataKey, nextStep) {
  var siblings = card.parentElement.children;
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove('selected');
  }
  card.classList.add('selected');
  quizData[dataKey] = card.getAttribute('data-value');
  setTimeout(function() { goToStep(nextStep); }, 400);
}

// === SLIDER ===
function updateSlider(val) {
  quizData.amount = parseInt(val);
  document.getElementById('sliderAmount').textContent = '$' + parseInt(val).toLocaleString();
  // Update slider track fill
  var slider = document.getElementById('fundingSlider');
  var pct = ((val - 5000) / (500000 - 5000)) * 100;
  slider.style.background = 'linear-gradient(to right, #7C3AED 0%, #7C3AED ' + pct + '%, #e5e7eb ' + pct + '%, #e5e7eb 100%)';
}

// === NAVIGATION ===
function goToStep(n) {
  var oldStep = document.getElementById('step-' + currentStep);
  var newStep = document.getElementById('step-' + n);
  if (!oldStep || !newStep) return;

  oldStep.classList.add('exiting');
  oldStep.classList.remove('active');

  setTimeout(function() {
    oldStep.classList.remove('exiting');
    oldStep.style.display = 'none';
    newStep.classList.add('active');
    newStep.style.display = 'block';
    currentStep = n;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

// === PROGRESS BAR ===
function updateProgress() {
  var pct = currentStep === 0 ? 0 : (currentStep / totalSteps) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
}

// === FORM VALIDATION & SUBMIT ===
function submitForm() {
  var valid = true;
  var fields = [
    { id: 'fName', key: 'name' },
    { id: 'fEmail', key: 'email' },
    { id: 'fPhone', key: 'phone' },
    { id: 'fBiz', key: 'biz' }
  ];

  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById(fields[i].id);
    var val = el.value.trim();
    if (!val) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
      quizData[fields[i].key] = val;
    }
  }

  // Basic email check
  var emailEl = document.getElementById('fEmail');
  if (emailEl.value && emailEl.value.indexOf('@') === -1) {
    emailEl.classList.add('error');
    valid = false;
  }

  if (valid) {
    goToStep(6);
    runAnalyzing();
  }
}

// === ANALYZING ANIMATION ===
function runAnalyzing() {
  var steps = ['a-step-1', 'a-step-2', 'a-step-3'];
  var delay = 800;

  for (var i = 0; i < steps.length; i++) {
    (function(idx) {
      setTimeout(function() {
        document.getElementById(steps[idx]).classList.add('active');
        if (idx > 0) {
          document.getElementById(steps[idx - 1]).classList.remove('active');
          document.getElementById(steps[idx - 1]).classList.add('done');
          document.getElementById(steps[idx - 1]).querySelector('svg').innerHTML = '<path d="M20 6L9 17l-5-5" stroke="#16a34a" stroke-width="2" fill="none"/>';
        }
      }, delay * (idx + 1));
    })(i);
  }

  setTimeout(function() {
    document.getElementById(steps[2]).classList.remove('active');
    document.getElementById(steps[2]).classList.add('done');
    document.getElementById(steps[2]).querySelector('svg').innerHTML = '<path d="M20 6L9 17l-5-5" stroke="#16a34a" stroke-width="2" fill="none"/>';
    setTimeout(function() {
      buildResults();
      goToStep(7);
    }, 400);
  }, delay * 4);
}

// === BUILD RESULTS ===
function buildResults() {
  var name = quizData.name.split(' ')[0] || 'there';
  document.getElementById('resultsTitle').textContent = 'Great news, ' + name + '! You\'re pre-qualified! 🎉';

  var amt = quizData.amount;
  var offers = getOffers(amt);

  var html = '';

  // Solution strip
  html += '<div class="sol-strip">';
  html += '<div class="sol-strip-top" onclick="toggleSolStrip(this)">';
  html += '<div class="sol-strip-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 13.5l3-3 3 3 3-6 3 6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  html += '<div class="sol-strip-text"><div class="sol-strip-title">Your solution: Business Term Loan</div>';
  html += '<div class="sol-strip-sub">Matched based on your profile</div></div>';
  html += '<span class="sol-strip-chev">▾</span></div>';
  html += '<div class="sol-strip-body"><p>A business term loan gives you a lump sum of capital with fixed monthly payments over a set period. Based on your revenue and credit profile, this is the best fit for your needs.</p></div>';
  html += '</div>';

  // Offer cards
  for (var i = 0; i < offers.length; i++) {
    html += buildOfferCard(offers[i], i);
  }

  // What Happens Next
  html += '<div class="section-card">';
  html += '<div class="whn-full-hdr"><span>What Happens Next</span></div>';
  html += '<div class="step-card">';
  html += '<div class="step-icon"><svg width="18" height="18" fill="none" stroke="#7C3AED" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>';
  html += '<div><div class="step-title">A Funding Specialist Will Call You</div>';
  html += '<div class="step-text">A dedicated advisor will walk you through your options and answer any questions.</div></div></div>';
  html += '<div class="step-card">';
  html += '<div class="step-icon"><svg width="18" height="18" fill="none" stroke="#7C3AED" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg></div>';
  html += '<div><div class="step-title">Complete Your Application Online</div>';
  html += '<div class="step-text">Get a head start — finish your application online before your call to speed up approval.</div></div></div>';
  html += '</div>';

  // FAQ
  html += '<div class="section-card">';
  html += '<div class="section-header" onclick="toggleSection(\'faqBody\',this)"><span class="section-header-text">FAQ</span><span class="section-arrow">▲</span></div>';
  html += '<div id="faqBody" style="padding:4px 20px 12px;">';
  html += buildFaq('What are the interest rates?', 'Rates vary by lender and your credit profile. Based on your answers, you can expect rates between 6%–24% APR. Your matched lenders will provide exact quotes.');
  html += buildFaq('How quickly can I get funded?', 'Most lenders can fund within 1–5 business days after approval. Some offer same-day funding for qualified applicants.');
  html += buildFaq('What documents do I need?', 'Typically you\'ll need: 3–6 months of bank statements, business tax returns, proof of business ownership, and a valid ID.');
  html += buildFaq('Will this affect my credit score?', 'Our initial matching uses a soft pull that doesn\'t affect your score. A hard pull only happens if you choose to formally apply with a lender.');
  html += buildFaq('Is there a prepayment penalty?', 'Most of our lending partners offer loans with no prepayment penalties, meaning you can pay off your loan early without extra fees.');
  html += '</div></div>';

  // Footer
  html += '<div style="text-align:center;padding:12px 16px 8px;font-size:10px;color:#9ca3af;line-height:1.5;">Pre-qualification is based on the information you provided and does not guarantee final approval.</div>';
  html += '<div style="text-align:center;padding:4px 16px;font-size:10px;color:#b0b0b0;">© 2026 Become. All Rights Reserved.</div>';

  document.getElementById('resultsContent').innerHTML = html;
}

// === BUILD SINGLE OFFER CARD ===
function buildOfferCard(offer, index) {
  var badge = index === 0 ? '<div class="top-pick-badge">🏆 Your Top Match</div>' : '';
  var h = '';
  h += '<div class="offer-card">' + badge;
  h += '<div class="partner-header"><div class="partner-logo">' + offer.name + '</div></div>';
  h += '<div class="about-divider"><div></div><span>Loan Details</span><div></div></div>';
  h += '<div class="savings-section">';
  h += '<div class="comparison-box" style="text-align:center;">';
  h += '<div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Loan amount up to</div>';
  h += '<div style="font-size:30px;font-weight:800;color:#1a1a2e;line-height:1;">$' + offer.amount.toLocaleString() + '</div></div>';
  h += '<div style="margin-bottom:16px;">';
  h += '<div class="plan-divider"><div></div><span>Estimated terms</span><div></div></div>';
  h += '<div class="plan-row"><span style="font-size:14px;color:#6b7280;">APR range</span><span style="font-size:15px;font-weight:600;color:#1a1a2e;">' + offer.apr + '</span></div>';
  h += '<div class="plan-row"><span style="font-size:14px;color:#6b7280;">Term length</span><span style="font-size:15px;font-weight:600;color:#1a1a2e;">' + offer.term + '</span></div>';
  h += '<div class="plan-row"><span style="font-size:14px;color:#6b7280;">Est. monthly payment</span><span style="font-size:15px;font-weight:600;color:#1a1a2e;">$' + offer.monthly.toLocaleString() + '</span></div>';
  h += '<div class="plan-row" style="border-bottom:none;padding:13px 0;">';
  h += '<span style="font-size:15px;font-weight:600;color:#1a1a2e;">Match score</span>';
  h += '<span style="font-size:18px;font-weight:700;color:#16a34a;">' + offer.score + '%</span></div>';
  h += '</div></div>';

  // Testimonial
  h += '<div class="testimonial">';
  h += '<div class="testimonial-avatar">' + offer.testimonial.avatar + '</div>';
  h += '<div class="testimonial-content"><div class="testimonial-text">"' + offer.testimonial.text + '"</div>';
  h += '<div class="testimonial-author">— ' + offer.testimonial.author + '</div></div></div>';

  // Accordion
  h += '<div class="card-accordion">';
  h += '<div class="card-acc-item"><button class="card-acc-btn" onclick="toggleAcc(this)"><span>Pros & Cons</span><span>+</span></button>';
  h += '<div class="card-acc-body">';
  h += '<div class="pros-label">Pros</div>';
  for (var p = 0; p < offer.pros.length; p++) {
    h += '<div class="pro-item"><span class="pro-icon">✓</span><span>' + offer.pros[p] + '</span></div>';
  }
  h += '<div style="margin:12px 0 0;"></div><div class="pros-label">Cons</div>';
  for (var c = 0; c < offer.cons.length; c++) {
    h += '<div class="con-item"><span class="con-icon">✕</span><span>' + offer.cons[c] + '</span></div>';
  }
  h += '</div></div>';
  h += '<div class="card-acc-item"><button class="card-acc-btn" onclick="toggleAcc(this)"><span>Why this match</span><span>+</span></button>';
  h += '<div class="card-acc-body">' + offer.why + '</div></div></div>';

  // CTA
  h += '<div class="cta-section"><div class="cta-inner">';
  h += '<div class="cta-preq-row"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8.5l2.5 2.5L12 5" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  h += '<span class="cta-preq-text">You\'re pre-qualified</span></div>';
  h += '<div class="cta-preq-sub">Complete your application to lock in this offer.</div>';

  h += '<div class="trust-signals">';
  h += '<div class="trust-item"><svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,0.5 8.9,4.7 13.5,5.2 10,8.3 10.9,13 7,10.7 3.1,13 4,8.3 0.5,5.2 5.1,4.7" fill="#00b67a"/></svg>';
  h += '<span style="font-size:11px;color:#374151;font-weight:600;">Trustpilot ' + offer.trustpilot + '</span>';
  h += '<span style="font-size:10px;color:#6b7280;">' + offer.reviews + ' reviews</span></div></div>';

  h += '<button class="cta-btn" onclick="alert(\'This would redirect to the lender application.\')">Apply Now</button>';
  h += '</div></div>';

  h += '</div>';
  return h;
}

// === GET OFFERS (mock data based on quiz answers) ===
function getOffers(amount) {
  return [
    {
      name: 'BlueVine',
      amount: amount,
      apr: '6.2% – 12.9%',
      term: '12–36 months',
      monthly: Math.round(amount * 0.035),
      score: 94,
      trustpilot: '4.7',
      reviews: '12,340',
      pros: ['Fast funding — as soon as same day', 'No prepayment penalties', 'Simple online application'],
      cons: ['Requires 2+ years in business', 'Minimum $120K annual revenue'],
      why: 'Based on your funding needs and business profile, BlueVine offers the best combination of competitive rates, fast funding, and flexible terms.',
      testimonial: { avatar: 'M', text: 'Got approved in 24 hours and funded the next day. The rates were better than my bank offered.', author: 'Mark T., Restaurant Owner' }
    },
    {
      name: 'Fundbox',
      amount: Math.round(amount * 0.8),
      apr: '8.9% – 18.5%',
      term: '12–24 months',
      monthly: Math.round(amount * 0.8 * 0.048),
      score: 87,
      trustpilot: '4.5',
      reviews: '8,920',
      pros: ['Low minimum requirements', 'Draw only what you need', 'Weekly repayment options'],
      cons: ['Slightly higher rates', 'Shorter max term'],
      why: 'Fundbox is a great fit if you want flexibility — draw funds as needed and only pay interest on what you use.',
      testimonial: { avatar: 'S', text: 'The flexibility to draw funds when I need them has been a game changer for managing cash flow.', author: 'Sarah K., E-commerce' }
    },
    {
      name: 'OnDeck',
      amount: Math.round(amount * 1.2),
      apr: '9.5% – 24.0%',
      term: '6–24 months',
      monthly: Math.round(amount * 1.2 * 0.055),
      score: 82,
      trustpilot: '4.3',
      reviews: '5,670',
      pros: ['Higher loan amounts available', 'Rewards for repeat borrowers', 'Dedicated account manager'],
      cons: ['Higher starting rates', 'Daily or weekly payments'],
      why: 'OnDeck can offer a higher amount than you requested, which gives you extra cushion. Great for businesses that may need more capital.',
      testimonial: { avatar: 'J', text: 'OnDeck gave me more than I asked for and the dedicated account manager made everything smooth.', author: 'James R., Contractor' }
    }
  ];
}

// === HELPER: Build FAQ item ===
function buildFaq(question, answer) {
  return '<div class="faq-item"><button class="faq-btn" onclick="toggleFaq(this)"><span>' + question + '</span><span>+</span></button><div class="faq-body">' + answer + '</div></div>';
}

// === TOGGLE FUNCTIONS ===
function toggleSolStrip(btn) {
  var body = btn.nextElementSibling;
  var chev = btn.querySelector('.sol-strip-chev');
  var open = body.style.display !== 'none' && body.style.display !== '';
  body.style.display = open ? 'none' : 'block';
  chev.textContent = open ? '▾' : '▴';
}

function toggleAcc(btn) {
  var body = btn.nextElementSibling;
  var arrow = btn.querySelector('span:last-child');
  var open = body.style.display !== 'none' && body.style.display !== '';
  body.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '+' : '\u2212';
}

function toggleSection(id, btn) {
  var el = document.getElementById(id);
  var arrow = btn.querySelector('.section-arrow');
  var open = el.style.display === 'none';
  el.style.display = open ? 'block' : 'none';
  arrow.textContent = open ? '\u25B2' : '\u25BC';
}

function toggleFaq(btn) {
  var body = btn.nextElementSibling;
  var arrow = btn.querySelector('span:last-child');
  var open = body.style.display !== 'none' && body.style.display !== '';
  body.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '+' : '\u2212';
}

// Init slider fill on load
document.addEventListener('DOMContentLoaded', function() {
  updateSlider(50000);
});
