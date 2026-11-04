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

  // ---------------------------------------------------------------------
  // Valores de referência
  // pH: 6,0 a 9,0  → Resolução CONAMA nº 357/2005
  // Condutividade elétrica: < 100 µS/cm → CETESB
  // Para alterar um limite, mude só os números abaixo.
  // ---------------------------------------------------------------------
  const PH_REF = { min: 6, max: 9, text: 'Referência: 6,0 a 9,0', source: 'CONAMA nº 357/2005' };
  const COND_REF = { max: 100, text: 'Referência: abaixo de 100 µS/cm', source: 'CETESB' };

  function evaluatePh(value) {
    const v = Number(value);
    if (!Number.isFinite(v)) return null;
    if (v < PH_REF.min) {
      return {
        state: 'low',
        label: 'Abaixo da referência',
        meaning: 'pH ácido (abaixo de 6,0). Pode estar ligado à decomposição intensa de matéria orgânica ou ao lançamento de efluentes ácidos. Em pH baixo, alguns metais ficam mais disponíveis na água e os organismos aquáticos sofrem mais estresse.'
      };
    }
    if (v > PH_REF.max) {
      return {
        state: 'high',
        label: 'Acima da referência',
        meaning: 'pH alcalino (acima de 9,0). Pode estar associado ao crescimento intenso de algas, que eleva o pH durante a fotossíntese, ou ao lançamento de efluentes alcalinos. Valores muito altos podem causar estresse em peixes e outros organismos aquáticos.'
      };
    }
    return { state: 'ok', label: 'Dentro da referência', meaning: '' };
  }

  function evaluateConductivity(value) {
    const v = Number(value);
    if (!Number.isFinite(v)) return null;
    if (v >= COND_REF.max) {
      return {
        state: 'high',
        label: 'Acima da referência',
        meaning: 'Condutividade elevada indica maior quantidade de sais e íons dissolvidos na água. A CETESB associa valores a partir de 100 µS/cm a ambientes impactados, por exemplo por esgoto doméstico ou efluentes. Esse indicador sozinho não identifica a causa.'
      };
    }
    return { state: 'ok', label: 'Dentro da referência', meaning: '' };
  }

  // Bloco com a referência, o status e, se estiver fora da faixa, o significado.
  function referenceBlock(result, ref) {
    if (!result) return '';
    const isOk = result.state === 'ok';
    return `<span class="metric-reference">
        <span class="metric-ref-line"><i class="metric-ref-swatch" aria-hidden="true"></i>${ref.text} <span class="metric-ref-source">(${ref.source})</span></span>
        <span class="metric-status ${isOk ? 'is-ok' : 'is-out'}"><span aria-hidden="true">${isOk ? '✓' : '!'}</span> ${result.label}</span>
        ${result.meaning ? `<span class="metric-meaning">${result.meaning}</span>` : ''}
      </span>`;
  }

  // Barra proporcional dentro de uma escala fixa (min–max),
  // com a faixa de referência destacada (band = { from, to }).
  function scaleBar(value, min, max, minLabel, maxLabel, band) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const toPct = x => Math.min(100, Math.max(0, (x - min) / (max - min) * 100));
    const pct = Math.min(100, Math.max(2, toPct(n)));
    const bandHtml = band
      ? `<span class="metric-band" style="left:${toPct(band.from)}%;width:${toPct(band.to) - toPct(band.from)}%"></span>`
      : '';
    return `<span class="metric-gauge" aria-hidden="true"><span class="metric-bar"><span class="metric-bar-fill" style="width:${pct}%"></span></span>${bandHtml}</span>
        <span class="metric-scale" aria-hidden="true"><span>${minLabel}</span><span>${maxLabel}</span></span>`;
  }

  function showDetails(point) {
    if (!point) {
      details.innerHTML = '<p>Selecione um ponto para visualizar os resultados.</p>';
      return;
    }
    details.innerHTML = `
      <div class="point-detail-heading"><h4>${point.nome}</h4></div>
      <dl class="point-data-list">
        <div class="metric-card"><dt>pH</dt><dd>${Number(point.ph).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</dd>${scaleBar(point.ph, 0, 14, '0', '14', { from: PH_REF.min, to: PH_REF.max })}${referenceBlock(evaluatePh(point.ph), PH_REF)}</div>
        <div class="metric-card"><dt>Condutividade elétrica</dt><dd>${Number(point.condutividade_us_cm).toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1})} <small>µS/cm</small></dd>${scaleBar(point.condutividade_us_cm, 0, 500, '0', '500', { from: 0, to: COND_REF.max })}${referenceBlock(evaluateConductivity(point.condutividade_us_cm), COND_REF)}</div>
        <div><dt>Cor da água</dt><dd>${point.cor || 'Não registrado'}</dd></div>
        <div><dt>Odor</dt><dd>${point.odor || 'Não registrado'}</dd></div>
        <div><dt>Resíduos observados</dt><dd>${point.residuos || 'Não registrado'}</dd></div>
      </dl>
      <div class="point-meta-row">
        <p class="point-coordinates"><strong>Coordenadas:</strong> ${point.coordenadas || `${point.latitude}, ${point.longitude}`} <span class="point-meta-separator" aria-hidden="true"> · </span> <strong>Horário da coleta:</strong> ${point.horario_coleta || 'Não registrado'}</p>
      </div>
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

    // Símbolos coloridos no menu para corresponder aos marcadores do mapa.
    const pointColorDots = ['🔵', '🟢', '🟠', '🟣', '🔴', '🟦', '🩷', '🟢'];
    select.innerHTML = points.map((p, index) =>
      `<option value="${p.id}">${pointColorDots[index % pointColorDots.length]} ${p.nome}</option>`
    ).join('');
    if (window.L) {
      map = L.map(mapElement, {scrollWheelZoom: false}).setView([points[0].latitude, points[0].longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      }).addTo(map);
      // Marcadores coloridos: cada ponto recebe uma cor distinta, na ordem do data.json.
      const markerColors = [
        '#2784D8', // azul
        '#299764', // verde
        '#E99A32', // laranja
        '#8957C8', // roxo
        '#D94B4B', // vermelho
        '#159DA6', // turquesa
        '#C65D9E', // rosa
        '#6B7D32'  // verde-oliva
      ];

      // Remove o fundo padrão do DivIcon do Leaflet para deixar só o pin SVG.
      if (!document.getElementById('colored-point-marker-style')) {
        const markerStyle = document.createElement('style');
        markerStyle.id = 'colored-point-marker-style';
        markerStyle.textContent = `
          .leaflet-div-icon.point-marker-icon {
            background: transparent;
            border: none;
          }
        `;
        document.head.appendChild(markerStyle);
      }

      points.forEach((point, index) => {
        if (!Number.isFinite(Number(point.latitude)) || !Number.isFinite(Number(point.longitude))) return;
        const color = markerColors[index % markerColors.length];
        const pinIcon = L.divIcon({
          className: 'point-marker-icon',
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -38],
          html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 1.5C7.54 1.5 1.5 7.54 1.5 15c0 10.1 13.5 25.2 13.5 25.2S28.5 25.1 28.5 15C28.5 7.54 22.46 1.5 15 1.5Z" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>
            <circle cx="15" cy="14.5" r="5.1" fill="#ffffff" fill-opacity="0.96"/>
          </svg>`
        });
        const marker = L.marker([point.latitude, point.longitude], { icon: pinIcon }).addTo(map);
        marker.bindPopup(`<strong>${point.nome}</strong><br>Coleta: ${point.horario_coleta || 'Horário não registrado'}<br>pH: ${Number(point.ph).toLocaleString('pt-BR', {minimumFractionDigits: 2})}<br>Condutividade: ${Number(point.condutividade_us_cm).toLocaleString('pt-BR', {minimumFractionDigits: 1})} µS/cm`);
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
