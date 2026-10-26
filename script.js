/* ============================================================
   GUARAPIRANGA — JAVASCRIPT
   ============================================================ */

const state = {
  indicators: [],
  filter: "todos"
};

/* ============================================================
   01. MENU MOBILE
   ============================================================ */
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const desktopNav = document.querySelector(".desktop-nav");
  const navLinks = document.querySelectorAll(
    ".desktop-nav a, .mobile-menu a"
  );

  if (!navLinks.length) return;

  const sections = [
    ...new Set(
      [...navLinks]
        .map(link => {
          const href = link.getAttribute("href");
          return href?.startsWith("#")
            ? document.querySelector(href)
            : null;
        })
        .filter(Boolean)
    )
  ];

  // Cria o indicador deslizante no menu desktop.
  let indicator = null;

  if (desktopNav) {
    indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");
    desktopNav.prepend(indicator);
  }

  function moveIndicator(activeLink) {
    if (!indicator || !activeLink) return;

    // Calcula a posição relativa ao próprio menu.
    const navRect = desktopNav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    indicator.style.left = `${linkRect.left - navRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.top = `${linkRect.top - navRect.top}px`;
    indicator.style.height = `${linkRect.height}px`;
    indicator.style.opacity = "1";
  }

  function setActiveSection(section) {
    if (!section) return;

    navLinks.forEach(link => {
      const isActive =
        link.getAttribute("href") === `#${section.id}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const activeDesktopLink = desktopNav
      ? [...desktopNav.querySelectorAll("a")].find(
          link => link.getAttribute("href") === `#${section.id}`
        )
      : null;

    moveIndicator(activeDesktopLink);
  }

  function updateActiveSection() {
    if (!sections.length) return;

    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 0;

    const activationLine = headerHeight + 100;
    let currentSection = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= activationLine) {
        currentSection = section;
      } else {
        break;
      }
    }

    const atPageBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (atPageBottom) {
      currentSection = sections[sections.length - 1];
    }

    setActiveSection(currentSection);
  }

  // Ao clicar, destaca imediatamente a seção escolhida.
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) setActiveSection(target);
    });
  });

  window.addEventListener("scroll", updateActiveSection, {
    passive: true
  });

  window.addEventListener("resize", updateActiveSection);

  // Recalcula a posição depois que as fontes e o layout carregarem.
  window.addEventListener("load", updateActiveSection);

  updateActiveSection();
});



/* ============================================================
   02. REFERÊNCIAS — ABRIR/FECHAR
   ============================================================ */
const referencesToggle = document.querySelector(".references-toggle");
const referencesContent = document.querySelector(".references-content");

if (referencesToggle) {
  referencesToggle.addEventListener("click", () => {
    const expanded = referencesToggle.getAttribute("aria-expanded") === "true";

    referencesToggle.setAttribute("aria-expanded", String(!expanded));
    referencesContent.style.maxHeight = expanded
      ? "0px"
      : `${referencesContent.scrollHeight}px`;
  });
}

/* ============================================================
   03. CARREGAR DADOS DO JSON
   ============================================================ */
async function loadIndicators() {
  const grid = document.querySelector("#indicatorGrid");

  try {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error("Não foi possível carregar data.json.");
    }

    const data = await response.json();
    state.indicators = data.indicadores || [];

    renderIndicators();
  } catch (error) {
    console.error(error);

    grid.innerHTML = `
      <div class="indicator-card" style="grid-column: 1 / -1;">
        <strong style="color:#c8d68d;">Dados ainda não carregados.</strong>
        <p style="margin-top:8px;color:#a1aaa5;font-size:9px;">
          Abra o projeto usando o Live Server do VS Code para que o JavaScript
          consiga carregar o arquivo data.json.
        </p>
      </div>
    `;
  }
}

/* ============================================================
   04. RENDERIZAR INDICADORES
   ============================================================ */
function renderIndicators() {
  const grid = document.querySelector("#indicatorGrid");

  const filtered =
    state.filter === "todos"
      ? state.indicators
      : state.indicators.filter(item => item.categoria === state.filter);

  grid.innerHTML = filtered.map(item => `
    <article class="indicator-card">
      <div class="indicator-top">
        <div>
          <div class="indicator-name">${item.nome}</div>
          <div class="indicator-description">${item.descricao}</div>
        </div>

        <span class="indicator-icon">${item.icone}</span>
      </div>

      <span class="indicator-value">${item.valor}</span>

      <div class="indicator-line"></div>

      <span class="indicator-category">${item.status}</span>
    </article>
  `).join("");
}



/* ============================================================
   05. FILTROS DOS RESULTADOS
   ============================================================ */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");
    state.filter = tab.dataset.filter;

    renderIndicators();
  });
});




/* ============================================================
   06. INICIALIZAÇÃO
   ============================================================ */
loadIndicators();

/* PARÂMETROS — abrir/fechar somente por clique */
document.querySelectorAll(".parameter-card").forEach((card) => {
  card.addEventListener("click", () => {
    const wasOpen = card.getAttribute("aria-expanded") === "true";

    // Fecha todos; se o clicado estava fechado, abre somente ele.
    document.querySelectorAll(".parameter-card").forEach((item) => {
      item.setAttribute("aria-expanded", "false");
    });

    card.setAttribute("aria-expanded", String(!wasOpen));
  });
});


/* ============================================================
   07. RESULTADOS POR PONTO — mapa, seleção e gráficos
   ============================================================ */
