// ORIGIN / 2067
// A fictional, browser-only registry. All counts, identifiers and policies are invented.
const app = document.getElementById('app');
const stepLabel = document.getElementById('step-label');
const folderImage = './assets/folder.png';

let scanTimeout = null;
let currentScreen = 'home';
let previousFocus = null;

function clearScan() {
  if (scanTimeout !== null) {
    window.clearTimeout(scanTimeout);
    scanTimeout = null;
  }
}

function setScreen(screen, html, step) {
  currentScreen = screen;
  app.innerHTML = html;
  stepLabel.textContent = step;
  document.title = `ORIGIN / 2067 / ${screen === 'home' ? 'Home' : screen === 'results' ? 'Archive scan' : screen === 'declined' ? 'Unregistered' : 'Certificate'}`;
  app.focus({preventScroll:true});
  window.scrollTo({top:0, behavior:'auto'});
}

function heroHTML() {
  return `
    <section class="hero-view" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">FILE NO. 001 <span class="small-arrow">/</span> ORIGINALITY CHECK</p>
        <h1 class="display" id="hero-title">FIND THE<br>ORIGINAL<span class="stop">.</span></h1>
        <p class="description">In 2067, originals receive official recognition through ORIGIN.<br>Which copy gets recognised?</p>
        <button type="button" class="action-button" data-go="scan"><span>VERIFY THIS FILE</span><span aria-hidden="true">&gt;</span></button>
      </div>
      <div class="hero-artwork">
        <div class="art-mat">
          <div class="art-index"><span>SELECTED FILE</span><span>FOLDER_001.PNG</span></div>
          <img src="${folderImage}" class="main-folder" alt="Yellow folder illustration representing the sample digital file">
          <div class="mat-bottom"><span>FILE / 001</span><span class="pixel-square" aria-hidden="true">■ ■ ■</span></div>
        </div>
        <div class="art-tag">ORIGIN SAMPLE ARCHIVE <span>2067</span></div>
      </div>
    </section>`;
}

function showHome() {
  clearScan();
  setScreen('home', heroHTML(), '01 / 03');
}

function galleryHTML(scanning) {
  const folders = Array.from({length:9}, (_,i) => `
    <div class="copy-item" style="--i:${i}" aria-label="Matching file ${i+1}">
      <img src="${folderImage}" alt="" loading="eager">
      <span>FILE_${String(i+1).padStart(4,'0')}</span>
    </div>`).join('');
  return `<div class="copy-gallery ${scanning?'is-scanning':''}" aria-label="Nine examples from the fictional matching-file archive">${folders}</div>`;
}

function reportHTML(scanning = false, confirming = false) {
  let controls;
  if (scanning) {
    controls = `<div class="loading-indicator" role="status">Scanning<span> ...</span></div>`;
  } else {
    const decision = confirming ? `
      <div class="claim-confirm" id="claim-confirm" role="group" aria-labelledby="confirm-title">
        <p class="micro-label" id="confirm-title">CONFIRM YOUR CLAIM</p>
        <p class="confirm-main">CREATOR UNKNOWN.</p>
        <p>Your file will be credited as the original in this archive. Claim this status?</p>
        <button class="action-button" type="button" data-go="accept"><span>YES, CLAIM ORIGINAL</span><span aria-hidden="true">&gt;</span></button>
        <button class="text-action" type="button" data-go="decline">LEAVE UNREGISTERED</button>
        <button class="text-action muted-action" type="button" data-go="cancel-confirm">RETURN TO RESULTS</button>
      </div>` : `
      <button class="action-button" type="button" data-go="confirm"><span>CLAIM ORIGINAL STATUS</span><span aria-hidden="true">&gt;</span></button>`;
    controls = `
      <div class="report-data">
        <div class="data-row"><span class="data-label">FILE</span><span class="data-value">FOLDER_001.PNG</span></div>
        <div class="data-row"><span class="data-label">FIRST CREATOR</span><span class="data-value uncertain">UNKNOWN</span></div>
        <div class="data-row"><span class="data-label">REGISTRATION</span><span class="data-value">AVAILABLE</span></div>
      </div>
      <div class="registry-rule">
        <span class="rule-label"></span>
        <p>The first accepted claim receives official original status on the ORIGIN website.</p>
      </div>
      ${decision}`;
  }
  return `
    <section class="scan-view" aria-labelledby="report-title">
      <div class="view-topline">
        <span class="section-num">02 / ARCHIVE SCAN</span>
        <span class="side-label">FOLDER_001.PNG</span>
      </div>
      <div class="scan-grid">
        ${galleryHTML(scanning)}
        <div class="report-panel" aria-live="polite">
          <p class="micro-label">${scanning ? 'SEARCHING THE ARCHIVE' : 'SCAN COMPLETE'}</p>
          <h1 class="report-title" id="report-title">${scanning ? 'CHECKING<br>RECORDS.' : 'IDENTICAL<br>COPIES FOUND.'}</h1>
          <p class="report-count ${scanning ? 'is-waiting' : ''}">${scanning ? '···' : '2,586'}</p>
          <p class="mini-description">${scanning ? 'COMPARING ARCHIVED RECORDS' : 'EXACT MATCHES OF THIS FILE FOUND'}</p>
          ${controls}
        </div>
      </div>
    </section>`;
}

function beginScan() {
  clearScan();
  setScreen('results', reportHTML(true), '02 / 03');
  scanTimeout = window.setTimeout(() => {
    scanTimeout = null;
    if (currentScreen === 'results') {
      setScreen('results', reportHTML(false), '02 / 03');
    }
  }, 1950);
}

