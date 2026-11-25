'use strict';

// Tahap 1: helper. Data pengguna selalu di-escape sebelum masuk ke innerHTML.
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const localDate = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(new Date());
const formatDate = (date) => date ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(`${date}T00:00:00+07:00`)) : 'Tanpa tanggal';
const validDate = (date) => date === '' || (/^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date);

// Tahap 2: model dengan destructuring parameter dan nilai default.
class TaskItem {
  constructor({ id = crypto.randomUUID(), kind = 'task', title, details = '', date = '', time = '', priority = 'normal', done = false }) {
    if (!['task', 'schedule', 'note'].includes(kind) || typeof title !== 'string' || !title.trim() || title.trim().length > 100 || typeof details !== 'string' || details.length > 1000 || !validDate(date) || typeof time !== 'string' || (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) || !['normal', 'high'].includes(priority) || typeof id !== 'string' || !id || typeof done !== 'boolean') {
      throw new Error('Data tidak valid. Periksa judul, detail, tanggal, dan waktu.');
    }
    Object.assign(this, { id, kind, title: title.trim(), details: details.trim(), date, time, priority, done: kind === 'task' && done });
  }
}

// Tahap 3: controller state, penyimpanan, UI, dan operasi API.
class DashboardApp {
  constructor() {
    this.key = 'ruang-fokus:v1';
    this.kind = 'task';
    this.pendingDelete = null;
    this.items = this.load();
    this.bindEvents();
    this.render();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadTheme();
    this.fetchWeather();
  }

