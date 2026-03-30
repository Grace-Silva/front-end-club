/* — Progress Grid Generator — */
    (function() {
      const track = document.querySelector('.progress-grid__track');
      const total = 60;
      const done  = 3;

      for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'progress-grid__cell';

        if (i < done) {
          cell.classList.add('progress-grid__cell--done');
          cell.setAttribute('title', 'Estudiante completado');
        } else if (i === done) {
          cell.classList.add('progress-grid__cell--active');
          cell.setAttribute('title', 'Tu lugar');
        }

        track.appendChild(cell);
      }
    })();

    /* — Step hover activo — */
    (function() {
      const steps = document.querySelectorAll('.step');
      steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
          steps.forEach(s => s.classList.remove('step--active'));
          step.classList.add('step--active');
        });
        step.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            steps.forEach(s => s.classList.remove('step--active'));
            step.classList.add('step--active');
          }
        });
      });
    })();

    /* — Stat bar animation on scroll — */
    (function() {
      const bars = document.querySelectorAll('.stat__bar-fill');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width || entry.target.style.width;
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      bars.forEach(bar => observer.observe(bar));
    })();
