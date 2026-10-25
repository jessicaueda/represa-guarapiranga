/* ============================================================
   GUARAPIRANGA — JAVASCRIPT
   ============================================================ */

const state = {
  indicators: [],
  points: [],
  filter: "todos",
  map: null,
  markers: {}
};

/* ============================================================
   01. MENU MOBILE
   ============================================================ */
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
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
    if (!referencesContent) return;
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
    state.points = data.pontos_coleta || [];

    renderIndicators();
    renderSamplingPoints();
  } catch (error) {
    console.error(error);

    if (!grid) return;
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
  if (!grid) return;

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
   05. PONTOS DE COLETA, MAPA E GRÁFICOS
   ============================================================ */
function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || value === "") return "Aguardando medição";
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function renderSamplingPoints() {
  const select = document.querySelector("#samplingPointSelect");
  const details = document.querySelector("#samplingPointDetails");
  if (!select || !details) return;

  if (!state.points.length) {
    details.innerHTML = "<p>Os pontos de coleta ainda não foram carregados.</p>";
    return;
  }

  select.innerHTML = '<option value="">Selecione um ponto</option>' +
    state.points.map(point => `<option value="${point.id}">${point.nome}</option>`).join("");

  const pointList = document.querySelector("#samplingPointList");
  if (pointList) {
    pointList.innerHTML = state.points.map((point, index) => `
      <button class="sampling-point-option${index === 0 ? " active" : ""}" type="button" data-point="${point.id}" aria-pressed="${index === 0 ? "true" : "false"}">
        <span class="point-number">0${index + 1}</span>
        <span><span class="point-list-name">${point.nome}</span><span class="point-list-subtitle">${point.cor || "Ponto de coleta"}</span></span>
      </button>`).join("");
    pointList.querySelectorAll("[data-point]").forEach(button => {
      button.addEventListener("click", () => showPoint(button.dataset.point, true));
    });
  }

  select.addEventListener("change", () => {
    if (select.value) showPoint(select.value, false);
  });

  renderSamplingMap();
  renderSimpleChart("phChart", "ph", "", 2);
  renderSimpleChart("conductivityChart", "condutividade_us_cm", " µS/cm", 1);
  showPoint(state.points[0].id, false);
}

function renderSamplingMap() {
  const mapElement = document.querySelector("#samplingMap");
  if (!mapElement || !window.L || !state.points.length) {
    if (mapElement) mapElement.innerHTML = '<p class="map-fallback">O mapa precisa de conexão com a internet para carregar. Use a lista ao lado para consultar os resultados.</p>';
    return;
  }

  if (state.map) {
    state.map.remove();
    state.map = null;
  }

  const coordinates = state.points.map(point => [point.latitude, point.longitude]);
  state.map = L.map(mapElement).setView(coordinates[0], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(state.map);

  state.points.forEach((point, index) => {
    const marker = L.marker([point.latitude, point.longitude]).addTo(state.map);
    marker.bindPopup(`<strong>${point.nome}</strong><br>pH: ${formatNumber(point.ph)}<br>Condutividade: ${formatNumber(point.condutividade_us_cm, 1)} µS/cm`);
    marker.on("click", () => showPoint(point.id, true));
    state.markers[point.id] = marker;
  });

  if (coordinates.length > 1) {
    state.map.fitBounds(coordinates, { padding: [24, 24] });
  }
}

function showPoint(pointId, syncSelect = true) {
  const point = state.points.find(item => item.id === pointId);
  const details = document.querySelector("#samplingPointDetails");
  const select = document.querySelector("#samplingPointSelect");
  if (!point || !details) return;

  if (syncSelect && select) select.value = point.id;
  document.querySelectorAll(".sampling-point-option").forEach(button => {
    const active = button.dataset.point === point.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  details.innerHTML = `
    <div class="point-detail-heading">
      <span class="point-label">PONTO DE AMOSTRAGEM</span>
      <h4>${point.nome}</h4>
    </div>
    <dl class="point-data-list">
      <div><dt>pH</dt><dd>${formatNumber(point.ph)}</dd></div>
      <div><dt>Condutividade elétrica</dt><dd>${formatNumber(point.condutividade_us_cm, 1)} <small>µS/cm</small></dd></div>
      <div><dt>Temperatura</dt><dd>${point.temperatura_c == null ? "Aguardando medição" : `${formatNumber(point.temperatura_c, 1)} °C`}</dd></div>
      <div><dt>Cor da água</dt><dd>${point.cor}</dd></div>
      <div><dt>Odor</dt><dd>${point.odor}</dd></div>
      <div><dt>Resíduos observados</dt><dd>${point.residuos}</dd></div>
    </dl>
    <p class="point-coordinates"><strong>Coordenadas:</strong> ${point.coordenadas}</p>
    <a class="point-map-link" href="https://www.google.com/maps?q=${point.latitude},${point.longitude}" target="_blank" rel="noopener noreferrer">Abrir localização no Google Maps ↗</a>
  `;
  if (state.markers[point.id]) state.markers[point.id].openPopup();
}

function renderSimpleChart(containerId, key, suffix, digits) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const valid = state.points.filter(point => Number.isFinite(Number(point[key])));
  if (!valid.length) {
    container.innerHTML = "<p>Dados ainda não disponíveis.</p>";
    return;
  }
  const max = Math.max(...valid.map(point => Number(point[key])));
  const min = Math.min(...valid.map(point => Number(point[key])));
  const range = max - min || 1;
  container.innerHTML = valid.map(point => {
    const value = Number(point[key]);
    const width = 18 + ((value - min) / range) * 72;
    return `
      <button class="chart-row" type="button" data-point="${point.id}" title="Ver ${point.nome}">
        <span class="chart-label">${point.nome.replace("Ponto ", "P")}</span>
        <span class="chart-track"><span class="chart-bar" style="width:${width}%"></span></span>
        <strong class="chart-value">${formatNumber(value, digits)}${suffix}</strong>
      </button>`;
  }).join("");
  container.querySelectorAll(".chart-row").forEach(button => {
    button.addEventListener("click", () => {
      showPoint(button.dataset.point, true);
      document.getElementById("samplingPointDetails")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

/* ============================================================
   06. FILTROS DOS RESULTADOS
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
