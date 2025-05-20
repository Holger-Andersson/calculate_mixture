class TimerWidget {
  constructor(rootSelector) {
    this.container = document.querySelector(rootSelector);
    this.container.innerHTML = `
      <div class="timer-widget">
        <div class="controls">
          <input id="projectInput" type="text" placeholder="Projektnummer" required>
          <input id="descriptionInput" type="text" placeholder="Beskrivning">
          <div id="timerDisplay" class="timer-display">00:00:00</div>
          <div class="buttons">
            <button id="startBtn" disabled>Start</button>
            <button id="stopBtn" disabled>Stop</button>
            <button id="saveBtn" disabled>Spara</button>
          </div>
        </div>
        <ul id="timeList" class="time-list"></ul>
      </div>
    `;
    this.projectInput     = this.container.querySelector('#projectInput');
    this.descriptionInput = this.container.querySelector('#descriptionInput');
    this.timerDisplay     = this.container.querySelector('#timerDisplay');
    this.startBtn         = this.container.querySelector('#startBtn');
    this.stopBtn          = this.container.querySelector('#stopBtn');
    this.saveBtn          = this.container.querySelector('#saveBtn');
    this.timeList         = this.container.querySelector('#timeList');

    this.interval  = null;
    this.startTime = 0;
    this.elapsed   = 0;
    const stored   = localStorage.getItem('timerRecords');
    this.records   = stored ? JSON.parse(stored) : [];

    this._bindEvents();
    this._renderList();
  }

  _bindEvents() {
    this.projectInput.addEventListener('input', () => {
      this.startBtn.disabled = !this.projectInput.value.trim();
    });
    this.startBtn.addEventListener('click', () => this._start());
    this.stopBtn .addEventListener('click', () => this._stop());
    this.saveBtn .addEventListener('click', () => this._save());
  }

  _formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  _updateDisplay() {
    this.elapsed = Date.now() - this.startTime;
    this.timerDisplay.textContent = this._formatTime(this.elapsed);
  }

  _start() {
    this.startTime = Date.now() - this.elapsed;
    this.interval  = setInterval(() => this._updateDisplay(), 500);
    this.startBtn.disabled = true;
    this.stopBtn .disabled = false;
    this.saveBtn .disabled = true;
  }

  _stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.startBtn.disabled = false;
    this.stopBtn .disabled = true;
    this.saveBtn .disabled = false;
  }

  _save() {
    const project     = this.projectInput.value.trim();
    const description = this.descriptionInput.value.trim();
    const timeStr     = this.timerDisplay.textContent;
    const timestamp   = new Date().toLocaleString('sv-SE');
    this.records.push({ project, description, time: timeStr, timestamp });
    localStorage.setItem('timerRecords', JSON.stringify(this.records));
    this._renderList();
    this._reset();
  }

  _renderList() {
    this.timeList.innerHTML = '';
    this.records.forEach((rec, idx) => {
      const li = document.createElement('li');
      li.className = 'time-item';
      li.innerHTML = `
        <div class="info">
          <div class="proj">Projekt: <strong>${rec.project}</strong></div>
          <div class="time">${rec.time}</div>
          ${rec.description ? `<div class="desc">${rec.description}</div>` : ''}
          <div class="ts">${rec.timestamp}</div>
        </div>
        <button class="delete-btn" data-idx="${idx}" title="Ta bort">×</button>
      `;
      this.timeList.appendChild(li);
    });
    this.timeList.querySelectorAll('.delete-btn')
      .forEach(btn => btn.addEventListener('click', e => this._delete(e)));
  }

  _delete(event) {
    const idx = +event.currentTarget.dataset.idx;
    this.records.splice(idx, 1);
    localStorage.setItem('timerRecords', JSON.stringify(this.records));
    this._renderList();
  }

  _reset() {
    this.elapsed = 0;
    this.timerDisplay.textContent = '00:00:00';
    this.projectInput.value = '';
    this.descriptionInput.value = '';
    this.saveBtn .disabled = true;
    this.startBtn.disabled = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TimerWidget('#timer-widget');
});
