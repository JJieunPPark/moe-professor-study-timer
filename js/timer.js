const TIMER_SETTINGS = {
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4
};

class StudyTimer {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.mode = "focus";
    this.remainingSeconds = TIMER_SETTINGS.focusMinutes * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.completedFocusCount = 0;
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.callbacks.onStart(this.mode);
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (!this.isRunning) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.callbacks.onPause(this.mode);
  }

  reset() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.remainingSeconds = this.getModeSeconds();
    this.callbacks.onReset(this.mode, this.remainingSeconds);
  }

  toggleMode() {
    const nextMode = this.mode === "focus" ? "break" : "focus";
    this.setMode(nextMode);
  }

  setMode(mode) {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.mode = mode;
    this.remainingSeconds = this.getModeSeconds();
    this.callbacks.onModeChange(this.mode, this.remainingSeconds);
  }

  tick() {
    this.remainingSeconds -= 1;
    this.callbacks.onTick(this.remainingSeconds);

    if (this.remainingSeconds <= 0) {
      this.finishCurrentMode();
    }
  }

  finishCurrentMode() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;

    if (this.mode === "focus") {
      this.completedFocusCount += 1;
      this.callbacks.onFocusComplete(TIMER_SETTINGS.focusMinutes);
      this.mode = "break";
      this.remainingSeconds = this.getModeSeconds();
      this.callbacks.onModeChange(this.mode, this.remainingSeconds, "autoAfterFocus");
      return;
    }

    this.mode = "focus";
    this.remainingSeconds = this.getModeSeconds();
    this.callbacks.onModeChange(this.mode, this.remainingSeconds);
  }

  getModeSeconds() {
    if (this.mode === "focus") {
      return TIMER_SETTINGS.focusMinutes * 60;
    }

    const shouldUseLongBreak = this.completedFocusCount > 0
      && this.completedFocusCount % TIMER_SETTINGS.sessionsBeforeLongBreak === 0;

    return (shouldUseLongBreak ? TIMER_SETTINGS.longBreakMinutes : TIMER_SETTINGS.breakMinutes) * 60;
  }
}
