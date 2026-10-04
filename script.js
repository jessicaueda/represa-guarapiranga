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
