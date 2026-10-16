const app = document.getElementById('app');
const stepLabel = document.getElementById('step-label');
const folderImage = './assets/folder.png';
let scanTimeout = null;
let currentScreen = 'home';

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
  document.title = `ORIGIN / ${screen === 'home' ? '2067' : screen === 'results' ? 'Archive scan' : 'Certificate'}`;
  app.focus({preventScroll:true});
  window.scrollTo({top:0, behavior:'instant'});
}

function heroHTML() {
  return `
    <section class="hero-view" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">FILE NO. 001 <span class="small-arrow">↗</span> ORIGINALITY CHECK</p>
        <h1 class="display" id="hero-title">FIND THE<br>ORIGINAL<span class="stop">.</span></h1>
        <p class="description">One file. Countless copies.<br>Which one came first?</p>
        <button type="button" class="action-button" data-go="scan"><span>VERIFY THIS FILE</span><span aria-hidden="true">↗</span></button>
      </div>
      <div class="hero-artwork">
        <div class="art-mat">
          <div class="art-index"><span>FIG. 01</span><span>FOLDER_001.PNG</span></div>
          <img src="${folderImage}" class="main-folder" alt="Hand-drawn yellow folder representing a sample digital file">
          <div class="mat-bottom"><span>SELECTED FILE</span><span class="pixel-square" aria-hidden="true">■ ■ ■</span></div>
        </div>
        <div class="art-tag">ORIGIN SAMPLE ARCHIVE <span>2067 ©</span></div>
      </div>
    </section>`;
}

function showHome() {
  clearScan();
  setScreen('home', heroHTML(), '01 / 03');
}

function galleryHTML(scanning) {
  const folders = Array.from({length:9}, (_,i) => {
    return `<div class="copy-item" style="--i:${i}" aria-label="Identical copy ${i+1}">
      <img src="${folderImage}" alt="" loading="eager">
      <span>FILE_${String(i+1).padStart(4,'0')}</span>
    </div>`;
  }).join('');
  return `<div class="copy-gallery ${scanning?'is-scanning':''}" aria-label="Nine visual examples of matching file copies">${folders}</div>`;
}

function reportHTML(scanning) {
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
          <h1 class="report-title" id="report-title">${scanning?'CHECKING<br>RECORDS.':'IDENTICAL<br>COPIES FOUND.'}</h1>
          <p class="report-count ${scanning?'is-waiting':''}">${scanning?'···':'2,486'}</p>
          <p class="mini-description">${scanning?'Comparing registered files':'EXACT MATCHES IN THE ARCHIVE'}</p>
          ${scanning ? `<div class="loading-indicator" role="status">Scanning<span> ...</span></div>` : `
            <div class="report-data">
              <div class="data-row"><span class="data-label">FILE</span><span class="data-value">FOLDER_001.PNG</span></div>
              <div class="data-row"><span class="data-label">FIRST CREATOR</span><span class="data-value uncertain">UNKNOWN</span></div>
              <div class="data-row"><span class="data-label">REGISTRATION</span><span class="data-value">AVAILABLE</span></div>
            </div>
            <button class="action-button" type="button" data-go="certificate"><span>CLAIM ORIGINAL STATUS</span><span aria-hidden="true">↗</span></button>`}
        </div>
      </div>
    </section>`;
}

function beginScan() {
  clearScan();
  setScreen('results', reportHTML(true), '02 / 03');
  scanTimeout = window.setTimeout(() => {
    if (currentScreen === 'results') {
      setScreen('results', reportHTML(false), '02 / 03');
    }
    scanTimeout = null;
  }, 1950);
}

function certificateHTML(revealed) {
  return `
    <section class="certificate-view" aria-labelledby="certificate-title">
      <div class="certificate-topline">
        <span class="section-num">03 / CERTIFICATE ISSUED</span>
        <span class="side-label">REG. 2067-00491</span>
      </div>
      <div class="certificate-layout">
        <article class="certificate-paper ${revealed?'revealed':''}" aria-label="Fictional certificate">
          <div class="certificate-id"><span>ORIGIN / 2067</span><span>CERTIFICATE 00491</span></div>
          <h1 class="certificate-big" id="certificate-title">${revealed?'REGISTERED.':'ORIGINAL.'}</h1>
          <p class="certificate-sub">${revealed?'Status assigned by the ORIGIN registry.':'This file holds an official original record.'}</p>
          <div class="certificate-lower">
            <img class="certificate-icon" src="${folderImage}" alt="Yellow folder used for the registered file">
            <div class="certificate-facts">
              <span>FOLDER_001.PNG</span>
              <strong>${revealed?'AUTHORSHIP: UNKNOWN':'STATUS: ORIGINAL'}</strong>
              <span>REG. 2067-00491</span>
            </div>
          </div>
        </article>
        <div class="reveal-side">
          ${revealed ? `
            <p class="micro-label">CERTIFICATE / DETAILS</p>
            <h2 class="reveal-title">CREATOR<br>UNKNOWN.</h2>
            <div class="reveal-message" role="status">
              <strong>REGISTRATION ACCEPTED.</strong>
              <p>ORIGIN recorded the claim. The original creator remains unknown.</p>
              <p>Who decides what makes an original?</p>
            </div>
            <button class="action-button outline" type="button" data-go="home"><span>START AGAIN</span><span aria-hidden="true">↗</span></button>
          ` : `
            <p class="micro-label">REGISTRATION / APPROVED</p>
            <h2 class="reveal-title">OFFICIALLY<br>ORIGINAL.</h2>
            <p class="reveal-text">Your file has received original status. Inspect the certificate details.</p>
            <button class="action-button" type="button" data-go="reveal"><span>INSPECT THE CERTIFICATE</span><span aria-hidden="true">↗</span></button>
          `}
        </div>
      </div>
    </section>`;
}

function showCertificate(reveal = false) {
  clearScan();
  setScreen('certificate', certificateHTML(reveal), '03 / 03');
}

// Event delegation keeps every interactive control working after a screen changes.
document.addEventListener('click', (event) => {
  const control = event.target.closest('button[data-go]');
  if (!control) return;
  switch (control.dataset.go) {
    case 'home': showHome(); break;
    case 'scan': beginScan(); break;
    case 'certificate': showCertificate(); break;
    case 'reveal': showCertificate(true); break;
  }
});
