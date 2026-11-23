/* Theatre original interactive code adapted to the N&S shared viewer. */
window.startTheatreOriginal=function(){

    // 2. The central viewer provides the curtain opening and music controls.
    document.getElementById('hero-scroll-btn')?.addEventListener('click',()=>document.getElementById('reveal-section')?.scrollIntoView({behavior:'smooth'}));

    // 3. INTERACTIVE 3-CIRCLE SCRATCH-OFF DATE REVEAL + CONFETTI
    // =========================================================================
    (function initScratchCoins() {
      const canvases = Array.from(document.querySelectorAll('.theatre-root .scratch-canvas'));
      const celebrationEl = document.getElementById('reveal-celebration');
      let revealedCount = 0;
      let allRevealed = false;

      function paintBurgundyFoil(ctx, w, h) {
        const grad = ctx.createRadialGradient(w * 0.32, h * 0.28, w * 0.05, w * 0.5, h * 0.5, w * 0.65);
        grad.addColorStop(0, '#a14b3c');
        grad.addColorStop(0.45, '#7c3024');
        grad.addColorStop(0.85, '#5C2018');
        grad.addColorStop(1, '#44150f');

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Diagonal subtle sheen
        ctx.globalAlpha = 0.14;
        ctx.strokeStyle = '#f5e6d8';
        for (let i = -h; i < w + h; i += 16) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + h * 0.7, h);
          ctx.lineWidth = 5;
          ctx.stroke();
        }

        // Fine gold/ivory shimmer specks
        ctx.globalAlpha = 0.35;
        for (let i = 0; i < 45; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#f4e3c9' : '#d5b282';
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.4 + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle inner ring border
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#f5e6d8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2 - 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      canvases.forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        let isDown = false;
        let done = false;
        let strokes = 0;

        paintBurgundyFoil(ctx, canvas.width, canvas.height);

        function getPos(clientX, clientY) {
          const rect = canvas.getBoundingClientRect();
          return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
          };
        }

        function scratch(x, y) {
          if (done) return;
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(x, y, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';

          strokes++;
          if (strokes % 6 === 0) checkProgress();
        }

        function checkProgress() {
          try {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let cleared = 0;
            let total = 0;
            for (let i = 3; i < data.length; i += 16) {
              total++;
              if (data[i] < 20) cleared++;
            }
            if (cleared / total > 0.38) finishCoin();
          } catch (err) {}
        }

        function finishCoin() {
          if (done) return;
          done = true;
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          revealedCount++;

          if (revealedCount === canvases.length && !allRevealed) {
            allRevealed = true;
            celebrationEl.classList.remove('opacity-0', 'translate-y-2');
            celebrationEl.classList.add('opacity-100', 'translate-y-0');
            launchConfetti();
          }
        }

        canvas.addEventListener('mousedown', (e) => {
          isDown = true;
          const p = getPos(e.clientX, e.clientY);
          scratch(p.x, p.y);
        });
        canvas.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          const p = getPos(e.clientX, e.clientY);
          scratch(p.x, p.y);
        });
        window.addEventListener('mouseup', () => { isDown = false; });

        canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          isDown = true;
          const t = e.touches[0];
          const p = getPos(t.clientX, t.clientY);
          scratch(p.x, p.y);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (!isDown) return;
          const t = e.touches[0];
          const p = getPos(t.clientX, t.clientY);
          scratch(p.x, p.y);
        }, { passive: false });

        canvas.addEventListener('touchend', () => { isDown = false; });
      });

      function launchConfetti() {
        const cc = document.getElementById('confetti-canvas');
        const cx = cc.getContext('2d');
        cc.width = window.innerWidth;
        cc.height = window.innerHeight;

        const palette = ['#5C2018', '#8c3b2f', '#c9a678', '#e8d5b7', '#FAF8F5', '#b57b65'];
        const pieces = Array.from({ length: 75 }, () => ({
          x: Math.random() * cc.width,
          y: -15 - Math.random() * 140,
          vy: Math.random() * 1.5 + 0.8,
          vx: (Math.random() - 0.5) * 1.1,
          w: Math.random() * 9 + 3,
          h: Math.random() * 4 + 1.5,
          rot: Math.random() * Math.PI * 2,
          rv: (Math.random() - 0.5) * 0.06,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.55 + 0.4,
          drift: Math.random() * Math.PI * 2,
        }));

        let frame = 0;
        const maxFrames = 260;

        (function draw() {
          cx.clearRect(0, 0, cc.width, cc.height);
          const fade = Math.max(0, 1 - frame / maxFrames);

          pieces.forEach((p) => {
            cx.save();
            cx.globalAlpha = p.alpha * fade;
            cx.translate(p.x, p.y);
            cx.rotate(p.rot);
            cx.fillStyle = p.color;
            cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            cx.restore();

            p.y += p.vy;
            p.x += p.vx + Math.sin(p.drift) * 0.45;
            p.rot += p.rv;
            p.drift += 0.02;
          });

          frame++;
          if (frame < maxFrames) requestAnimationFrame(draw);
          else cx.clearRect(0, 0, cc.width, cc.height);
        })();
      }
    })();

    // =========================================================================
    // 4. LIVE COUNTDOWN TIMER (September 10, 2027 · 16:00:00)
    // =========================================================================
    (function initCountdown() {
      const target = new Date(window.__THEATRE_DATE||"2027-09-10T16:00:00+02:00").getTime(); // Month 8 = September
      const dEl = document.getElementById('cd-days');
      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-min');
      const sEl = document.getElementById('cd-sec');

      function update() {
        const diff = Math.max(0, target - Date.now());
        dEl.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        hEl.textContent = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        mEl.textContent = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        sEl.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    })();

    // =========================================================================
    // 5. COPY IBAN BUTTON WITH TOAST NOTIFICATION
    // =========================================================================
    (function initCopyIban() {
      const copyBtn = document.getElementById('copy-iban-btn');
      const ibanVal = document.getElementById('iban-value');
      const toast = document.getElementById('copy-toast');
      let toastTimer = null;

      copyBtn.addEventListener('click', () => {
        if(copyBtn.disabled)return;
        const text = ibanVal.textContent.trim();
        const input = document.createElement('input');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(input);

        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
      });
    })();

    // =========================================================================
    // 6. INTERACTIVE RSVP FORM
    // =========================================================================
    (function initRsvpForm() {
      const form = document.getElementById('rsvp-form');
      const nameInput = document.getElementById('rsvp-name');
      const attendBtns = document.querySelectorAll('.theatre-root .attend-btn');
      const extraFields = document.getElementById('rsvp-extra-fields');
      const busCheckbox = document.getElementById('rsvp-bus');
      const submitBtn = document.getElementById('rsvp-submit-btn');
      const confirmation = document.getElementById('rsvp-confirmation');
      const summaryEl = document.getElementById('rsvp-summary');
      const editBtn = document.getElementById('rsvp-edit-btn');

      let attendance = null;

      function updateSubmitState() {
        const ready = nameInput.value.trim().length > 0 && attendance !== null;
        submitBtn.disabled = !ready;
      }

      nameInput.addEventListener('input', updateSubmitState);

      attendBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          attendance = btn.dataset.attend;

          attendBtns.forEach((b) => {
            const selected = b.dataset.attend === attendance;
            if (selected) {
              b.style.backgroundColor = 'rgb(92, 32, 24)';
              b.style.color = 'rgb(250, 248, 245)';
              b.style.borderColor = 'rgb(92, 32, 24)';
            } else {
              b.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
              b.style.color = 'rgb(92, 32, 24)';
              b.style.borderColor = 'rgba(92, 32, 24, 0.25)';
            }
          });

          if (attendance === 'yes') {
            extraFields.classList.remove('hidden');
          } else {
            extraFields.classList.add('hidden');
            busCheckbox.checked = false;
          }

          updateSubmitState();
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = nameInput.value.trim();
        if (!guestName || !attendance) return;

        const isDemo = window.__THEATRE_DEMO !== false;
        const formURL = window.__THEATRE_FORM || '';
        const phone = String(window.__THEATRE_WHATSAPP||'').replace(/\D/g,'');
        if(!isDemo && /^https:\/\//i.test(formURL)){window.open(formURL,'_blank','noopener');return;}
        if(!isDemo && phone.length>=10 && phone.length<=15){
          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent('RSVP · '+guestName+' · '+(attendance==='yes'?'Sí':'No')),'_blank','noopener');return;
        }
        summaryEl.textContent = isDemo
          ? 'Esta es una demo. Tu respuesta no se ha enviado ni guardado.'
          : 'Aún no se ha configurado el destino de las confirmaciones.';

        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
      });

      editBtn.addEventListener('click', () => {
        confirmation.classList.add('hidden');
        form.classList.remove('hidden');
      });
    })();

    // =========================================================================
    // 7. INTERSECTION OBSERVER SCROLL-REVEAL ANIMATIONS
    // =========================================================================
    (function initScrollReveal() {
      const elements = document.querySelectorAll('.theatre-root .reveal, .theatre-root .reveal-scale');
      if(!('IntersectionObserver' in window)){elements.forEach(el=>el.classList.add('is-visible'));return;}
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      elements.forEach((el) => observer.observe(el));
    })();
  
};
