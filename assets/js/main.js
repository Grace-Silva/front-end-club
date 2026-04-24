/* — Students Generator — */
const TOTAL_ESTUDIANTES = 38;

const WIDTH = 960;
const HEIGHT = 540;
const NS = "http://www.w3.org/2000/svg";




// Proyección Natural Earth
const projection = d3
  .geoNaturalEarth1()
  .scale(153)
  .translate([WIDTH / 2, HEIGHT / 2]);

const pathGen = d3.geoPath().projection(projection);

// ── Dibujar el mapa 
async function initMap() {
  const world = await d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  );

  const countries = topojson.feature(world, world.objects.countries);
  const land = topojson.merge(world, world.objects.countries.geometries);

  // Países
  const layer = document.getElementById("countries-layer");
  countries.features.forEach((feature) => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", pathGen(feature));
    p.setAttribute("fill", "#161b25");
    p.setAttribute("stroke", "rgba(255,255,255,0.07)");
    p.setAttribute("stroke-width", "0.5");
    layer.appendChild(p);
  });

  // Oculta loader por defecto
  const loader = document.getElementById("map-loader");
  loader.classList.add("hidden");
  setTimeout(() => loader.remove(), 600);

  // Puntos de estudiantes
  renderStudents(TOTAL_ESTUDIANTES, land);
}

// ── Generar y pintar los puntos 
function renderStudents(total, land) {
  const dotsLayer = document.getElementById("dots-layer");
  const pulsesLayer = document.getElementById("pulses-layer");
  dotsLayer.innerHTML = "";
  pulsesLayer.innerHTML = "";

  // Genera puntos aleatorios SOLO sobre tierra firme
  const points = [];
  let tries = 0;
  while (points.length < total && tries < total * 100) {
    tries++;
    const lon = Math.random() * 340 - 170; // -170 a +170
    const lat = Math.random() * 140 - 60; // -60 a +80 (sin Antártida)
    if (d3.geoContains(land, [lon, lat])) {
      const [x, y] = projection([lon, lat]);
      points.push({ x, y });
    }
  }
  points.forEach(({ x, y }, i) => {
    const delay = i * 30; // ms de retraso escalonado

    // — Punto principal —
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", x.toFixed(2));
    dot.setAttribute("cy", y.toFixed(2));
    dot.setAttribute("r", "2.8");
    dot.setAttribute("fill", "#00e5a0");
    dot.setAttribute("opacity", "0");
    dotsLayer.appendChild(dot);

    setTimeout(() => {
      dot.style.transition = "opacity 0.4s, r 0.3s";
      dot.setAttribute("opacity", "0.9");
    }, delay);

    // — Halo de pulso —
    const pulse = document.createElementNS(NS, "circle");
    pulse.setAttribute("cx", x.toFixed(2));
    pulse.setAttribute("cy", y.toFixed(2));
    pulse.setAttribute("r", "2.8");
    pulse.setAttribute("fill", "none");
    pulse.setAttribute("stroke", "#00e5a0");
    pulse.setAttribute("stroke-width", "1");
    pulse.setAttribute("opacity", "0");
    pulsesLayer.appendChild(pulse);

    // Pulso recursivo con requestAnimationFrame
    const doPulse = () => {
      const start = performance.now();
      const duration = 1500;
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 2);
        pulse.setAttribute("r", (2.8 + ease * 8).toFixed(2));
        pulse.setAttribute("opacity", ((1 - t) * 0.65).toFixed(3));
        if (t < 1) requestAnimationFrame(step);
        else setTimeout(doPulse, 1000 + Math.random() * 3000);
      };
      requestAnimationFrame(step);
    };

    // Inicia el pulso después del fade-in
    setTimeout(doPulse, delay + 500);
  });

  // — Contador animado —
  let c = 0;
  const el = document.getElementById("counter-display");
  const step = Math.max(1, Math.ceil(total / 40));
  const tick = setInterval(() => {
    c = Math.min(c + step, total);
    el.textContent = c;
    if (c >= total) clearInterval(tick);
  }, 35);
}

// ── Arranca 
initMap().catch((err) => {
  console.error("Error cargando el mapa:", err);
  document.getElementById("map-loader").innerHTML =
    '<span style="font-family:monospace;font-size:11px;color:#ff5f57">error cargando mapa — revisa tu conexión</span>';
});


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

/* stats */
let estudiantes__activos = document.getElementById("estudiantes-activos");
estudiantes__activos.innerText = TOTAL_ESTUDIANTES + "+";


/* menu contraíble */
let menuBtn = document.getElementById("toggle-menu");
let navbarContent = document.getElementById("navbar-content");

function mostrarMenu(){
  navbarContent.classList.toggle("visible");
}
menuBtn.addEventListener("click", mostrarMenu);