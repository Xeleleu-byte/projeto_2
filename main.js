
/**
 * COSMOSDEV — MAIN.JS
 * Compatível com o index.html e o style.css revisados.
 * JavaScript puro, sem bibliotecas externas.
 */

(() => {
  "use strict";

  function iniciarCosmosDEV() {
    const html = document.documentElement;
    const header = document.querySelector(".site-header");
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector(".rodape");
    const sections = [...document.querySelectorAll("main section[id]")];

    const mobile = window.matchMedia("(max-width: 760px)");
    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    html.classList.add("has-js");

    // ==========================================
    // 1. MENU MOBILE
    // ==========================================

    if (header && navbar) {
      if (!navbar.id) {
        navbar.id = "menu-cosmosdev";
      }

      const botaoMenu = document.createElement("button");

      botaoMenu.type = "button";
      botaoMenu.className = "menu-toggle";

      botaoMenu.setAttribute("aria-controls", navbar.id);
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute(
        "aria-label",
        "Abrir menu de navegação"
      );

      botaoMenu.innerHTML = `
        <span class="menu-toggle-bars" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      `;

      header.insertBefore(botaoMenu, navbar);

      // Botão de orçamento no menu mobile
      const linkOrcamento = document.createElement("a");

      linkOrcamento.className = "menu-cta";
      linkOrcamento.href = "#contato";
      linkOrcamento.textContent = "Solicitar Orçamento ↗";

      navbar.appendChild(linkOrcamento);

      function mudarMenu(aberto, devolverFoco = false) {
        botaoMenu.classList.toggle("is-open", aberto);
        navbar.classList.toggle("is-open", aberto);

        botaoMenu.setAttribute(
          "aria-expanded",
          String(aberto)
        );

        botaoMenu.setAttribute(
          "aria-label",
          aberto
            ? "Fechar menu de navegação"
            : "Abrir menu de navegação"
        );

        if (!aberto && devolverFoco) {
          botaoMenu.focus();
        }
      }

      // Abrir e fechar menu
      botaoMenu.addEventListener("click", () => {
        const aberto =
          botaoMenu.getAttribute("aria-expanded") === "true";

        mudarMenu(!aberto);
      });

      // Fechar ao clicar em algum link
      navbar.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => {
          mudarMenu(false);
        });
      });

      // Fechar com ESC
      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          botaoMenu.getAttribute("aria-expanded") === "true"
        ) {
          mudarMenu(false, true);
        }
      });

      // Fechar ao clicar fora
      document.addEventListener("click", (event) => {
        const aberto =
          botaoMenu.getAttribute("aria-expanded") === "true";

        if (aberto && !header.contains(event.target)) {
          mudarMenu(false);
        }
      });

      // Fechar ao voltar para desktop
      function fecharNoDesktop() {
        if (!mobile.matches) {
          mudarMenu(false);
        }
      }

      if (mobile.addEventListener) {
        mobile.addEventListener("change", fecharNoDesktop);
      } else {
        mobile.addListener(fecharNoDesktop);
      }
    }

    // ==========================================
    // 2. NAVBAR DINÂMICA
    // ==========================================

    const linksNavegacao = [
      ...document.querySelectorAll(
        '.navbar a[href^="#"], .rodape nav a[href^="#"]'
      )
    ];

    let scrollAgendado = false;

    function atualizarNavegacao() {
      // Navbar ganha efeito ao rolar
      if (header) {
        header.classList.toggle(
          "scrolled",
          window.scrollY > 24
        );
      }

      let idAtivo = sections[0]?.id;

      const alturaHeader =
        (header?.getBoundingClientRect().height ?? 90) + 45;

      // Identificar seção visível
      for (const section of sections) {
        if (
          section.getBoundingClientRect().top <= alturaHeader
        ) {
          idAtivo = section.id;
        }
      }

      // Identificar fim da página
      const noFinal =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 12;

      if (noFinal && sections.length) {
        idAtivo = sections[sections.length - 1].id;
      }

      // Destacar link ativo
      linksNavegacao.forEach((link) => {
        const ativo =
          link.getAttribute("href") === `#${idAtivo}`;

        link.classList.toggle("is-active", ativo);

        if (ativo) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      scrollAgendado = false;
    }

    function solicitarAtualizacao() {
      if (!scrollAgendado) {
        scrollAgendado = true;

        window.requestAnimationFrame(
          atualizarNavegacao
        );
      }
    }

    window.addEventListener(
      "scroll",
      solicitarAtualizacao,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      solicitarAtualizacao,
      { passive: true }
    );

    atualizarNavegacao();

    // ==========================================
    // 3. ANIMAÇÕES AO ROLAR A PÁGINA
    // ==========================================

    if (
      "IntersectionObserver" in window &&
      !movimentoReduzido.matches
    ) {
      const elementosAnimados = document.querySelectorAll(
        ".servicos-cards .card, " +
        ".portfolio-cards .projeto, " +
        ".etapas .etapa, " +
        ".cardEnd > .card"
      );

      const observador = new IntersectionObserver(
        (entradas, observer) => {
          for (const entrada of entradas) {
            if (!entrada.isIntersecting) continue;

            entrada.target.classList.add(
              "is-revealed"
            );

            observer.unobserve(entrada.target);
          }
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -35px 0px"
        }
      );

      elementosAnimados.forEach(
        (elemento, indice) => {
          elemento.classList.add(
            "reveal-on-scroll"
          );

          elemento.style.setProperty(
            "--reveal-delay",
            `${(indice % 4) * 65}ms`
          );

          observador.observe(elemento);
        }
      );
    }

    // ==========================================
    // 4. BOTÃO VOLTAR AO TOPO
    // ==========================================

    const voltarTopo = document.createElement("button");

    voltarTopo.type = "button";
    voltarTopo.className = "voltar-topo";
    voltarTopo.textContent = "↑";

    voltarTopo.setAttribute(
      "aria-label",
      "Voltar ao início da página"
    );

    voltarTopo.title = "Voltar ao topo";

    document.body.appendChild(voltarTopo);

    function atualizarVoltarTopo() {
      voltarTopo.classList.toggle(
        "is-visible",
        window.scrollY > 650
      );
    }

    window.addEventListener(
      "scroll",
      atualizarVoltarTopo,
      { passive: true }
    );

    atualizarVoltarTopo();

    voltarTopo.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: movimentoReduzido.matches
          ? "auto"
          : "smooth"
      });
    });

    // ==========================================
    // 5. ANO AUTOMÁTICO NO RODAPÉ
    // ==========================================

    const textoCopyright = footer?.querySelector(
      ":scope > p"
    );

    if (textoCopyright) {
      textoCopyright.textContent =
        `© ${new Date().getFullYear()} CosmosDEV. ` +
        "Todos os direitos reservados.";
    }
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciarCosmosDEV,
      { once: true }
    );
  } else {
    iniciarCosmosDEV();
  }
})();
