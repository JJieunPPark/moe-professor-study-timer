(function () {
  const MAX_BOOT_LINES = 120;
  const REDUCED_MOTION = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  const SOUND_API_ENDPOINT = "/api/opening-sounds";

  const bootOpening = document.getElementById("bootOpening");
  const bootStartButton = document.getElementById("bootStartButton");
  const bootSkipButton = document.getElementById("bootSkipButton");
  const bootTerminal = document.getElementById("bootTerminal");
  const bootLog = document.getElementById("bootLog");
  const bootPanic = document.getElementById("bootPanic");

  if (!bootOpening || !bootStartButton || !bootSkipButton || !bootTerminal || !bootLog || !bootPanic) {
    return;
  }

  const bootSounds = {};
  const activeSounds = new Set();
  const timeouts = new Set();
  let hasStarted = false;
  let hasFinished = false;
  let lineCount = 0;

  const normalBootLines = [
    { text: "[    0.000000] Linux version 6.8.0-professor-study (build@tty0) (gcc 13.2.0) #1 SMP PREEMPT_DYNAMIC", delay: 160 },
    { text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/sda1 ro quiet splash=0", delay: 180 },
    { text: "[    0.012894] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'", delay: 150 },
    { text: "[    0.026117] BIOS-provided physical RAM map:", delay: 130 },
    { text: "[    0.031808] BIOS-e820: [mem 0x0000000000001000-0x000000000009fbff] usable", delay: 120 },
    { text: "[    0.041820] ACPI: Early table checksum verification disabled", delay: 150 },
    { text: "[    0.063944] smpboot: CPU0: Virtual Professor Core (family: 0x6, model: 0x9e)", delay: 170 },
    { text: "[    0.092313] Memory: 8123456K/8388608K available", delay: 160 },
    { text: "[    0.127821] random: crng init done", delay: 120 },
    { text: "[    0.165820] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x1f", delay: 130 },
    { text: "[    0.201532] EXT4-fs (sda1): mounted filesystem with ordered data mode", delay: 160 },
    { text: "[    0.243904] systemd[1]: systemd 255.4 running in system mode.", delay: 190 },
    { text: "[    0.282114] systemd[1]: Detected architecture x86-64.", delay: 130 },
    { text: "[  OK  ] Reached target Local File Systems.", delay: 150, type: "ok" },
    { text: "[  OK  ] Reached target System Initialization.", delay: 140, type: "ok" },
    { text: "[  OK  ] Started Network Manager.", delay: 150, type: "ok" },
    { text: "[  OK  ] Started User Login Management.", delay: 140, type: "ok" },
    { text: "[  OK  ] Mounted /home/student.", delay: 130, type: "ok" },
    { text: "[  OK  ] Started professor-database.service.", delay: 145, type: "ok" },
    { text: "[  OK  ] Started professor-os.service.", delay: 145, type: "ok" },
    { text: "[  OK  ] Started professor-graphics.service.", delay: 145, type: "ok" },
    { text: "[  OK  ] Started professor-algorithm.service.", delay: 145, type: "ok" },
    { text: "[    1.033172] professor-study[351]: restored royal progress cache", delay: 190 },
    { text: "[    1.089421] professor-study[351]: focus timer initialized", delay: 170 },
    { text: "[  OK  ] Reached target Professor Study Timer.", delay: 180, type: "ok" },
    { text: "[FAILED] Failed to start motivation.service.", delay: 460, type: "failed", sound: "warning" },
    { text: "         See 'systemctl status motivation.service' for details.", delay: 420, type: "warning" },
    { text: "[DEPEND] Dependency failed for focus.target.", delay: 310, type: "warning" },
    { text: "[FAILED] Failed to start professor-deployment.service.", delay: 270, type: "failed" },
    { text: "[    2.411308] professor-kernel: retrying deployment", delay: 220, type: "warning" },
    { text: "[    2.486201] professor-kernel: retrying deployment", delay: 170, type: "warning" },
    { text: "[    2.548982] professor-kernel: retrying deployment", delay: 130, type: "warning" }
  ];

  const panicLines = [
    "professor-deployment.service: Main process exited, code=exited, status=1/FAILURE",
    "professor-deployment.service: Failed with result 'exit-code'.",
    "focus.service: Scheduled restart job, restart counter is at 4.",
    "focus.service: Start request repeated too quickly.",
    "[FAILED] Failed to start professor-deployment.service.",
    "[DEPEND] Dependency failed for classroom.target.",
    "professor-kernel: student_session blocked for more than 120 seconds.",
    "professor-kernel: task focus_loop:381 blocked on attention_mutex",
    "BUG: unable to handle kernel NULL pointer dereference at 0000000000000000",
    "#PF: supervisor instruction fetch in kernel mode",
    "RIP: 0010:deploy_professor+0x2f/0x90",
    "Code: 48 8b 04 25 00 00 00 00 48 85 c0 74 17 e8 9a 00 00 00",
    "Call Trace:",
    "  <TASK>",
    "  focus_start+0x41/0xb0",
    "  lecture_loop+0x18/0x60",
    "  student_session+0x2a/0x80",
    "  do_syscall_64+0x58/0x90",
    "  entry_SYSCALL_64_after_hwframe+0x6e/0xd8",
    "  </TASK>",
    "Kernel panic - not syncing: Professor process not responding",
    "CPU: 0 PID: 351 Comm: professor-study Not tainted 6.8.0-professor-study #1",
    "panic: lecture_stack overflow",
    "RESTARTING",
    "RESTARTING",
    "FAILED",
    "FAILED",
    "professor-kernel: retrying...",
    "professor-kernel: retrying..."
  ];

  function spawnKernelWindows() {
  const count = REDUCED_MOTION ? 3 : 12;

  for (let index = 0; index < count; index += 1) {
    schedule(() => {
      const clone = bootTerminal.cloneNode(true);

      clone.removeAttribute("id");
      clone.classList.add("boot-opening__terminal-clone");
      clone.setAttribute("aria-hidden", "true");

      const x = 8 + index * 14 + Math.random() * 10;
      const y = 6 + index * 10 + Math.random() * 8;

      clone.style.left = `${x}px`;
      clone.style.top = `${y}px`;

      bootOpening.appendChild(clone);

      requestAnimationFrame(() => {
        clone.classList.add("is-visible");
      });
    }, index * (REDUCED_MOTION ? 30 : 90));
  }
}

  function schedule(callback, delay) {
    const timeoutId = window.setTimeout(() => {
      timeouts.delete(timeoutId);
      callback();
    }, REDUCED_MOTION ? Math.min(delay, 30) : delay);

    timeouts.add(timeoutId);
    return timeoutId;
  }

  function clearOpeningTimers() {
    timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeouts.clear();
  }

  function stopOpeningSounds() {
    activeSounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeSounds.clear();
  }

  function appendBootLine(text, type = "") {
    const line = document.createElement("span");
    line.className = `boot-opening__line${type ? ` is-${type}` : ""}`;
    line.textContent = text || " ";
    bootLog.appendChild(line);
    lineCount += 1;

    if (lineCount > MAX_BOOT_LINES) {
      bootLog.firstElementChild?.remove();
      lineCount -= 1;
    }

    bootLog.scrollTop = bootLog.scrollHeight;
  }

  async function loadOpeningSounds() {
    try {
      if (typeof window.fetch !== "function") {
        return;
      }

      const response = await window.fetch(SOUND_API_ENDPOINT, { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      Object.assign(bootSounds, payload.sounds || {});
    } catch (error) {
      // Optional opening sounds should never block the boot animation.
    }
  }

  function playOpeningSound(name) {
    const src = bootSounds[name];
    if (!src) {
      return;
    }

    const audio = new Audio(src);
    audio.volume = name === "explosion" ? 0.55 : 0.32;
    activeSounds.add(audio);

    const cleanup = () => activeSounds.delete(audio);
    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
    audio.play().catch(cleanup);
  }

  function startBootSequence() {
    if (hasStarted || hasFinished) {
      return;
    }

    hasStarted = true;
    bootOpening.classList.add("is-running");
    bootTerminal.setAttribute("aria-hidden", "false");
    bootSkipButton.hidden = false;
    playOpeningSound("boot");

    let elapsed = 0;
    normalBootLines.forEach((line) => {
      elapsed += line.delay;
      schedule(() => {
        appendBootLine(line.text, line.type);
        if (line.sound) {
          playOpeningSound(line.sound);
        }
      }, elapsed);
    });

    schedule(startLogStorm, elapsed + 180);
  }

  function startLogStorm() {
    playOpeningSound("error");

    const stormCount = REDUCED_MOTION ? 18 : 72;
    for (let index = 0; index < stormCount; index += 1) {
      const delay = REDUCED_MOTION ? index * 12 : Math.max(18, 82 - index);
      schedule(() => {
        const text = panicLines[index % panicLines.length];
        const type = text.includes("[FAILED]") || text.includes("panic") || text.includes("BUG:")
          ? "error"
          : text.includes("[DEPEND]") || text.includes("blocked")
            ? "warning"
            : "";
        appendBootLine(text, type);
        if (index > 24) {
          bootLog.lastElementChild?.classList.add("is-glitch");
        }
      }, index * delay);
    }

    schedule(showKernelPanic, REDUCED_MOTION ? 360 : 2650);
  }

  function showKernelPanic() {
  if (hasFinished) {
    return;
  }

  bootOpening.classList.add("has-panic");
  bootPanic.setAttribute("aria-hidden", "true");

  schedule(spawnKernelWindows, REDUCED_MOTION ? 20 : 160);

  schedule(() => {
    bootOpening.classList.add("is-crashing");
  }, REDUCED_MOTION ? 60 : 220);

  schedule(() => {
    appendBootLine("");
    appendBootLine("[    4.000001] professor-kernel: PROFESSOR FOUND.", "ok");
  }, REDUCED_MOTION ? 120 : 760);

  schedule(() => {
    bootOpening.classList.remove("is-crashing");
    finishOpening({ flash: true });
  }, REDUCED_MOTION ? 220 : 1250);
}

  function finishOpening({ flash = false } = {}) {
  if (hasFinished) {
    return;
  }

  hasFinished = true;
  clearOpeningTimers();
  stopOpeningSounds();

  if (flash && !REDUCED_MOTION) {
    playOpeningSound("explosion");
    bootOpening.classList.add("is-flashing", "is-shaking");

    schedule(hideOpening, 850);
    return;
  }

  hideOpening();
}

  function hideOpening() {
    bootOpening.setAttribute("aria-hidden", "true");
    bootSkipButton.hidden = true;
    schedule(() => {
      bootOpening.remove();
      window.dispatchEvent(new CustomEvent("professor-opening-finished"));
    }, 700);
  }

  function skipOpening() {
    finishOpening({ flash: false });
  }

  bootStartButton.addEventListener("click", startBootSequence);
  bootSkipButton.addEventListener("click", skipOpening);
  document.addEventListener("keydown", (event) => {
    if (hasStarted || hasFinished) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startBootSequence();
    }
  });

  loadOpeningSounds();

  window.ProfessorBootOpening = {
    isActive: () => !hasFinished,
    playOpeningSound,
    skip: skipOpening
  };
})();
