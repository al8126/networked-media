window.addEventListener('load', function () {

  const audio = document.getElementById('audio');
  const btn = document.querySelector('.player__btn');

  if (audio && btn) {
    if (localStorage.getItem('musicPlaying') === 'true') {
      audio.play().catch(() => {
        document.addEventListener('click', function resume() {
          audio.play();
          btn.classList.add('playing');
          document.removeEventListener('click', resume);
        });
      });
      btn.classList.add('playing');
    }

    window.toggleMusic = function () {
      if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
        localStorage.setItem('musicPlaying', 'true');
      } else {
        audio.pause();
        btn.classList.remove('playing');
        localStorage.setItem('musicPlaying', 'false');
      }
    }
  }

  function initDroodle() {
    const img = document.getElementById('droodle');
    const hiddenImage = document.getElementById('hiddenImage');
    if (!img) return;

    fetch('/random')
      .then(res => res.text())
      .then(path => {
        img.src = path;
        if (hiddenImage) hiddenImage.value = path;
      })
      .catch(err => console.log('droodle fetch error:', err));
  }

  function flipTo(url) {
    const card = document.getElementById('cardFlip');
    const img = document.getElementById('droodleImg');
    const caption = document.getElementById('droodleCaption');

    if (!card || !img || !caption) return;

    card.classList.add('flipping');

    setTimeout(() => {
      fetch(url)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newImg = doc.getElementById('droodleImg');
          const newCaption = doc.getElementById('droodleCaption');
          const newBtns = doc.querySelector('.other__btns');

          if (newImg) img.src = newImg.src;
          if (newCaption) caption.textContent = newCaption.textContent.trim();
          if (newBtns) document.querySelector('.other__btns').innerHTML = newBtns.innerHTML;

          window.history.pushState({}, '', '/other');
          initFlipBtns();
        })
        .catch(err => console.log('fetch error:', err));
    }, 300);

    card.addEventListener('animationend', function () {
      card.classList.remove('flipping');
    }, { once: true });
  }

  function initFlipBtns() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    if (nextBtn) nextBtn.addEventListener('click', () => flipTo('/other/next'));
    if (prevBtn) prevBtn.addEventListener('click', () => flipTo('/other/prev'));
  }

  function initFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
      const form = fileInput.closest('form');
      if (!form) return;

      const formData = new FormData(form);

      fetch('/makeSubmit', {
        method: 'POST',
        body: formData
      })
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newContent = doc.querySelector('.page');
          const currentPage = document.querySelector('.page');
          if (newContent && currentPage) {
            currentPage.innerHTML = newContent.innerHTML;
            window.history.pushState({}, '', '/recorded');
          }
        })
        .catch(err => console.log('fetch error:', err));
    });
  }

  initDroodle();
  initFlipBtns();
  setTimeout(() => initFileUpload(), 50);

  function loadPage(url) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.page');
        const currentPage = document.querySelector('.page');
        if (newContent && currentPage) {
          currentPage.innerHTML = newContent.innerHTML;
          window.history.pushState({}, '', url);
          initDroodle();
          initFlipBtns();
          setTimeout(() => initFileUpload(), 50);
        }
      })
      .catch(err => console.log('fetch error:', err));
  }

  document.addEventListener('submit', function (e) {
    const form = e.target.closest('form');
    if (!form) return;
    if (form.enctype === 'multipart/form-data') return;
    e.preventDefault();

    const url = form.action;
    const body = new URLSearchParams(new FormData(form)).toString();

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.page');
        const currentPage = document.querySelector('.page');
        if (newContent && currentPage) {
          currentPage.innerHTML = newContent.innerHTML;
          window.history.pushState({}, '', '/recorded');
        }
      })
      .catch(err => console.log('fetch error:', err));
  });

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
    if (link.hostname !== window.location.hostname) return;
    e.preventDefault();
    loadPage(link.href);
  });

  window.addEventListener('popstate', function () {
    loadPage(window.location.href);
  });

});