async function initSamplingResults() {
  const mapElement = document.getElementById('samplingMap');
  const select = document.getElementById('samplingPointSelect');
  const details = document.getElementById('samplingPointDetails');
  const phChart = document.getElementById('phChart');
  const conductivityChart = document.getElementById('conductivityChart');
  if (!mapElement || !select || !details) return;

  let map;
  let markers = {};
  let points = [];

  function showDetails(point) {
    if (!point) {
      details.innerHTML = '<p>Selecione um ponto para visualizar os resultados.</p>';
      return;
    }
    details.innerHTML = `
      <div class="point-detail-heading"><span class="point-label">PONTO DE AMOSTRAGEM</span><h4>${point.nome}</h4></div>
      <dl class="point-data-list">
        <div><dt>pH</dt><dd>${Number(point.ph).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</dd></div>
        <div><dt>Condutividade elétrica</dt><dd>${Number(point.condutividade_us_cm).toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1})} <small>µS/cm</small></dd></div>
        <div><dt>Temperatura</dt><dd>${point.temperatura_c == null ? 'Aguardando medição' : `${point.temperatura_c} °C`}</dd></div>
        <div><dt>Cor da água</dt><dd>${point.cor || 'Não registrado'}</dd></div>
        <div><dt>Odor</dt><dd>${point.odor || 'Não registrado'}</dd></div>
        <div><dt>Resíduos observados</dt><dd>${point.residuos || 'Não registrado'}</dd></div>
      </dl>
      <p class="point-coordinates"><strong>Coordenadas:</strong> ${point.coordenadas || `${point.latitude}, ${point.longitude}`}</p>
      <a class="point-map-link" href="https://www.google.com/maps?q=${point.latitude},${point.longitude}" target="_blank" rel="noopener noreferrer">Abrir localização no Google Maps ↗</a>`;
    select.value = point.id;
    Object.entries(markers).forEach(([id, marker]) => {
      if (id === point.id) marker.openPopup();
    });
  }

  function renderChart(target, key, suffix, decimals) {
    if (!target) return;
    const values = points.map(p => Number(p[key])).filter(Number.isFinite);
    if (!values.length) { target.innerHTML = '<p>Dados ainda não disponíveis.</p>'; return; }
    const max = Math.max(...values);
    target.innerHTML = points.map(point => {
      const value = Number(point[key]);
      if (!Number.isFinite(value)) return '';
      const width = max > 0 ? Math.max(4, value / max * 100) : 4;
      return `<button class="chart-row" type="button" data-point-id="${point.id}" aria-label="Selecionar ${point.nome}">
        <span class="chart-label">${point.nome.replace('Ponto ', '')}</span>
        <span class="chart-track"><span class="chart-bar" style="width:${width}%"></span></span>
        <span class="chart-value">${value.toLocaleString('pt-BR', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}${suffix}</span>
      </button>`;
    }).join('');
    target.querySelectorAll('[data-point-id]').forEach(button => button.addEventListener('click', () => {
      select.value = button.dataset.pointId;
      const point = points.find(p => p.id === button.dataset.pointId);
      showDetails(point);
      if (point && markers[point.id]) map?.flyTo(markers[point.id].getLatLng(), 16);
    }));
  }

  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Não foi possível carregar data.json');
    const data = await response.json();
    points = Array.isArray(data.pontos_coleta) ? data.pontos_coleta : [];
    if (!points.length) throw new Error('Nenhum ponto de coleta encontrado no data.json');

    select.innerHTML = points.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    if (window.L) {
      map = L.map(mapElement, {scrollWheelZoom: false}).setView([points[0].latitude, points[0].longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      }).addTo(map);
      points.forEach(point => {
        if (!Number.isFinite(Number(point.latitude)) || !Number.isFinite(Number(point.longitude))) return;
        const marker = L.marker([point.latitude, point.longitude]).addTo(map);
        marker.bindPopup(`<strong>${point.nome}</strong><br>pH: ${Number(point.ph).toLocaleString('pt-BR', {minimumFractionDigits: 2})}<br>Condutividade: ${Number(point.condutividade_us_cm).toLocaleString('pt-BR', {minimumFractionDigits: 1})} µS/cm`);
        marker.on('click', () => showDetails(point));
        markers[point.id] = marker;
      });
      const validPoints = points.filter(p => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)));
      if (validPoints.length > 1) map.fitBounds(L.latLngBounds(validPoints.map(p => [p.latitude, p.longitude])).pad(0.18));
      setTimeout(() => map.invalidateSize(), 150);
    } else {
      mapElement.innerHTML = '<div class="map-fallback">Não foi possível carregar o mapa. Verifique sua conexão com a internet.</div>';
    }
    select.addEventListener('change', () => {
      const point = points.find(p => p.id === select.value);
      if (!point) { showDetails(null); return; }
      showDetails(point);
      if (markers[point.id]) map.flyTo(markers[point.id].getLatLng(), 16);
    });
    renderChart(phChart, 'ph', '', 2);
    renderChart(conductivityChart, 'condutividade_us_cm', '', 1);

    // Exibe o primeiro ponto automaticamente ao carregar a página.
    if (points.length) {
      select.value = points[0].id;
      showDetails(points[0]);
      if (markers[points[0].id]) {
        map?.setView(markers[points[0].id].getLatLng(), 14);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar os resultados dos pontos:', error);
    mapElement.innerHTML = '<div class="map-fallback">Não foi possível carregar o mapa e os pontos. Abra o site pelo Live Server e confira o arquivo data.json.</div>';
    details.innerHTML = '<p>Não foi possível carregar os resultados. Confira o arquivo data.json.</p>';
  }
}

document.addEventListener('DOMContentLoaded', initSamplingResults);
