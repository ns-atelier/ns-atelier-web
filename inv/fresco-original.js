/* Fresco original interactions scoped to the public viewer. */
window.startFrescoOriginal=function(){

    // =========================================================================
    // 1. BILINGUAL TRANSLATIONS (EN / DE) & LIVE LANGUAGE SWITCHER
    // =========================================================================
    const I18N = {
      en: {
        tap_to_open: 'Tap to open',
        skip: 'Skip',
        hero_invite: 'WE INVITE YOU TO <br />CELEBRATE OUR WEDDING',
        hero_month: 'July',
        hero_day: 'Tuesday',
        hero_held_at: 'To be held at',
        countdown_title: 'Countdown',
        countdown_until: 'Until 27 July 2027',
        cd_days: 'Days',
        cd_hours: 'Hours',
        cd_minutes: 'Minutes',
        cd_seconds: 'Seconds',
        story_title: 'Our Story',
        story_p1: 'Some of the best love stories begin unexpectedly, and ours was no different.',
        story_p2: 'What started as a chance encounter soon became endless conversations, spontaneous adventures, and countless memories together.',
        story_p3: 'Somewhere along the way, we found our favorite place: by each other’s side.',
        story_p4: "And now, we're ready for our greatest adventure yet — a lifetime together.",
        and_word: 'and',
        celebration_title: 'The Celebration',
        celebration_subtitle: 'Ceremony & Dinner',
        celebration_desc: 'A ceremony in the gardens at sunset behind the Tramuntana, followed by dinner and dancing.',
        celebration_date: 'Tuesday, 27 July 2027',
        view_on_map: 'View on Map',
        day_title: 'The Day',
        day_subtitle: 'Program · Tuesday 27 July',
        day_intro: 'Our wedding day, from sunset drinks to the last dance.',
        sched_1: 'Guests Arrival & Welcome Drinks',
        sched_2: 'Ceremony',
        sched_3: 'Cocktail Hour',
        sched_4: 'Dinner',
        sched_5: 'Cake & Toasts',
        sched_6: 'First Dance',
        sched_7: 'Dancing under\nthe Stars',
        sched_8: 'Goodnight',
        dress_title: 'Dress Code',
        dress_subtitle: 'Black Tie',
        dress_desc: 'Under a Mediterranean sky, with the sea as our witness — wear the dress you have dreamed of, and dance until the last star fades.',
        soiree_date: '26th July',
        soiree_line1: 'Welcome',
        soiree_line2: 'Soirée',
        soiree_desc: 'Join us for an intimate evening of cocktails and Mediterranean views as we begin our celebrations at Son Bunyola.',
        stay_title: 'Where to Stay',
        stay_subtitle: 'Recommended hotels<br />near the venue',
        hotel1_badge: 'Exclusive wedding guest rate',
        hotel_rate_sub: 'per night · double room · breakfast included',
        hotel1_desc: 'A special fixed rate of €650 per night has been reserved exclusively for our wedding guests.',
        label_address: 'Address',
        label_parking: 'Parking',
        val_parking: 'Free on-site parking',
        book_stay: 'Book your stay',
        label_distance: 'To the venue',
        val_distance: '9 km · about 25 min by car',
        gift_title: 'Wedding Gift',
        gift_subtitle: 'Your presence is our greatest gift.',
        gift_desc: 'If you wish to honour us with a gift, we kindly prefer monetary contributions.',
        gift_btn: 'View bank details',
        rsvp_deadline: 'The favour of a reply is kindly requested by the fifteenth of May, 2027',
        rsvp_q1: 'Will you be joining us? *',
        rsvp_yes: 'Delighted to accept',
        rsvp_no: 'Regretfully unable to attend',
        rsvp_q2: 'Which events will you be attending? *',
        rsvp_ev1: 'Welcome Soirée – 26th July',
        rsvp_ev2: 'Wedding Ceremony & Reception – 27th July',
        rsvp_q3: 'Number of guests in your party',
        rsvp_q4: 'Will any children be accompanying you?',
        yes_word: 'Yes',
        no_word: 'No',
        children_label: 'Number of children & ages',
        children_ph: 'e.g. 2 children (ages 4 and 7)',
        rsvp_q5: 'A message for the couple',
        message_ph: 'We should be delighted to hear from you.',
        submit_btn: 'Submit Response',
        confirm_title: 'Thank You',
        edit_response: 'Edit response',
        footer_date: '27 July 2027',
        footer_made: 'Made with love by',
        bank_modal_title: 'Wedding Gift',
        bank_modal_sub: 'Diana & Richard',
        bank_modal_desc: 'Your presence in Mallorca is truly the greatest gift. Should you wish to contribute to our honeymoon and future home, please find our bank details below:',
        bank_holder_label: 'Account Holders',
        copy_iban_btn: 'Copy IBAN',
        copied_ok: 'IBAN copied to clipboard.',
        principal_guest: 'Principal guest',
        companion_guest: 'Guest',
        ph_fullname: 'Full name',
        ph_email: 'Email address',
        ph_dietary: 'Dietary requirements or allergies (optional)',
        err_missing_name: 'Please enter the full name for each guest.',
        err_missing_event: 'Please select at least one event you will attend.',
      },
      de: {
        tap_to_open: 'Tippen zum Öffnen',
        skip: 'Überspringen',
        hero_invite: 'WIR LADEN EUCH HERZLICH EIN, <br />UNSERE HOCHZEIT ZU FEIERN',
        hero_month: 'Juli',
        hero_day: 'Dienstag',
        hero_held_at: 'Ort der Feier',
        countdown_title: 'Countdown',
        countdown_until: 'Bis zum 27. Juli 2027',
        cd_days: 'Tage',
        cd_hours: 'Stunden',
        cd_minutes: 'Minuten',
        cd_seconds: 'Sekunden',
        story_title: 'Unsere Geschichte',
        story_p1: 'Manche der schönsten Liebesgeschichten beginnen unerwartet – und bei uns war es nicht anders.',
        story_p2: 'Was als zufällige Begegnung begann, wurde bald zu endlosen Gesprächen, spontanen Abenteuern und unzähligen gemeinsamen Erinnerungen.',
        story_p3: 'Irgendwo auf diesem Weg haben wir unseren Lieblingsplatz gefunden: an der Seite des anderen.',
        story_p4: 'Und jetzt sind wir bereit für unser größtes Abenteuer – ein gemeinsames Leben.',
        and_word: 'und',
        celebration_title: 'Die Feier',
        celebration_subtitle: 'Zeremonie & Dinner',
        celebration_desc: 'Eine Zeremonie in den Gärten bei Sonnenuntergang vor der Tramuntana, gefolgt von Dinner und Tanz.',
        celebration_date: 'Dienstag, 27. Juli 2027',
        view_on_map: 'Auf der Karte ansehen',
        day_title: 'Der Tag',
        day_subtitle: 'Programm · Dienstag, 27. Juli',
        day_intro: 'Unser Hochzeitstag – vom Aperitif bei Sonnenuntergang bis zum letzten Tanz.',
        sched_1: 'Ankunft der Gäste & Sektempfang',
        sched_2: 'Trauung',
        sched_3: 'Cocktailstunde',
        sched_4: 'Abendessen',
        sched_5: 'Hochzeitstorte & Reden',
        sched_6: 'Eröffnungstanz',
        sched_7: 'Tanz unter\ndem Sternenhimmel',
        sched_8: 'Gute Nacht',
        dress_title: 'Dresscode',
        dress_subtitle: 'Black Tie',
        dress_desc: 'Unter dem mediterranen Himmel und mit dem Meer als Zeugen – tragt euer Traumoutfit und tanzt, bis der letzte Stern verblasst.',
        soiree_date: '26. Juli',
        soiree_line1: 'Welcome',
        soiree_line2: 'Soirée',
        soiree_desc: 'Verbringt mit uns einen entspannten Abend mit Cocktails und Blick auf das Mittelmeer zum Auftakt unserer Feierlichkeiten auf Son Bunyola.',
        stay_title: 'Unterkünfte',
        stay_subtitle: 'Empfohlene Hotels<br />in der Nähe',
        hotel1_badge: 'Exklusiver Hochzeitstarif',
        hotel_rate_sub: 'pro Nacht · Doppelzimmer · inklusive Frühstück',
        hotel1_desc: 'Ein spezieller Festpreis von 650 € pro Nacht wurde exklusiv für unsere Hochzeitsgäste reserviert.',
        label_address: 'Adresse',
        label_parking: 'Parken',
        val_parking: 'Kostenlose Parkplätze vor Ort',
        book_stay: 'Aufenthalt buchen',
        label_distance: 'Zur Location',
        val_distance: '9 km · ca. 25 Min. mit dem Auto',
        gift_title: 'Hochzeitsgeschenk',
        gift_subtitle: 'Eure Anwesenheit ist unser größtes Geschenk.',
        gift_desc: 'Wenn ihr uns dennoch etwas schenken möchtet, freuen wir uns sehr über einen Beitrag zu unserer gemeinsamen Zukunft.',
        gift_btn: 'Bankverbindung ansehen',
        rsvp_deadline: 'Wir bitten freundlich um Rückmeldung bis zum 15. Mai 2027',
        rsvp_q1: 'Seid ihr dabei? *',
        rsvp_yes: 'Wir kommen sehr gerne',
        rsvp_no: 'Leider können wir nicht teilnehmen',
        rsvp_q2: 'An welchen Programmpunkten nehmt ihr teil? *',
        rsvp_ev1: 'Welcome Soirée – 26. Juli',
        rsvp_ev2: 'Trauung & Hochzeitsfeier – 27. Juli',
        rsvp_q3: 'Anzahl der Personen',
        rsvp_q4: 'Begleiten euch Kinder?',
        yes_word: 'Ja',
        no_word: 'Nein',
        children_label: 'Anzahl und Alter der Kinder',
        children_ph: 'z. B. 2 Kinder (4 und 7 Jahre)',
        rsvp_q5: 'Eine Nachricht für das Brautpaar',
        message_ph: 'Wir freuen uns sehr über ein paar persönliche Worte.',
        submit_btn: 'Antwort absenden',
        confirm_title: 'Vielen Dank',
        edit_response: 'Antwort bearbeiten',
        footer_date: '27. Juli 2027',
        footer_made: 'Mit Liebe gestaltet von',
        bank_modal_title: 'Hochzeitsgeschenk',
        bank_modal_sub: 'Diana & Richard',
        bank_modal_desc: 'Eure Anwesenheit auf Mallorca ist unser größtes Geschenk. Falls ihr zu unseren Flitterwochen beitragen möchtet, findet ihr hier unsere Bankdaten:',
        bank_holder_label: 'Kontoinhaber',
        copy_iban_btn: 'IBAN kopieren',
        copied_ok: 'IBAN in die Zwischenablage kopiert.',
        principal_guest: 'Hauptgast',
        companion_guest: 'Begleitung',
        ph_fullname: 'Vollständiger Name',
        ph_email: 'E-Mail-Adresse',
        ph_dietary: 'Unverträglichkeiten oder Allergien (optional)',
        err_missing_name: 'Bitte gebt den vollständigen Namen für jeden Gast an.',
        err_missing_event: 'Bitte wählt mindestens eine Veranstaltung aus.',
      },
    };

    let currentLang = 'en';

    (function initLanguageSwitcher() {
      const langBtns = document.querySelectorAll('.fresco-root .lang-btn');
      const htmlKeys = new Set(['hero_invite', 'stay_subtitle']);

      function applyLanguage(lang) {
        currentLang = I18N[lang] ? lang : 'en';
        const dict = I18N[currentLang];
        document.documentElement.lang = currentLang;

        langBtns.forEach((btn) => {
          const active = btn.dataset.lang === currentLang;
          if (active) {
            btn.classList.add('bg-olive', 'text-background');
            btn.classList.remove('text-foreground/60', 'hover:text-foreground');
          } else {
            btn.classList.remove('bg-olive', 'text-background');
            btn.classList.add('text-foreground/60', 'hover:text-foreground');
          }
        });

        document.querySelectorAll('.fresco-root [data-i18n]').forEach((el) => {
          const key = el.dataset.i18n;
          if (!dict[key]) return;
          if (htmlKeys.has(key)) {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        });

        document.querySelectorAll('.fresco-root [data-i18n-placeholder]').forEach((el) => {
          const key = el.dataset.i18nPlaceholder;
          if (dict[key]) el.placeholder = dict[key];
        });

        if(typeof window.__applyFrescoData==='function')window.__applyFrescoData();
        if (typeof window.__rerenderRsvpGuests === 'function') {
          window.__rerenderRsvpGuests();
        }
      }

      langBtns.forEach((btn) => {
        btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
      });
    })();

    // =========================================================================
    // 2. MEDITERRANEAN AMBIENT HARP SYNTH (Web Audio API)
    // =========================================================================
    (function initAmbientAudio() {
      const btn = document.getElementById('audio-toggle-btn');
      const iconOn = document.getElementById('audio-icon-on');
      const iconOff = document.getElementById('audio-icon-off');

      let ctx = null;
      let masterGain = null;
      let isPlaying = false;
      let timer = null;
      let idx = 0;

      // Warm Lydian/Major Mediterranean arpeggio (Fmaj7 -> G6 -> Em7 -> Am9)
      const notes = [
        349.23, 440.00, 523.25, 659.25,
        392.00, 493.88, 587.33, 659.25,
        329.63, 392.00, 493.88, 587.33,
        220.00, 329.63, 493.88, 523.25,
      ];

      function pluckNote(freq) {
        if (!ctx || !masterGain || !isPlaying) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();
        const harmGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        harmonic.type = 'triangle';
        harmonic.frequency.setValueAtTime(freq * 2, now);
        harmGain.gain.setValueAtTime(0.14, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1250, now);
        filter.frequency.exponentialRampToValueAtTime(380, now + 2.2);

        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(0.04, now + 0.05);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(filter);
        harmonic.connect(harmGain);
        harmGain.connect(filter);
        filter.connect(env);
        env.connect(masterGain);

        osc.start(now);
        harmonic.start(now);
        osc.stop(now + 2.5);
        harmonic.stop(now + 2.5);
      }

      function startAudio() {
        if (isPlaying) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!ctx) {
            ctx = new AudioCtx();
            masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
            masterGain.connect(ctx.destination);
          }
          if (ctx.state === 'suspended') ctx.resume();

          isPlaying = true;
          iconOn.classList.remove('hidden');
          iconOff.classList.add('hidden');

          pluckNote(notes[idx % notes.length]);
          idx++;
          timer = setInterval(() => {
            pluckNote(notes[idx % notes.length]);
            idx++;
          }, 780);
        } catch (err) {}
      }

      function stopAudio() {
        isPlaying = false;
        clearInterval(timer);
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      }

      btn.addEventListener('click', () => {
        if (isPlaying) stopAudio();
        else startAudio();
      });

      window.__startFrescoAudio = startAudio;
      window.__showFrescoAudioBtn = () => btn.classList.remove('hidden');
    })();

    // =========================================================================
    // 3. Shared opening overlay is provided by /inv/index.html.
    document.getElementById('hero-scroll-btn')?.addEventListener('click',()=>
      document.getElementById('countdown')?.scrollIntoView({behavior:'smooth'}));

    // 4. LIVE COUNTDOWN TIMER (27 July 2027, 17:30:00)
    // =========================================================================
    (function initCountdown() {
      const target = new Date(window.__FRESCO_DATE || "2027-07-27T17:30:00+02:00").getTime(); // Month 6 = July
      const dEl = document.getElementById('cd-days');
      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-minutes');
      const sEl = document.getElementById('cd-seconds');

      function update() {
        const diff = Math.max(0, target - Date.now());
        if (dEl) dEl.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        if (hEl) hEl.textContent = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        if (mEl) mEl.textContent = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        if (sEl) sEl.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    })();

    // =========================================================================
    // 5. SCROLL-ANIMATED TIMELINE PROGRESS LINE & CLOUD PARALLAX
    // =========================================================================
    (function initTimelineProgress() {
      const track = document.getElementById('timeline-track');
      const line = document.getElementById('timeline-progress-line');
      const storySection = document.getElementById('our-story');
      const storyClouds = document.getElementById('our-story-clouds');

      function updateScrollEffects() {
        const vh = window.innerHeight;

        if (track && line) {
          const rect = track.getBoundingClientRect();
          const startTrigger = vh * 0.78;
          const progress = Math.min(1, Math.max(0, (startTrigger - rect.top) / rect.height));
          line.style.transform = `translateX(-50%) scaleY(${progress.toFixed(3)})`;
        }

        if (storySection && storyClouds) {
          const sRect = storySection.getBoundingClientRect();
          const sProgress = Math.min(1, Math.max(0, (vh - sRect.top) / (vh + sRect.height)));
          const offsetY = (0.5 - sProgress) * 34;
          storyClouds.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0)`;
        }
      }

      window.addEventListener('scroll', updateScrollEffects, { passive: true });
      window.addEventListener('resize', updateScrollEffects);
      updateScrollEffects();
    })();

    // =========================================================================
    // 6. BANK DETAILS MODAL & ONE-CLICK COPY
    // =========================================================================
    (function initBankModal() {
      const modal = document.getElementById('bank-modal');
      const openBtn = document.getElementById('open-bank-modal-btn');
      const closeBtn = document.getElementById('close-bank-modal-btn');
      const copyBtn = document.getElementById('copy-bank-btn');
      const ibanEl = document.getElementById('bank-iban');
      const statusEl = document.getElementById('copy-bank-status');

      function openModal() {
        modal.classList.add('is-open');
      }

      function closeModal() {
        modal.classList.remove('is-open');
        statusEl.textContent = '';
      }

      openBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      copyBtn.addEventListener('click', () => {
        if(copyBtn.disabled) return;
        const iban = ibanEl.textContent.trim();
        const input = document.createElement('input');
        input.value = iban;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand('copy');
          statusEl.textContent = I18N[currentLang].copied_ok;
        } catch (err) {
          statusEl.textContent = iban;
        }
        document.body.removeChild(input);

        setTimeout(() => {
          statusEl.textContent = '';
        }, 3000);
      });
    })();

    // =========================================================================
    // 7. INTERACTIVE RSVP FORM (Dynamic Guests, Events & Children)
    // =========================================================================
    (function initRsvp() {
      const form = document.getElementById('rsvp-form');
      const confirmation = document.getElementById('rsvp-confirmation');
      const confirmSummary = document.getElementById('rsvp-confirm-summary');
      const editBtn = document.getElementById('rsvp-edit-btn');
      const errorMsg = document.getElementById('rsvp-error-msg');

      const attendCards = document.querySelectorAll('.fresco-root [data-attend-card]');
      const eventCards = document.querySelectorAll('.fresco-root .event-check-card');
      const childCards = document.querySelectorAll('.fresco-root [data-child-card]');
      const childrenDetailsBox = document.getElementById('children-details-box');
      const childrenInfoInput = document.getElementById('children-info');

      const eventsBlock = document.getElementById('rsvp-events-block');
      const guestsBlock = document.getElementById('rsvp-guests-block');
      const childrenBlock = document.getElementById('rsvp-children-block');

      const decBtn = document.getElementById('guest-dec-btn');
      const incBtn = document.getElementById('guest-inc-btn');
      const countVal = document.getElementById('guest-count-val');
      const guestCardsContainer = document.getElementById('guest-cards-container');

      let guestCount = 1;
      const MIN_GUESTS = 1;
      const MAX_GUESTS = 6;
      const guestDraft = {};

      attendCards.forEach((card) => {
        card.addEventListener('click', () => {
          const val = card.dataset.attendCard;
          attendCards.forEach((c) => {
            const radio = c.querySelector('input[type="radio"]');
            const dot = c.querySelector('.radio-dot');
            const inner = dot.querySelector('span');
            const selected = c.dataset.attendCard === val;
            radio.checked = selected;

            if (selected) {
              c.classList.add('border-olive', 'bg-olive/10');
              c.classList.remove('border-olive/70', 'bg-transparent');
              dot.classList.add('border-olive', 'bg-olive', 'text-background');
              dot.classList.remove('border-olive/75', 'text-olive');
              inner.classList.remove('opacity-0');
            } else {
              c.classList.remove('border-olive', 'bg-olive/10');
              c.classList.add('border-olive/70', 'bg-transparent');
              dot.classList.remove('border-olive', 'bg-olive', 'text-background');
              dot.classList.add('border-olive/75', 'text-olive');
              inner.classList.add('opacity-0');
            }
          });

          if (val === 'yes') {
            eventsBlock.classList.remove('hidden');
            guestsBlock.classList.remove('hidden');
            childrenBlock.classList.remove('hidden');
          } else {
            guestCount = 1;
            renderGuests();
            eventsBlock.classList.add('hidden');
            guestsBlock.classList.add('hidden');
            childrenBlock.classList.add('hidden');
          }
        });
      });

      eventCards.forEach((card) => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const cb = card.querySelector('input[type="checkbox"]');
          const circle = card.querySelector('.check-circle');
          const svg = circle.querySelector('svg');
          cb.checked = !cb.checked;

          if (cb.checked) {
            card.classList.add('border-olive', 'bg-olive/10');
            card.classList.remove('border-olive/70', 'bg-transparent');
            circle.classList.add('border-olive', 'bg-olive');
            circle.classList.remove('border-olive/75');
            svg.classList.remove('opacity-0');
          } else {
            card.classList.remove('border-olive', 'bg-olive/10');
            card.classList.add('border-olive/70', 'bg-transparent');
            circle.classList.remove('border-olive', 'bg-olive');
            circle.classList.add('border-olive/75');
            svg.classList.add('opacity-0');
          }
        });
      });

      childCards.forEach((card) => {
        card.addEventListener('click', () => {
          const val = card.dataset.childCard;
          childCards.forEach((c) => {
            const radio = c.querySelector('input[type="radio"]');
            const dot = c.querySelector('.radio-dot');
            const inner = dot.querySelector('span');
            const selected = c.dataset.childCard === val;
            radio.checked = selected;

            if (selected) {
              c.classList.add('border-olive', 'bg-olive/10');
              c.classList.remove('border-olive/70', 'bg-transparent');
              dot.classList.add('border-olive', 'bg-olive', 'text-background');
              dot.classList.remove('border-olive/75', 'text-olive');
              inner.classList.remove('opacity-0');
            } else {
              c.classList.remove('border-olive', 'bg-olive/10');
              c.classList.add('border-olive/70', 'bg-transparent');
              dot.classList.remove('border-olive', 'bg-olive', 'text-background');
              dot.classList.add('border-olive/75', 'text-olive');
              inner.classList.add('opacity-0');
            }
          });

          if (val === 'yes') {
            childrenDetailsBox.classList.remove('hidden');
          } else {
            childrenDetailsBox.classList.add('hidden');
            childrenInfoInput.value = '';
          }
        });
      });

      function saveCurrentInputs() {
        guestCardsContainer.querySelectorAll('[data-guest-card]').forEach((card) => {
          const idx = card.dataset.guestCard;
          guestDraft[idx] = {
            name: card.querySelector('.guest-name')?.value || '',
            email: card.querySelector('.guest-email')?.value || '',
            dietary: card.querySelector('.guest-dietary')?.value || '',
          };
        });
      }

      function renderGuests() {
        saveCurrentInputs();
        const dict = I18N[currentLang] || I18N.en;
        guestCardsContainer.innerHTML = '';

        for (let i = 1; i <= guestCount; i++) {
          const saved = guestDraft[String(i)] || { name: '', email: '', dietary: '' };
          const card = document.createElement('div');
          card.dataset.guestCard = String(i);
          card.className = 'space-y-3 rounded-none border border-olive/35 bg-background/70 p-4 md:p-5';

          const header = document.createElement('div');
          header.className = 'flex items-center gap-2';
          const badge = document.createElement('span');
          badge.className = 'font-body text-[11px] tracking-[0.22em] uppercase text-foreground/75 md:text-xs';
          badge.textContent = i === 1 ? dict.principal_guest : `${dict.companion_guest} ${i}`;
          header.appendChild(badge);
          card.appendChild(header);

          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.required = true;
          nameInput.placeholder = dict.ph_fullname;
          nameInput.value = saved.name;
          nameInput.className = 'guest-name flex w-full py-2 h-12 rounded-none border border-olive/70 bg-background px-4 font-body text-sm placeholder:text-olive/50 focus-visible:outline-none focus-visible:border-olive md:text-base';
          card.appendChild(nameInput);

          if (i === 1) {
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.required = true;
            emailInput.placeholder = dict.ph_email;
            emailInput.value = saved.email;
            emailInput.className = 'guest-email flex w-full py-2 h-12 rounded-none border border-olive/70 bg-background px-4 font-body text-sm placeholder:text-olive/50 focus-visible:outline-none focus-visible:border-olive md:text-base';
            card.appendChild(emailInput);
          }

          const dietInput = document.createElement('input');
          dietInput.type = 'text';
          dietInput.placeholder = dict.ph_dietary;
          dietInput.value = saved.dietary;
          dietInput.className = 'guest-dietary flex w-full py-2 h-12 rounded-none border border-olive/70 bg-background px-4 font-body text-sm placeholder:text-olive/50 focus-visible:outline-none focus-visible:border-olive md:text-base';
          card.appendChild(dietInput);

          guestCardsContainer.appendChild(card);
        }

        countVal.textContent = String(guestCount);
        decBtn.disabled = guestCount <= MIN_GUESTS;
        incBtn.disabled = guestCount >= MAX_GUESTS;
      }

      decBtn.addEventListener('click', () => {
        if (guestCount > MIN_GUESTS) {
          guestCount--;
          renderGuests();
        }
      });

      incBtn.addEventListener('click', () => {
        if (guestCount < MAX_GUESTS) {
          guestCount++;
          renderGuests();
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMsg.classList.add('hidden');
        const dict = I18N[currentLang] || I18N.en;

        const attending = document.querySelector('.fresco-root input[name="attending"]:checked')?.value === 'yes';
        const names = Array.from(guestCardsContainer.querySelectorAll('.guest-name'))
          .map((inp) => inp.value.trim())
          .filter(Boolean);

        if (names.length < guestCount) {
          errorMsg.textContent = dict.err_missing_name;
          errorMsg.classList.remove('hidden');
          return;
        }

        if (attending) {
          const checkedEvents = Array.from(document.querySelectorAll('.fresco-root input[name="events"]:checked'));
          if (checkedEvents.length === 0) {
            errorMsg.textContent = dict.err_missing_event;
            errorMsg.classList.remove('hidden');
            return;
          }

          const eventLabels = checkedEvents.map((cb) => cb.value).join(' & ');
          confirmSummary.textContent =
            currentLang === 'de'
              ? `Wir freuen uns sehr darauf, mit ${names.join(', ')} (${eventLabels}) auf Mallorca zu feiern!`
              : `We are delighted to celebrate with ${names.join(', ')} (${eventLabels}) at Son Bunyola, Mallorca!`;
        } else {
          confirmSummary.textContent =
            currentLang === 'de'
              ? `Vielen Dank für eure Rückmeldung, ${names[0]}. Wir werden euch sehr vermissen!`
              : `Thank you for letting us know, ${names[0]}. You will be dearly missed in Mallorca!`;
        }

        const demo = window.__FRESCO_DEMO !== false;
        const formUrl=window.__FRESCO_FORM||'';
        const phone=String(window.__FRESCO_WHATSAPP||'').replace(/\D/g,'');
        if(!demo && /^https:\/\//i.test(formUrl)){window.open(formUrl,'_blank','noopener');return;}
        if(!demo && phone.length>=10 && phone.length<=15){
          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent('RSVP · '+names.join(', ')+' · '+(attending?'Yes':'No')),'_blank','noopener');return;
        }
        confirmSummary.textContent = demo
          ? (currentLang==='de' ? 'Dies ist eine Demo. Keine Antwort wurde versendet oder gespeichert.' : 'This is a demo. No RSVP has been submitted or saved.')
          : (currentLang==='de' ? 'Die Bestätigung ist noch nicht eingerichtet.' : 'The RSVP destination has not been configured.');
        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
      });

      editBtn.addEventListener('click', () => {
        confirmation.classList.add('hidden');
        form.classList.remove('hidden');
      });

      window.__rerenderRsvpGuests = renderGuests;
      renderGuests();
    })();

    // =========================================================================
    // 8. INTERSECTION OBSERVER SCROLL-TRIGGERED ANIMATIONS
    // =========================================================================
    (function initScrollAnimations() {
      const targets = document.querySelectorAll('.fresco-root .reveal, .fresco-root .reveal-fade');
      if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-visible')); return; }
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

      targets.forEach((el) => observer.observe(el));
    })();
  
};
