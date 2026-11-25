/* User supplied interactive logic (intro now shared with viewer). */
window.startNacarOriginal=function(){

    // =========================================================================
    // 1. LIVE COUNTDOWN TIMER (May 20, 2027 16:30:00)
    // =========================================================================
    (function initCountdown() {
      const targetDate = new Date(window.__NACAR_DATE||"2027-05-20T16:30:00+02:00").getTime(); // Month 4 = May
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-minutes');
      const secsEl = document.getElementById('cd-seconds');

      function tick() {
        const now = Date.now();
        const diff = Math.max(0, targetDate - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
      }

      tick();
      setInterval(tick, 1000);
    })();

    // =========================================================================
    // 2. INTERACTIVE SCRATCH-OFF COUPLE PHOTO CANVAS
    // =========================================================================
    (function initScratchOff() {
      const container = document.getElementById('scratch-container');
      const canvas = document.getElementById('scratch-canvas');
      if (!container || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const prompt = document.createElement('span');
      prompt.hidden = true;
      prompt.textContent = 'Raspa\npara revelar';
      container.append(prompt);

      let isDrawing = false;
      let isRevealed = false;
      let strokeCount = 0;

      function paintCover() {
        const rect = container.getBoundingClientRect();
        const w = Math.max(200, Math.round(rect.width));
        const h = Math.max(260, Math.round(rect.height));

        canvas.width = w;
        canvas.height = h;

        // Pearlescent champagne/gold radial gradient
        const grad = ctx.createRadialGradient(w * 0.35, h * 0.28, w * 0.08, w * 0.5, h * 0.5, h * 0.72);
        grad.addColorStop(0, '#f7f1e3');
        grad.addColorStop(0.45, '#e2cfad');
        grad.addColorStop(0.8, '#cbb486');
        grad.addColorStop(1, '#b69b67');

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Subtle pearlescent shimmer speckles
        for (let i = 0; i < 160; i++) {
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(143,116,61,0.12)';
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8 + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle "Scratch to reveal" prompt
        ctx.fillStyle = 'rgba(60, 75, 93, 0.78)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = Math.max(12, Math.round(w * 0.085));
        ctx.font = `500 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
        if (prompt.style.display === 'none' || prompt.hasAttribute('data-atelier-hidden')) return;
        const lines = prompt.textContent.trim().split(/\r?\n/).filter(line=>line.trim());
        lines.forEach((line,index)=>{
          const y = h / 2 + (index - (lines.length - 1) / 2) * fontSize * 1.2;
          ctx.fillText(line, w / 2, y, w * 0.75);
        });
      }

      function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: ((clientX - rect.left) / rect.width) * canvas.width,
          y: ((clientY - rect.top) / rect.height) * canvas.height,
        };
      }

      function scratchAt(x, y) {
        if (isRevealed) return;
        ctx.globalCompositeOperation = 'destination-out';
        const radius = Math.max(18, canvas.width * 0.11);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        strokeCount++;
        if (strokeCount % 12 === 0) {
          checkRevealThreshold();
        }
      }

      function checkRevealThreshold() {
        try {
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let cleared = 0;
          const total = data.length / 4;
          for (let i = 3; i < data.length; i += 16) {
            if (data[i] === 0) cleared++;
          }
          if (cleared / (total / 4) > 0.45) {
            isRevealed = true;
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
          }
        } catch (err) {
          // Ignore any canvas readback errors
        }
      }

      canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getCoords(e);
        scratchAt(pos.x, pos.y);
      });

      window.addEventListener('mouseup', () => {
        isDrawing = false;
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getCoords(e);
        scratchAt(pos.x, pos.y);
      });

      canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const pos = getCoords(e);
        scratchAt(pos.x, pos.y);
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        const pos = getCoords(e);
        scratchAt(pos.x, pos.y);
      }, { passive: true });

      canvas.addEventListener('touchend', () => {
        isDrawing = false;
      });

      prompt.addEventListener('atelier-text-update',()=>{
        if (strokeCount === 0) requestAnimationFrame(paintCover);
      });
      requestAnimationFrame(paintCover);
    })();

    // =========================================================================
    // 3. REGISTRY MODAL & COPY IBAN
    // =========================================================================
    (function initRegistryModal() {
      const modal = document.getElementById('registry-modal');
      const openBtn = document.getElementById('open-registry-btn');
      const closeBtn = document.getElementById('close-registry-btn');
      const copyBtn = document.getElementById('copy-iban-btn');
      const ibanText = document.getElementById('iban-value');
      const statusEl = document.getElementById('copy-status');

      function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }

      function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        statusEl.textContent = '';
      }

      openBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      copyBtn.addEventListener('click', () => {
        const text = ibanText.textContent.trim();
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand('copy');
          statusEl.textContent = 'IBAN copied to clipboard.';
        } catch (err) {
          statusEl.textContent = 'Please copy the IBAN manually.';
        }
        document.body.removeChild(input);
        setTimeout(() => { statusEl.textContent = ''; }, 2800);
      });
    })();

    // =========================================================================
    // 4. INTERACTIVE RSVP ENVELOPE & INLINE FORM
    // =========================================================================
    (function initRsvpEnvelope() {
      const envBtn = document.getElementById('rsvp-envelope-btn');
      const closedImg = document.getElementById('rsvp-env-closed');
      const openImg = document.getElementById('rsvp-env-open');
      const tapLabel = document.getElementById('rsvp-tap-label');
      const formWrapper = document.getElementById('rsvp-form-wrapper');
      const rsvpForm = document.getElementById('rsvp-form');
      const confirmation = document.getElementById('rsvp-confirmation');

      let opened = false;

      envBtn.addEventListener('click', () => {
        if (opened) return;
        opened = true;
        envBtn.setAttribute('aria-expanded', 'true');
        envBtn.disabled = true;

        closedImg.classList.remove('opacity-100');
        closedImg.classList.add('opacity-0');
        openImg.classList.remove('opacity-0');
        openImg.classList.add('opacity-100');
        tapLabel.classList.add('opacity-0');

        setTimeout(() => {
          formWrapper.classList.add('is-open');
          formWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 320);
      });

      rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const preview = window.__NACAR_DEMO !== false;
        const formUrl = window.__NACAR_RSVP_FORM || '';
        const whatsapp = String(window.__NACAR_WHATSAPP || '').replace(/\D/g,'');
        if (!preview && /^https:\/\//.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }
        if (!preview && whatsapp.length >= 10) {
          const name = document.getElementById('rsvp-name')?.value || '';
          const yes = !!rsvpForm.querySelector('input[name="attending"]:checked[value="yes"]');
          window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent('RSVP - '+name+' - '+(yes?'Accepts':'Declines')),'_blank','noopener'); return;
        }
        rsvpForm.classList.add('hidden');
        confirmation.classList.remove('hidden');
        const notice=confirmation.querySelector('p:nth-child(2)');
        if(notice) notice.textContent='This is a demo. No RSVP was sent or recorded.';
      });
    })();

    // =========================================================================
    // 5. FLOATING AUDIO BUTTON (Web Audio API Ambient Piano/Harp)
    // =========================================================================
    (function initAmbientAudio() {
      const btn = document.getElementById('audio-toggle-btn');
      const iconMuted = document.getElementById('icon-muted');
      const iconPlaying = document.getElementById('icon-playing');

      let audioCtx = null;
      let isPlaying = false;
      let timer = null;
      let step = 0;

      // Gentle romantic arpeggio in D Major / B minor
      const melody = [
        293.66, 369.99, 440.00, 587.33,
        246.94, 293.66, 369.99, 440.00,
        196.00, 293.66, 369.99, 493.88,
        220.00, 329.63, 440.00, 554.37,
      ];

      function playTone(freq) {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      }

      function toggleAudio() {
        if (!isPlaying) {
          startAudio();
        } else {
          stopAudio();
        }
      }

      function startAudio() {
        if (isPlaying) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        isPlaying = true;
        iconMuted.classList.add('hidden');
        iconPlaying.classList.remove('hidden');

        playTone(melody[step % melody.length]);
        step++;
        timer = setInterval(() => {
          playTone(melody[step % melody.length]);
          step++;
        }, 720);
      }

      function stopAudio() {
        if (!isPlaying) return;
        isPlaying = false;
        clearInterval(timer);
        iconPlaying.classList.add('hidden');
        iconMuted.classList.remove('hidden');
      }

      btn.addEventListener('click', toggleAudio);
      window.__startWeddingAudio = startAudio;
    })();

    // =========================================================================
    // Aparición gradual de las secciones al entrar en pantalla.
    (function initScrollReveal() {
      const root = document.querySelector('.nacar-root');
      if (!root || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const items = root.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      root.classList.add('nacar-reveal-ready');
      items.forEach((el) => observer.observe(el));
    })();
  
};