  notify = (message) => { $('#message').textContent = message; };

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw === null) return []; // Tidak mengisi tugas contoh seolah-olah milik pengguna.
      const data = JSON.parse(raw);
      if (data.version !== 1 || !Array.isArray(data.items)) throw new Error('Format penyimpanan tidak dikenali.');
      const items = data.items.map((item) => new TaskItem(item));
      if (new Set(items.map(({ id }) => id)).size !== items.length) throw new Error('ID ganda.');
      return items;
    } catch (error) {
      // Jangan menimpa data rusak secara diam-diam.
      this.storageBlocked = true;
      this.notify('Data lokal tidak bisa dibaca. Data asli dipertahankan; periksa izin browser atau penyimpanan melalui DevTools.');
      return [];
    }
  }

  commit(nextItems) {
    if (this.storageBlocked) { this.notify('Penyimpanan diblokir karena data sebelumnya gagal dibaca. Pulihkan data atau hapus key ruang-fokus:v1 melalui DevTools, lalu muat ulang.'); return false; }
    try {
      localStorage.setItem(this.key, JSON.stringify({ version: 1, items: nextItems }));
      this.items = nextItems; // State berubah hanya setelah penyimpanan berhasil.
      this.render();
      return true;
    } catch (error) {
      this.notify('Gagal menyimpan. Penyimpanan browser penuh atau tidak diizinkan; perubahan belum diterapkan.');
      return false;
    }
  }

  bindEvents() {
    $('#add').addEventListener('click', () => this.openEditor());
    $('#close').addEventListener('click', () => $('#editor').close());
    $('#item-form').addEventListener('submit', (event) => this.saveItem(event));
    $('#search').addEventListener('input', () => this.render());
    $('#filter').addEventListener('change', () => this.render());
    document.querySelectorAll('[data-kind]').forEach((button) => button.addEventListener('click', () => {
      this.kind = button.dataset.kind;
      document.querySelectorAll('[data-kind]').forEach((tab) => {
        const selected = tab.dataset.kind === this.kind;
        tab.classList.toggle('selected', selected);
        tab.setAttribute('aria-pressed', String(selected));
      });
      $('#filter').hidden = this.kind !== 'task';
      this.render();
    }));
    $('#items').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const item = this.items.find(({ id }) => id === button.dataset.id);
      if (!item) return;
      if (button.dataset.action === 'edit') this.openEditor(item);
      if (button.dataset.action === 'delete') {
        this.pendingDelete = item.id;
        $('#delete-title').textContent = item.title;
        $('#delete-dialog').showModal();
      }
    });
    $('#items').addEventListener('change', (event) => {
      if (event.target.matches('input[data-toggle]')) {
        const next = this.items.map((item) => item.id === event.target.dataset.toggle ? new TaskItem({ ...item, done: !item.done }) : item);
        if (this.commit(next)) this.notify('Status tugas diperbarui.');
        else this.render();
      }
    });
    $('#cancel-delete').addEventListener('click', () => $('#delete-dialog').close());
    $('#confirm-delete').addEventListener('click', () => {
      if (this.commit(this.items.filter(({ id }) => id !== this.pendingDelete))) {
        $('#delete-dialog').close();
        this.pendingDelete = null;
        this.notify('Informasi dihapus.');
      }
    });
    $('#refresh').addEventListener('click', () => this.fetchWeather());
    $('#theme').addEventListener('click', () => {
      const dark = document.body.classList.toggle('dark');
      try { localStorage.setItem('ruang-fokus:theme', dark ? 'dark' : 'light'); }
      catch (error) { this.notify('Tema berubah untuk sesi ini; preferensi gagal disimpan.'); }
    });
    // Tab lain memuat ulang state tanpa menulis data kembali.
    window.addEventListener('storage', ({ key }) => {
      if (key === this.key || key === null) {
        this.storageBlocked = false;
        this.items = this.load();
        this.render();
      }
    });
  }

  openEditor(item = null) {
    const form = $('#item-form');
    form.reset();
    const values = item ?? { id: '', kind: this.kind, title: '', details: '', date: '', time: '', priority: 'normal' };
    ['id', 'kind', 'title', 'details', 'date', 'time', 'priority'].forEach((key) => { form.elements.namedItem(key).value = values[key]; });
    $('#form-title').textContent = item ? 'Edit informasi' : 'Tambah informasi';
    $('#editor').showModal();
    form.elements.namedItem('title').focus();
  }

  saveItem(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const previous = this.items.find(({ id }) => id === values.id);
    try {
      const item = new TaskItem({ ...values, id: previous?.id ?? crypto.randomUUID(), done: previous?.done ?? false });
      const next = previous ? this.items.map((old) => old.id === item.id ? item : old) : [...this.items, item];
      if (this.commit(next)) {
        $('#editor').close();
        this.notify(previous ? 'Informasi diperbarui.' : 'Informasi ditambahkan. Pilih tab jenis informasi untuk melihatnya.');
      }
    } catch (error) { this.notify(error.message); alert(error.message); }
  }

  render() {
    const query = $('#search').value.trim().toLocaleLowerCase('id');
    const status = $('#filter').value;
    const visible = this.items.filter(({ kind, title, details, done }) => kind === this.kind && `${title} ${details}`.toLocaleLowerCase('id').includes(query) && (kind !== 'task' || status === 'all' || (status === 'done' ? done : !done)));
    // Salinan array untuk pengurutan; state asli tidak dimutasi.
    const sorted = [...visible].sort((a, b) => Number(a.done) - Number(b.done) || (a.date || '9999').localeCompare(b.date || '9999') || a.time.localeCompare(b.time));
    $('#items').innerHTML = sorted.length ? sorted.map(({ id, title, details, date, time, priority, done, kind }) => {
      const safeId = escapeHTML(id);
      const overdue = kind === 'task' && date && date < localDate() && !done;
      return `<article class="item ${done ? 'completed' : ''}">${kind === 'task' ? `<input type="checkbox" data-toggle="${safeId}" ${done ? 'checked' : ''} aria-label="Tandai tugas ${escapeHTML(title)} selesai">` : '<span aria-hidden="true">◇</span>'}<div class="body"><h3>${escapeHTML(title)}</h3>${details ? `<p>${escapeHTML(details)}</p>` : ''}<div class="meta"><span>${escapeHTML(formatDate(date))}${time ? ` · ${escapeHTML(time)} WIB` : ''}</span><span class="badge ${priority === 'high' ? 'high' : ''}">${priority === 'high' ? 'Prioritas tinggi' : 'Normal'}</span>${overdue ? '<span class="high badge">Lewat tenggat</span>' : ''}${done ? '<span class="badge">Selesai</span>' : ''}</div></div><div class="actions"><button data-action="edit" data-id="${safeId}" aria-label="Edit ${escapeHTML(title)}">Edit</button><button class="delete" data-action="delete" data-id="${safeId}" aria-label="Hapus ${escapeHTML(title)}">Hapus</button></div></article>`;
    }).join('') : '<div class="empty"><strong>Ruang untuk rencana baru ✦</strong><p>Belum ada informasi yang cocok. Tambahkan aktivitas atau ubah pencarian.</p></div>';
    $('#active').textContent = this.items.filter(({ kind, done }) => kind === 'task' && !done).length;
    $('#done').textContent = this.items.filter(({ kind, done }) => kind === 'task' && done).length;
    $('#schedule-count').textContent = this.items.filter(({ kind }) => kind === 'schedule').length;
    $('#result-count').textContent = `${sorted.length} informasi ditampilkan`;
  }

  updateClock() {
    const now = new Date();
    $('#clock').textContent = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(now);
    $('#today').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(now);
  }

  loadTheme() {
    try { document.body.classList.toggle('dark', localStorage.getItem('ruang-fokus:theme') === 'dark'); }
    catch (error) { this.notify('Preferensi tema tidak dapat dibaca.'); }
  }

  // Tahap 4: API nyata dengan timeout, validasi respons, dan penanganan kegagalan.
  async fetchWeather() {
    const button = $('#refresh');
    button.disabled = true;
    $('#weather-status').textContent = 'Memuat cuaca…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true&timezone=Asia%2FJakarta', { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { current_weather: weather } = await response.json();
      if (!weather || !Number.isFinite(weather.temperature) || !Number.isFinite(weather.weathercode) || typeof weather.time !== 'string') throw new Error('Respons cuaca tidak valid.');
      const code = weather.weathercode;
      let description = 'Kondisi lainnya';
      if (code === 0) description = 'Cerah';
      else if (code <= 3) description = 'Berawan';
      else if ([45, 48].includes(code)) description = 'Berkabut';
      else if (code >= 51 && code <= 67) description = 'Gerimis / hujan';
      else if (code >= 71 && code <= 77) description = 'Salju';
      else if (code >= 80 && code <= 82) description = 'Hujan lokal';
      else if (code >= 85 && code <= 86) description = 'Hujan salju';
      else if (code >= 95) description = 'Badai petir';
      $('#temperature').textContent = `${weather.temperature.toFixed(1)} °C`;
      $('#weather-status').textContent = `${description} · ${weather.time.slice(11, 16)} WIB`;
    } catch (error) {
      $('#temperature').textContent = '—';
      $('#weather-status').textContent = 'Cuaca tidak tersedia. Coba muat ulang.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
    }
  }
}

const app = new DashboardApp();
