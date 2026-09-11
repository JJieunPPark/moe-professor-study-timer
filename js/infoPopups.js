(function () {
  const INTRO_SEEN_KEY = "professorStudyInfoIntroSeen:v1";
  const PROFESSOR_INTRO_SEEN_KEY = "professorStudyProfessorIntroSeen:v1";
  const POPUP_BASE_Z_INDEX = 120;
  const POPUP_MARGIN = 16;
  const INITIAL_OFFSET = 34;

  const popupInstances = new Map();
  let topZIndex = POPUP_BASE_Z_INDEX;
  let hasOpeningFinished = false;
  let didRunFirstVisitIntro = false;
  let professorIntroSeen = loadProfessorIntroSeen();
  let launcher = null;
  let mount = null;

  function initializeInfoPopups() {
    mount = document.getElementById("infoPopupMount") || createMount();
    launcher = document.getElementById("infoPopupButtons") || createLauncher();
    renderLauncherButtons();
    waitForOpeningFinished();
  }

  function createMount() {
    const element = document.createElement("div");
    element.id = "infoPopupMount";
    element.className = "info-popup-mount";
    document.body.appendChild(element);
    return element;
  }

  function createLauncher() {
    const element = document.createElement("div");
    element.id = "infoPopupButtons";
    element.className = "info-popup-launcher";

    const navLeft = document.querySelector(".nav-left");
    if (navLeft) {
      navLeft.appendChild(element);
    } else {
      document.body.appendChild(element);
    }

    return element;
  }

  function renderLauncherButtons() {
    if (!launcher) {
      return;
    }

    launcher.innerHTML = "";
    [
      { label: "세계관", kind: "world" },
      { label: "시스템", kind: "system" },
      { label: "개발자 노트", kind: "developer" },
      { label: "교수 소개", kind: "professor" }
    ].forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "info-popup-launch-button";
      button.textContent = item.label;
      button.addEventListener("click", () => {
        if (item.kind === "professor") {
          openProfessorPopup(getCurrentProfessorKey(), { force: true });
          return;
        }

        openPopup(item.kind, { force: true });
      });
      launcher.appendChild(button);
    });
  }

  function waitForOpeningFinished() {
    window.addEventListener("professor-opening-finished", handleOpeningFinished, { once: true });

    requestAnimationFrame(() => {
      const opening = document.getElementById("bootOpening");
      const openingApi = window.ProfessorBootOpening;
      const openingIsActive = typeof openingApi?.isActive === "function" ? openingApi.isActive() : Boolean(opening);

      if (!openingIsActive || opening?.getAttribute("aria-hidden") === "true") {
        handleOpeningFinished();
      }
    });
  }

  function handleOpeningFinished() {
    if (hasOpeningFinished) {
      return;
    }

    hasOpeningFinished = true;
    runFirstVisitIntro();
  }

  function runFirstVisitIntro() {
    if (didRunFirstVisitIntro || localStorage.getItem(INTRO_SEEN_KEY) === "true") {
      return;
    }

    didRunFirstVisitIntro = true;
    const professorKey = getCurrentProfessorKey();
    ["world", "system", "developer"].forEach((kind, index) => {
      openPopup(kind, { index, force: true });
    });
    openProfessorPopup(professorKey, { index: 3, force: true, markSeen: true });
    localStorage.setItem(INTRO_SEEN_KEY, "true");
  }

  function maybeShowProfessorIntro(professorKey) {
    if (!hasOpeningFinished) {
      return;
    }

    openProfessorPopup(professorKey, { markSeen: true });
  }

  function openProfessorPopup(professorKey, options = {}) {
    const key = normalizeProfessorKey(professorKey);
    if (!key) {
      return;
    }

    if (!options.force && professorIntroSeen[key]) {
      return;
    }

    if (options.markSeen) {
      professorIntroSeen[key] = true;
      saveProfessorIntroSeen();
    }

    openPopup(`professor:${key}`, options);
  }

  function openPopup(kind, options = {}) {
    const popupData = getPopupData(kind);
    if (!popupData) {
      return null;
    }

    let popup = popupInstances.get(kind);
    if (!popup) {
      popup = createPopup(kind, popupData, options.index ?? popupInstances.size);
      popupInstances.set(kind, popup);
      mount.appendChild(popup);
    } else {
      renderPopupContent(popup, popupData);
      popup.hidden = false;
      popup.setAttribute("aria-hidden", "false");
      if (options.index !== undefined) {
        placePopup(popup, options.index);
      }
    }

    bringToFront(popup);
    return popup;
  }

  function createPopup(kind, popupData, index) {
    const popup = document.createElement("article");
    popup.className = "info-popup-window";
    popup.dataset.infoPopup = kind;
    popup.setAttribute("aria-hidden", "false");

    const titleBar = document.createElement("header");
    titleBar.className = "info-popup-titlebar";

    const title = document.createElement("strong");
    title.className = "info-popup-window-title";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "info-popup-close";
    closeButton.setAttribute("aria-label", "닫기");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      closePopup(popup);
    });

    const imageArea = document.createElement("div");
    imageArea.className = "info-popup-image";

    const textArea = document.createElement("section");
    textArea.className = "info-popup-text";

    titleBar.appendChild(title);
    titleBar.appendChild(closeButton);
    popup.appendChild(titleBar);
    popup.appendChild(imageArea);
    popup.appendChild(textArea);

    renderPopupContent(popup, popupData);
    placePopup(popup, index);
    bindDrag(popup, titleBar);
    popup.addEventListener("pointerdown", () => bringToFront(popup));

    return popup;
  }

  function renderPopupContent(popup, popupData) {
    const title = popup.querySelector(".info-popup-window-title");
    const imageArea = popup.querySelector(".info-popup-image");
    const textArea = popup.querySelector(".info-popup-text");

    title.textContent = popupData.title;
    imageArea.innerHTML = "";
    imageArea.classList.toggle("has-image", Boolean(popupData.image));

    if (popupData.image) {
      const image = document.createElement("img");
      image.src = popupData.image;
      image.alt = popupData.title;
      imageArea.appendChild(image);
    }

    textArea.innerHTML = "";
    const heading = document.createElement("h2");
    heading.textContent = popupData.heading || popupData.title;

    const body = document.createElement("p");
    body.textContent = normalizeBody(popupData.body);

    textArea.appendChild(heading);
    if (popupData.meta) {
      const meta = document.createElement("span");
      meta.className = "info-popup-meta";
      meta.textContent = popupData.meta;
      textArea.appendChild(meta);
    }
    textArea.appendChild(body);
  }

  function placePopup(popup, index = 0) {
    const popupWidth = getPopupWidth();
    const popupHeight = getPopupHeight();
    const startX = Math.min(72, Math.max(POPUP_MARGIN, window.innerWidth - popupWidth - POPUP_MARGIN));
    const startY = Math.min(112, Math.max(POPUP_MARGIN, window.innerHeight - popupHeight - POPUP_MARGIN));
    const x = startX + index * INITIAL_OFFSET;
    const y = startY + index * INITIAL_OFFSET;

    setPopupPosition(popup, x, y);
  }

  function bindDrag(popup, titleBar) {
    let startPointerX = 0;
    let startPointerY = 0;
    let startLeft = 0;
    let startTop = 0;
    let activePointerId = null;

    titleBar.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".info-popup-close")) {
        return;
      }

      activePointerId = event.pointerId;
      startPointerX = event.clientX;
      startPointerY = event.clientY;
      startLeft = Number.parseFloat(popup.style.left) || 0;
      startTop = Number.parseFloat(popup.style.top) || 0;
      titleBar.setPointerCapture?.(event.pointerId);
      popup.classList.add("is-dragging");
      bringToFront(popup);
      event.preventDefault();
    });

    titleBar.addEventListener("pointermove", (event) => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      const nextLeft = startLeft + event.clientX - startPointerX;
      const nextTop = startTop + event.clientY - startPointerY;
      setPopupPosition(popup, nextLeft, nextTop);
    });

    const endDrag = (event) => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      activePointerId = null;
      popup.classList.remove("is-dragging");
      titleBar.releasePointerCapture?.(event.pointerId);
    };

    titleBar.addEventListener("pointerup", endDrag);
    titleBar.addEventListener("pointercancel", endDrag);
  }

  function setPopupPosition(popup, left, top) {
    const popupWidth = popup.offsetWidth || getPopupWidth();
    const popupHeight = popup.offsetHeight || getPopupHeight();
    const minVisible = Math.min(96, popupWidth * 0.4);
    const minLeft = POPUP_MARGIN - popupWidth + minVisible;
    const minTop = POPUP_MARGIN;
    const maxLeft = window.innerWidth - minVisible - POPUP_MARGIN;
    const maxTop = window.innerHeight - Math.min(60, popupHeight) - POPUP_MARGIN;

    popup.style.left = `${clamp(left, minLeft, Math.max(minLeft, maxLeft))}px`;
    popup.style.top = `${clamp(top, minTop, Math.max(minTop, maxTop))}px`;
  }

  function bringToFront(popup) {
    topZIndex += 1;
    popup.style.zIndex = String(topZIndex);
  }

  function closePopup(popup) {
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
  }

  function getPopupData(kind) {
    if (kind.startsWith("professor:")) {
      const professorKey = normalizeProfessorKey(kind.split(":")[1]);
      const professor = getProfessor(professorKey);
      const content = window.INFO_POPUP_CONTENT?.professor?.[professorKey];

      if (!professor || !content) {
        return null;
      }

      return {
        title: `${professor.name} 소개`,
        heading: professor.name,
        meta: professor.subjectLabel,
        image: content.image || "",
        body: content.body || ""
      };
    }

    return window.INFO_POPUP_CONTENT?.[kind] || null;
  }

  function getCurrentProfessorKey() {
    const selectedKey = document.getElementById("subjectButtons")?.value;
    if (normalizeProfessorKey(selectedKey)) {
      return selectedKey;
    }

    if (typeof currentProfessorKey !== "undefined" && normalizeProfessorKey(currentProfessorKey)) {
      return currentProfessorKey;
    }

    return "database";
  }

  function normalizeProfessorKey(key) {
    if (key && getProfessor(key)) {
      return key;
    }

    if (key === "programming") {
      return "algorithm";
    }

    return getProfessor("database") ? "database" : "";
  }

  function getProfessor(key) {
    if (typeof PROFESSORS === "undefined") {
      return null;
    }

    return PROFESSORS[key] || null;
  }

  function loadProfessorIntroSeen() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PROFESSOR_INTRO_SEEN_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveProfessorIntroSeen() {
    localStorage.setItem(PROFESSOR_INTRO_SEEN_KEY, JSON.stringify(professorIntroSeen));
  }

  function normalizeBody(body) {
    return String(body || "").trim();
  }

  function getPopupWidth() {
    return Math.min(Math.max(window.innerWidth * 0.24, 300), 390);
  }

  function getPopupHeight() {
    return Math.min(Math.max(window.innerHeight * 0.38, 360), 470);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  window.addEventListener("resize", () => {
    popupInstances.forEach((popup) => {
      if (!popup.hidden) {
        setPopupPosition(popup, Number.parseFloat(popup.style.left) || 0, Number.parseFloat(popup.style.top) || 0);
      }
    });
  });

  window.InfoPopups = {
    open: openPopup,
    openProfessor: (professorKey) => openProfessorPopup(professorKey, { force: true }),
    maybeShowProfessorIntro,
    handleOpeningFinished
  };

  initializeInfoPopups();
})();
