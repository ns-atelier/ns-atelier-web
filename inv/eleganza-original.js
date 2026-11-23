/* Eleganza original interactive code adapted to the public viewer. */
window.startEleganzaOriginal=function(){

    // =========================================================================
    // 1. WEB AUDIO API ROMANTIC CHORD PAD
    // =========================================================================
    (function initAmbientPad() {
      const toggleBtn = document.getElementById('audio-toggle-btn');
      const iconMuted = document.getElementById('icon-muted');
      const iconPlaying = document.getElementById('icon-playing');

      let ctx = null;
      let masterGain = null;
      let isPlaying = false;
      let chordInterval = null;
      let chordIndex = 0;

      // Warm romantic progression: Fmaj7 -> Dm7 -> Bbmaj7 -> C6
      const chords = [
        [174.61, 220.00, 261.63, 329.63],
        [146.83, 220.00, 261.63, 349.23],
        [116.54, 174.61, 220.00, 293.66],
        [130.81, 196.00, 220.00, 329.63],
      ];

      function playChord(frequencies) {
        if (!ctx || !masterGain || !isPlaying) return;
        const now = ctx.currentTime;
        const duration = 5.2;

        frequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, now);

          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.linearRampToValueAtTime(0.025, now + 1.4);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + duration + 0.1);
        });
      }

      function startAudio() {
        if (isPlaying) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!ctx) {
            ctx = new AudioCtx();
            masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.9, ctx.currentTime);
            masterGain.connect(ctx.destination);
          }
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          isPlaying = true;
          iconMuted.classList.add('hidden');
          iconPlaying.classList.remove('hidden');

          playChord(chords[chordIndex % chords.length]);
          chordIndex++;

          chordInterval = setInterval(() => {
            playChord(chords[chordIndex % chords.length]);
            chordIndex++;
          }, 4200);
        } catch (err) {
          // Gracefully ignore if audio context is unavailable
        }
      }

      function stopAudio() {
        if (!isPlaying) return;
        isPlaying = false;
        clearInterval(chordInterval);
        iconPlaying.classList.add('hidden');
        iconMuted.classList.remove('hidden');
      }

      toggleBtn.addEventListener('click', () => {
        if (isPlaying) {
          stopAudio();
        } else {
          startAudio();
        }
      });

      window.__startEleganzaAudio = startAudio;
    })();

    // =========================================================================
    // 3. LIVE COUNTDOWN TIMER (September 12, 2027 at 17:00:00)
    // =========================================================================
    (function initCountdown() {
      const target = new Date(window.__ELE_DATE||"2027-09-12T17:00:00+02:00").getTime(); // Month 8 = September
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-minutes');
      const secsEl = document.getElementById('cd-seconds');

      function update() {
        const diff = Math.max(0, target - Date.now());

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    })();

    // =========================================================================
    // 4. COPY IBAN WITH TOAST CONFIRMATION
    // =========================================================================
    (function initCopyIban() {
      const btn = document.getElementById('copy-iban-btn');
      const ibanText = document.getElementById('iban-text');
      const toast = document.getElementById('copy-toast');
      let toastTimer = null;

      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const value = ibanText.textContent.trim();
        const tempInput = document.createElement('input');
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
        } catch (err) {}
        document.body.removeChild(tempInput);

        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      });
    })();

    // =========================================================================
    // 5. INTERACTIVE RSVP FORM INSIDE FRAME
    // =========================================================================
    (function initRsvpForm() {
      const form = document.getElementById('rsvp-form');
      const nameInput = document.getElementById('rsvp-name');
      const attendBtns = document.querySelectorAll('.attend-btn');
      const confirmation = document.getElementById('rsvp-confirmation');
      const confirmName = document.getElementById('confirm-guest-name');
      const confirmNote = document.getElementById('confirm-guest-note');

      let attendance = 'yes';

      attendBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          attendance = btn.dataset.attend;
          attendBtns.forEach((b) => {
            const isSelected = b.dataset.attend === attendance;
            b.setAttribute('aria-pressed', String(isSelected));
            const indicator = b.querySelector('.attend-check');
            if (indicator) {
              indicator.style.opacity = isSelected ? '1' : '0';
            }
          });
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = nameInput.value.trim() || 'Dear Guest';
        confirmName.textContent = guestName;
        confirmNote.textContent =
          attendance === 'yes'
            ? 'We cannot wait to celebrate with you at Villa Cipressi!'
            : 'We will miss you dearly and appreciate you letting us know.';

        const preview = window.__ELE_DEMO !== false;
        const formUrl = window.__ELE_RSVP_FORM || '';
        const phone = String(window.__ELE_WHATSAPP || '').replace(/\D/g,'');
        if (!preview && /^https:\/\//i.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }
        if (!preview && phone.length >= 10) {
          const msg = 'RSVP · '+guestName+' · '+(attendance==='yes'?'Asistiré':'No podré asistir');
          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');
          return;
        }
        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
        const note=confirmation.querySelector('p.font-body');
        if(note)note.textContent= preview
          ? 'Esta es una demostración. No se ha enviado ninguna confirmación.'
          : 'La confirmación todavía no está configurada para esta invitación.';
        confirmation.classList.add('flex');
      });
    })();

    // =========================================================================
    // 6. INTERSECTION OBSERVER SCROLL-REVEAL ANIMATIONS
    // =========================================================================
    (function initScrollReveal() {
      const elements = document.querySelectorAll('.eleganza-root .reveal');
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

      elements.forEach((el) => observer.observe(el));
    })();
  
};