function showConfirm() {
  clearScan();
  // Reveal the choice within the existing results screen.
  const y = window.scrollY;
  currentScreen = 'results';
  app.innerHTML = reportHTML(false, true);
  window.scrollTo(0, y);
  const firstChoice = app.querySelector('[data-go="accept"]');
  if (firstChoice) firstChoice.focus({preventScroll:true});
}

function cancelConfirm() {
  app.innerHTML = reportHTML(false, false);
  const button = app.querySelector('[data-go="confirm"]');
  if (button) button.focus({preventScroll:true});
}

function certificateHTML(revealed) {
  return `
    <section class="certificate-view" aria-labelledby="certificate-title">
      <div class="certificate-topline">
        <span class="section-num">03 / CERTIFICATE ISSUED</span>
        <span class="side-label">REG. 2067-00491</span>
      </div>
      <div class="certificate-layout">
        <article class="certificate-paper ${revealed ? 'revealed' : ''}" aria-label="Fictional certificate of registration">
          <div class="certificate-id"><span>ORIGIN OFFICIALLY AUTHENICATED</span><span>CERTIFICATE 0041</span></div>
          <h1 class="certificate-big" id="certificate-title">${revealed ? 'REGISTERED.' : 'ORIGINAL.'}</h1>
          <p class="certificate-sub">${revealed ? 'First accepted claim: confirmed.' : 'Official original status recorded.'}</p>
          <div class="certificate-lower">
            <img class="certificate-icon" src="${folderImage}" alt="Registered yellow folder illustration">
            <div class="certificate-facts">
              <span>FOLDER_001.PNG</span>
              <strong>${revealed ? 'FIRST CREATOR: UNKNOWN' : 'STATUS: ORIGINAL'}</strong>
              <span>REG. 2067-00491</span>
            </div>
          </div>
        </article>
        <div class="reveal-side">
          ${revealed ? `
            <p class="micro-label">CERTIFICATE / EVIDENCE</p>
            <h2 class="reveal-title">CREATOR<br>UNKNOWN.</h2>
            <div class="reveal-message" role="status">
              <strong>CLAIM VERIFIED.</strong>
              <p>ORIGIN has confirmed the registration and your file is officially known as the original. Authorship remains unknown.</p>
              <div class="evidence-row"><span>FIRST REGISTERED</span><b>VERIFIED</b></div>
              <div class="evidence-row"><span>FIRST CREATED</span><b>UNKNOWN</b></div>
              <p class="ending-question">If the registry chooses the original, who holds the power over creativity?</p>
            </div>
            <button class="action-button outline" type="button" data-go="home"><span>START AGAIN</span><span aria-hidden="true">&gt;</span></button>
          ` : `
            <p class="micro-label">REGISTRATION APPROVED</p>
            <h2 class="reveal-title">OFFICIALLY<br>ORIGINAL.</h2>
            <p class="reveal-text">Your file now receives original credit in the ORIGIN archive.</p>
            <button class="action-button" type="button" data-go="reveal"><span>INSPECT THE EVIDENCE</span><span aria-hidden="true">&gt;</span></button>
          `}
        </div>
      </div>
    </section>`;
}

function showCertificate(revealed = false) {
  clearScan();
  setScreen('certificate', certificateHTML(revealed), '03 / 03');
}

function declinedHTML() {
  return `
    <section class="certificate-view" aria-labelledby="declined-title">
      <div class="certificate-topline"><span class="section-num">03 / CLAIM DECLINED</span><span class="side-label">FILE 001 / UNREGISTERED</span></div>
      <div class="certificate-layout">
        <article class="certificate-paper unregistered" aria-label="File remains unregistered">
          <div class="certificate-id"><span>ORIGIN / 2067</span><span>REGISTRATION RECORD</span></div>
          <h1 class="certificate-big" id="declined-title">UNCLAIMED.</h1>
          <p class="certificate-sub">No original status assigned to this file.</p>
          <div class="certificate-lower">
            <img class="certificate-icon" src="${folderImage}" alt="Unregistered yellow folder illustration">
            <div class="certificate-facts"><span>FOLDER_001.PNG</span><strong>FIRST CREATOR: UNKNOWN</strong><span>STATUS: UNREGISTERED</span></div>
          </div>
        </article>
        <div class="reveal-side">
          <p class="micro-label">ORIGIN / ARCHIVE POLICY</p>
          <h2 class="reveal-title">NO CLAIM<br>RECORDED.</h2>
          <p class="reveal-text">Another person can register an identical copy and receive official original status.</p>
          <p class="ending-question">Who should receive credit when the creator remains unknown?</p>
          <button class="action-button outline" type="button" data-go="home"><span>START AGAIN</span><span aria-hidden="true">&gt;</span></button>
        </div>
      </div>
    </section>`;
}

function showDeclined() {
  clearScan();
  setScreen('declined', declinedHTML(), '03 / 03');
}

// One delegated handler works for buttons created after each page change.
document.addEventListener('click', event => {
  const control = event.target.closest('button[data-go]');
  if (!control) return;
  switch (control.dataset.go) {
    case 'home': showHome(); break;
    case 'scan': beginScan(); break;
    case 'confirm': showConfirm(); break;
    case 'cancel-confirm': cancelConfirm(); break;
    case 'accept': showCertificate(false); break;
    case 'decline': showDeclined(); break;
    case 'reveal': showCertificate(true); break;
  }
});
