/* Theatre original interactive code adapted to the N&S shared viewer. */
window.startTheatreOriginal=function(){

    // =========================================================================
    // 1. BILINGUAL DICTIONARY (EN / IT) & LIVE SWITCHER
    // =========================================================================
    const I18N = {
      en: {
        tap_to_open: 'Tap to open',
        skip: 'Skip',
        hero_cordially: 'You are cordially invited to celebrate the wedding of',
        hero_message: 'We would like to invite you to celebrate with us the most special day of our lives. It would be an honor to have you present at this important moment.',
        scroll_label: 'Scroll',
        reveal_title: 'Reveal',
        reveal_sub: 'Scratch to discover the date',
        coin_month: 'Sept',
        reveal_done: 'Save the date!',
        countdown_title: 'Countdown',
        cd_days: 'Days',
        cd_hours: 'Hours',
        cd_min: 'Min',
        cd_sec: 'Sec',
        countdown_sub: 'until the big day',
        venue_intro: 'The celebration will take place at',
        venue_city: 'Artimino, Florence',
        venue_date: 'September 10, 2027',
        venue_reception: 'Reception to Follow',
        view_map: 'View on Map',
        dress_title: 'Dress Code',
        dress_desc: 'We invite you to dress elegantly and formally to celebrate this special day with us.',
        dress_attire: 'Formal Attire',
        dress_note: 'Please avoid wearing white',
        gifts_eyebrow: 'Wedding registry',
        gifts_title: 'Gifts',
        gifts_desc: 'Your presence is the best gift we could receive. However, if you wish to contribute to our new life together, you can do so via bank transfer.',
        gifts_love: 'With all our love',
        bank_title: 'Bank details',
        bank_holder_label: 'ACCOUNT HOLDER:',
        bank_ref_label: 'REFERENCE:',
        copy_iban: 'Copy IBAN',
        iban_copied: 'IBAN copied to clipboard',
        transport_eyebrow: 'How to get there',
        transport_title: 'Transport',
        transport_desc: 'We have organized buses from the center of Florence to the villa so you can enjoy the celebration without worries.',
        bus_dep_label: 'Bus departure',
        bus_ret_label: 'Return to Florence',
        transport_note: 'Please indicate in your RSVP if you need transport',
        rsvp_badge: 'This form is fully customizable to your needs',
        rsvp_title: 'Confirm your attendance',
        rsvp_name_label: 'Full Name *',
        rsvp_name_ph: 'Your name',
        rsvp_email_label: 'Email (optional)',
        rsvp_attend_label: 'Will you attend? *',
        rsvp_yes: "Yes, I'll be there!",
        rsvp_no: "No, I can't make it",
        rsvp_bus_label: 'I need bus transport from Florence (16:00h)',
        rsvp_diet_label: 'Allergies / Dietary needs (optional)',
        rsvp_diet_ph: 'Vegetarian, gluten-free, allergies...',
        rsvp_msg_label: 'Message for the couple (optional)',
        rsvp_msg_ph: 'Write us a few words...',
        rsvp_confirm: 'Confirm',
        confirm_thanks: 'Thank You!',
        edit_rsvp: 'Edit response',
        thanks_title: 'Thank You',
        thanks_desc: 'For joining us on this special day. Your presence is the best gift we could receive.',
      },
      it: {
        tap_to_open: 'Tocca per aprire',
        skip: 'Salta',
        hero_cordially: 'Siete cordialmente invitati a celebrare il matrimonio di',
        hero_message: 'Desideriamo invitarvi a celebrare con noi il giorno più speciale della nostra vita. Sarebbe un onore avervi presenti in questo momento così importante.',
        scroll_label: 'Scorri',
        reveal_title: 'Scopri',
        reveal_sub: 'Gratta per scoprire la data',
        coin_month: 'Sett',
        reveal_done: 'Segna la data!',
        countdown_title: 'Conto alla rovescia',
        cd_days: 'Giorni',
        cd_hours: 'Ore',
        cd_min: 'Min',
        cd_sec: 'Sec',
        countdown_sub: 'al grande giorno',
        venue_intro: 'La celebrazione si terrà presso',
        venue_city: 'Artimino, Firenze',
        venue_date: '10 Settembre 2027',
        venue_reception: 'Seguirà Ricevimento',
        view_map: 'Vedi sulla mappa',
        dress_title: 'Dress Code',
        dress_desc: 'Vi invitiamo a vestire in modo elegante e formale per festeggiare con noi questo giorno speciale.',
        dress_attire: 'Abito Formale',
        dress_note: 'Si prega di evitare il bianco',
        gifts_eyebrow: 'Lista nozze',
        gifts_title: 'Regali',
        gifts_desc: 'La vostra presenza è il regalo più bello che potessimo ricevere. Tuttavia, se desiderate contribuire alla nostra nuova vita insieme, potete farlo tramite bonifico bancario.',
        gifts_love: 'Con tutto il nostro amore',
        bank_title: 'Coordinate bancarie',
        bank_holder_label: 'INTESTATARIO:',
        bank_ref_label: 'CAUSALE:',
        copy_iban: 'Copia IBAN',
        iban_copied: 'IBAN copiato negli appunti',
        transport_eyebrow: 'Come arrivare',
        transport_title: 'Trasporto',
        transport_desc: 'Abbiamo organizzato degli autobus dal centro di Firenze fino alla villa per permettervi di godervi la festa senza pensieri.',
        bus_dep_label: 'Partenza autobus',
        bus_ret_label: 'Ritorno a Firenze',
        transport_note: 'Indicate nel vostro RSVP se avete bisogno del trasporto',
        rsvp_badge: 'Questo modulo è completamente personalizzabile',
        rsvp_title: 'Conferma la tua presenza',
        rsvp_name_label: 'Nome e Cognome *',
        rsvp_name_ph: 'Il tuo nome',
        rsvp_email_label: 'Email (opzionale)',
        rsvp_attend_label: 'Parteciperai? *',
        rsvp_yes: 'Sì, ci sarò!',
        rsvp_no: 'No, non potrò partecipare',
        rsvp_bus_label: 'Ho bisogno del trasporto in bus da Firenze (16:00)',
        rsvp_diet_label: 'Allergie / Esigenze alimentari (opzionale)',
        rsvp_diet_ph: 'Vegetariano, senza glutine, allergie...',
        rsvp_msg_label: 'Messaggio per gli sposi (opzionale)',
        rsvp_msg_ph: 'Scrivici qualche parola...',
        rsvp_confirm: 'Conferma',
        confirm_thanks: 'Grazie!',
        edit_rsvp: 'Modifica risposta',
        thanks_title: 'Grazie',
        thanks_desc: 'Per aver condiviso con noi questo giorno speciale. La vostra presenza è il regalo più bello.',
      },
    };

    let currentLang = 'en';

    (function initLanguageSwitcher() {
      const langBtns = document.querySelectorAll('.theatre-root .lang-btn');

      function applyLanguage(lang) {
        currentLang = I18N[lang] ? lang : 'en';
        const dict = I18N[currentLang];
        document.documentElement.lang = currentLang;

        langBtns.forEach((btn) => {
          const active = btn.dataset.lang === currentLang;
          btn.style.backgroundColor = active ? 'rgb(92, 32, 24)' : 'transparent';
          btn.style.color = active ? 'white' : 'rgb(92, 32, 24)';
        });

        document.querySelectorAll('.theatre-root [data-i18n]').forEach((el) => {
          const key = el.dataset.i18n;
          if (dict[key]) el.textContent = dict[key];
        });

        document.querySelectorAll('.theatre-root [data-i18n-placeholder]').forEach((el) => {
          const key = el.dataset.i18nPlaceholder;
          if (dict[key]) el.placeholder = dict[key];
        });
        window.__THEATRE_REAPPLY?.();
      }

      langBtns.forEach((btn) => {
        btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
      });
    })();

    // =========================================================================
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
          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent('RSVP · '+guestName+' · '+(attendance==='yes'?'Yes':'No')),'_blank','noopener');return;
        }
        summaryEl.textContent = isDemo
          ? (currentLang==='it' ? 'Questa è una demo. Nessuna risposta è stata inviata o salvata.' : 'This is a demo. No response has been sent or saved.')
          : (currentLang==='it' ? 'La destinazione RSVP non è ancora configurata.' : 'The RSVP destination is not configured.');

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
