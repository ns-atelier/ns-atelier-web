/* Código interactivo original de Dolce Vita, adaptado al visor compartido. */
window.startDolceVitaOriginal=function(){
    // =========================================================================
    // 2. THE DATE — INTERACTIVE SCRATCH-OFF CANVAS & CONFETTI CELEBRATION
    // =========================================================================
    (function initDateScratch() {
      const DEFS = [
        { tileId: 'tdr-tile-day', cvsId: 'tdr-cvs-day' },
        { tileId: 'tdr-tile-month', cvsId: 'tdr-cvs-month' },
        { tileId: 'tdr-tile-year', cvsId: 'tdr-cvs-year' },
      ];

      let doneCount = 0;
      let allDone = false;

      function paintMetallicBlue(ctx, w, h) {
        const base = ctx.createLinearGradient(0, 0, w, h);
        base.addColorStop(0, '#dce8ee');
        base.addColorStop(0.25, '#d2dfe6');
        base.addColorStop(0.55, '#c8d7df');
        base.addColorStop(0.8, '#d0dde5');
        base.addColorStop(1, '#c4d3dc');
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, w, h);

        // Soft upper-left radial highlight
        const hl = ctx.createRadialGradient(w * 0.28, h * 0.24, 0, w * 0.28, h * 0.24, w * 0.68);
        hl.addColorStop(0, 'rgba(240,248,252,0.7)');
        hl.addColorStop(0.45, 'rgba(230,242,248,0.25)');
        hl.addColorStop(1, 'rgba(230,242,248,0)');
        ctx.fillStyle = hl;
        ctx.fillRect(0, 0, w, h);

        // Diagonal shimmer stripes
        ctx.globalAlpha = 0.11;
        for (let i = -h; i < w + h; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + h * 0.75, h);
          ctx.strokeStyle = '#eef4f8';
          ctx.lineWidth = 9;
          ctx.stroke();
        }
        ctx.globalAlpha = 0.06;
        for (let i = -h + 10; i < w + h; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + h * 0.75, h);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Subtle radial glints
        ctx.globalAlpha = 1;
        const glints = [
          [w * 0.14, h * 0.18], [w * 0.5, h * 0.1], [w * 0.84, h * 0.22],
          [w * 0.22, h * 0.78], [w * 0.72, h * 0.82], [w * 0.88, h * 0.58],
          [w * 0.08, h * 0.52], [w * 0.62, h * 0.42], [w * 0.38, h * 0.62],
        ];
        glints.forEach(([dx, dy]) => {
          const rg = ctx.createRadialGradient(dx, dy, 0, dx, dy, 6);
          rg.addColorStop(0, 'rgba(220,238,248,0.95)');
          rg.addColorStop(0.5, 'rgba(180,210,228,0.45)');
          rg.addColorStop(1, 'rgba(180,210,228,0)');
          ctx.fillStyle = rg;
          ctx.globalAlpha = 0.32;
          ctx.beginPath();
          ctx.arc(dx, dy, 6, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(220,238,248,0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0.75, 0.75, w - 1.5, h - 1.5);
      }

      DEFS.forEach(({ tileId, cvsId }) => {
        const tile = document.getElementById(tileId);
        const cvs = document.getElementById(cvsId);
        if (!tile || !cvs) return;
        const ctx = cvs.getContext('2d');

        let isDown = false;
        let isDone = false;

        function resize() {
          const r = tile.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          cvs.width = Math.round(r.width);
          cvs.height = Math.round(r.height);
          if (!isDone) paintMetallicBlue(ctx, cvs.width, cvs.height);
        }

        resize();
        window.addEventListener('resize', resize);
        setTimeout(resize, 250);
        setTimeout(resize, 700);

        function canvasXY(clientX, clientY) {
          const r = cvs.getBoundingClientRect();
          return {
            x: (clientX - r.left) * (cvs.width / r.width),
            y: (clientY - r.top) * (cvs.height / r.height),
          };
        }

        function scratchAt(x, y) {
          if (isDone) return;
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(x, y, 36, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,1)';
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          checkDone();
        }

        function checkDone() {
          if (Math.random() > 0.16) return;
          try {
            const d = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
            let vis = 0;
            let tot = 0;
            for (let i = 3; i < d.length; i += 12) {
              tot++;
              if (d[i] > 10) vis++;
            }
            if ((tot - vis) / tot > 0.4) finishPanel();
          } catch (err) {
            // Ignore readback errors
          }
        }

        function finishPanel() {
          if (isDone) return;
          isDone = true;
          let a = 1;
          const fade = setInterval(() => {
            a -= 0.06;
            if (a <= 0) {
              clearInterval(fade);
              cvs.style.display = 'none';
            } else {
              ctx.clearRect(0, 0, cvs.width, cvs.height);
              ctx.globalAlpha = Math.max(0, a);
              paintMetallicBlue(ctx, cvs.width, cvs.height);
              ctx.globalAlpha = 1;
            }
          }, 22);

          doneCount++;
          if (doneCount === 3 && !allDone) {
            allDone = true;
            setTimeout(onAllDone, 500);
          }
        }

        cvs.addEventListener('mousedown', (e) => {
          isDown = true;
          const p = canvasXY(e.clientX, e.clientY);
          scratchAt(p.x, p.y);
        });
        cvs.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          const p = canvasXY(e.clientX, e.clientY);
          scratchAt(p.x, p.y);
        });
        window.addEventListener('mouseup', () => { isDown = false; });

        cvs.addEventListener('touchstart', (e) => {
          e.preventDefault();
          isDown = true;
          const t = e.touches[0];
          const p = canvasXY(t.clientX, t.clientY);
          scratchAt(p.x, p.y);
        }, { passive: false });

        cvs.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (!isDown) return;
          const t = e.touches[0];
          const p = canvasXY(t.clientX, t.clientY);
          scratchAt(p.x, p.y);
        }, { passive: false });

        cvs.addEventListener('touchend', () => { isDown = false; });
      });

      function onAllDone() {
        const married = document.getElementById('tdr-married');
        const flash = document.getElementById('tdr-flash');
        married.classList.remove('opacity-0', 'translate-y-2.5');
        married.classList.add('opacity-100', 'translate-y-0');
        flash.classList.add('tdr-flash-go');
        launchConfetti();
      }

      function launchConfetti() {
        const cc = document.getElementById('tdr-confetti');
        const cx = cc.getContext('2d');
        cc.width = window.innerWidth;
        cc.height = window.innerHeight;

        const palette = [
          '#c8aa78', '#dfc48e', '#ede5cc', '#f5ede0', '#1a1916',
          '#d4c090', 'rgba(200,170,120,0.65)', '#b89050', '#e8d8a8',
        ];

        const pieces = Array.from({ length: 85 }, () => ({
          x: Math.random() * cc.width,
          y: -15 - Math.random() * 180,
          vy: Math.random() * 1.4 + 0.7,
          vx: (Math.random() - 0.5) * 1.0,
          w: Math.random() * 10 + 3,
          h: Math.random() * 4 + 1.5,
          rot: Math.random() * Math.PI * 2,
          rv: (Math.random() - 0.5) * 0.06,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.55 + 0.4,
          drift: Math.random() * Math.PI * 2,
          ds: Math.random() * 0.018 + 0.008,
          shape: Math.random() > 0.45 ? 0 : 1,
        }));

        let frame = 0;
        const maxFrames = 320;

        (function draw() {
          cx.clearRect(0, 0, cc.width, cc.height);
          const fade = Math.max(0, 1 - frame / maxFrames);

          pieces.forEach((p) => {
            cx.save();
            cx.globalAlpha = p.alpha * fade;
            cx.translate(p.x, p.y);
            cx.rotate(p.rot);
            cx.fillStyle = p.color;
            if (p.shape === 0) {
              cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else {
              cx.beginPath();
              cx.arc(0, 0, p.h, 0, Math.PI * 2);
              cx.fill();
            }
            cx.restore();

            p.y += p.vy;
            p.x += p.vx + Math.sin(p.drift) * 0.45;
            p.rot += p.rv;
            p.drift += p.ds;

            if (p.y > cc.height + 20) {
              p.y = -15;
              p.x = Math.random() * cc.width;
            }
          });

          frame++;
          if (frame < maxFrames) {
            requestAnimationFrame(draw);
          } else {
            cx.clearRect(0, 0, cc.width, cc.height);
          }
        })();
      }
    })();

    // =========================================================================
    // 3. SCROLL-DRIVEN LETTER SLIDE & PARTING CLOUDS IN SCHEDULE
    // =========================================================================
    (function initScrollEffects() {
      const letterSection = document.getElementById('letter-section');
      const letterCard = document.getElementById('letter-card');
      const scheduleSection = document.getElementById('schedule-section');
      const cloudTop = document.getElementById('cloud-top');
      const cloudBottom = document.getElementById('cloud-bottom');

      function onScroll() {
        const vh = window.innerHeight;

        // Subtle upward letter rise inside the envelope as user scrolls
        if (letterSection && letterCard) {
          const rect = letterSection.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
          const offsetY = (0.5 - progress) * 44; // glides gently upward
          letterCard.style.transform = `translateY(${offsetY.toFixed(1)}px)`;
        }

        // Parting clouds horizontally as Schedule section enters viewport
        if (scheduleSection && cloudTop && cloudBottom) {
          const rect = scheduleSection.getBoundingClientRect();
          // Starts parting as section enters from bottom, fully parted near upper middle
          const raw = (vh * 0.92 - rect.top) / (vh * 0.72);
          const progress = Math.min(1, Math.max(0, raw));
          const shiftRight = progress * 460;
          const shiftLeft = -progress * 460;
          const cloudOpacity = Math.max(0, 1 - progress * 0.85);

          cloudTop.style.transform = `translate(calc(-50% + ${shiftRight.toFixed(1)}px), 0)`;
          cloudBottom.style.transform = `translate(calc(-50% + ${shiftLeft.toFixed(1)}px), 0)`;
          cloudTop.style.opacity = cloudOpacity.toFixed(2);
          cloudBottom.style.opacity = cloudOpacity.toFixed(2);
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    })();

    // =========================================================================
    // 4. DRESS CODE GALLERY DRAG-TO-SCROLL & LIGHTBOX ZOOM
    // =========================================================================
    (function initGalleryAndLightbox() {
      const gallery = document.getElementById('dress-gallery');
      const images = Array.from(document.querySelectorAll('.dv-root .gallery-img'));
      const modal = document.getElementById('lightbox-modal');
      const lightboxImg = document.getElementById('lightbox-img');
      const closeBtn = document.getElementById('lightbox-close');
      const prevBtn = document.getElementById('lightbox-prev');
      const nextBtn = document.getElementById('lightbox-next');

      let isDragging = false;
      let hasDragged = false;
      let startX = 0;
      let scrollLeft = 0;
      let currentIndex = 0;

      // Desktop drag-to-scroll
      gallery.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasDragged = false;
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      gallery.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 1.4;
        if (Math.abs(walk) > 6) hasDragged = true;
        gallery.scrollLeft = scrollLeft - walk;
      });

      // Click-to-zoom Lightbox
      function openLightbox(index) {
        currentIndex = (index + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        modal.classList.add('is-open');
      }

      function closeLightbox() {
        modal.classList.remove('is-open');
      }

      images.forEach((img, idx) => {
        img.addEventListener('click', () => {
          if (hasDragged) return;
          openLightbox(idx);
        });
      });

      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
      nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
      });
    })();

    // =========================================================================
    // 5. RSVP MODAL POPUP
    // =========================================================================
    (function initRsvpModal() {
      const modal = document.getElementById('rsvp-modal');
      const openBtn = document.getElementById('open-rsvp-btn');
      const closeBtn = document.getElementById('close-rsvp-btn');
      const doneBtn = document.getElementById('rsvp-done-btn');
      const form = document.getElementById('rsvp-form');
      const successBox = document.getElementById('rsvp-success');
      const successMsg = document.getElementById('rsvp-success-msg');
      const nameInput = document.getElementById('rsvp-name');

      function openModal() {
        modal.classList.add('is-open');
      }

      function closeModal() {
        modal.classList.remove('is-open');
      }

      openBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      doneBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = nameInput.value.trim() || 'Dear Guest';
        const choice = document.querySelector('input[name="attendance"]:checked')?.value || 'Yes, I will';

        if (choice === 'Yes, I will') {
          successMsg.textContent = `We are so excited to celebrate with you, ${guestName}!`;
        } else if (choice === 'Ill tell you a bit later') {
          successMsg.textContent = `Thank you, ${guestName}. Take your time and let us know before September 30!`;
        } else {
          successMsg.textContent = `Thank you for letting us know, ${guestName}. You will be dearly missed!`;
        }

        const isDemo = window.__DV_DEMO !== false;
        const formUrl=window.__DV_RSVP_FORM || '';
        const whatsapp=String(window.__DV_WHATSAPP||'').replace(/\D/g,'');
        if (!isDemo && /^https:\/\//i.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }
        if (!isDemo && whatsapp.length>=10 && whatsapp.length<=15) {
          const msg = 'RSVP: '+guestName+' · '+choice;
          window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent(msg),'_blank','noopener'); return;
        }
        successMsg.textContent = isDemo
          ? 'Esta es una demostración. No se ha enviado ni registrado ninguna respuesta.'
          : 'La confirmación todavía no está configurada para este evento.';
        form.classList.add('hidden');
        successBox.classList.remove('hidden');
      });
    })();

    // =========================================================================
    // 6. INTERSECTION OBSERVER FOR REVEAL & FADE-IN ANIMATIONS
    // =========================================================================
    (function initObservers() {
      const elements = document.querySelectorAll('.dv-root .reveal, .dv-root .fade-only');
      if (!('IntersectionObserver' in window)) { elements.forEach(el => el.classList.add('is-visible')); return; }
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
