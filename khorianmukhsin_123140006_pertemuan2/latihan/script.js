'use strict';

const API_BASE = 'https://dummyjson.com';
const PAGE_SIZE = 6;
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// 1. Penundaan yang bisa dibatalkan ketika pencarian diganti.
const wait = (milliseconds, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(new DOMException('Dibatalkan', 'AbortError'));
  const onAbort = () => { clearTimeout(timer); reject(new DOMException('Dibatalkan', 'AbortError')); };
  const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, milliseconds);
  signal?.addEventListener('abort', onAbort, { once: true });
});

class HttpError extends Error {
  constructor(status) { super(`Server mengembalikan HTTP ${status}.`); this.status = status; }
}

// 2. Retry maksimal dua kali: request awal + retry 1 detik + retry 2 detik.
async function fetchWithRetry(url, { signal, retries = 2, baseDelay = 1000, onRetry = () => {} } = {}) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (signal?.aborted) throw new DOMException('Dibatalkan', 'AbortError');
    const requestController = new AbortController();
    const abortRequest = () => requestController.abort();
    signal?.addEventListener('abort', abortRequest, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; requestController.abort(); }, 8000);
    try {
      const response = await fetch(url, { signal: requestController.signal });
      if (!response.ok) throw new HttpError(response.status);
      return await response.json();
    } catch (error) {
      if (signal?.aborted) throw new DOMException('Dibatalkan', 'AbortError');
      const retryable = timedOut || error instanceof TypeError || (error instanceof HttpError && (error.status === 408 || error.status === 429 || error.status >= 500));
      if (!retryable || attempt === retries) {
        if (timedOut) throw new Error('Waktu tunggu server habis. Silakan coba lagi.');
        throw error;
      }
      const delay = baseDelay * (2 ** attempt);
      onRetry({ attempt: attempt + 1, delay });
      // Bersihkan timer request sebelum periode backoff.
      clearTimeout(timer);
      signal?.removeEventListener('abort', abortRequest);
      await wait(delay, signal);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abortRequest);
    }
  }
}

// 3. Multi-endpoint dijalankan paralel, lalu digabungkan lewat post.userId.
async function fetchCombinedPosts({ query, page, signal, onRetry }) {
  const parameters = new URLSearchParams({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE });
  if (query) parameters.set('q', query);
  const path = query ? '/posts/search' : '/posts';
  const [postData, userData] = await Promise.all([
    fetchWithRetry(`${API_BASE}${path}?${parameters}`, { signal, onRetry }),
    fetchWithRetry(`${API_BASE}/users?limit=0&select=id,firstName,lastName`, { signal, onRetry })
  ]);
  if (!Array.isArray(postData.posts) || !Number.isInteger(postData.total) || postData.total < 0 || !Array.isArray(userData.users)) throw new Error('Format respons API tidak sesuai.');
  const users = new Map(userData.users.map(({ id, firstName, lastName }) => [id, `${firstName} ${lastName}`]));
  const posts = postData.posts.map((post) => {
    if (!Number.isInteger(post.id) || typeof post.title !== 'string' || typeof post.body !== 'string' || !Array.isArray(post.tags) || !post.tags.every((tag) => typeof tag === 'string')) throw new Error('Data postingan tidak valid.');
    return { ...post, author: users.get(post.userId) ?? 'Pengguna tidak ditemukan' };
  });
  return { posts, total: postData.total };
}

// 4. Debounce hanya menjalankan pencarian terakhir setelah 500 ms.
const debounce = (callback, delay = 500) => {
  let timer;
  const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
};

// Batas penanganan error async untuk halaman ini (bukan React Error Boundary).
class AsyncErrorBoundary {
  clear() { $('#error').hidden = true; $('#error-message').textContent = ''; }
  show(error) {
    $('#error-message').textContent = error instanceof TypeError ? 'Koneksi gagal. Periksa internet atau ketersediaan API, lalu coba lagi.' : error.message || 'Terjadi kesalahan saat memuat data.';
    $('#error').hidden = false;
  }
  async run(operation, onError) {
    try { await operation(); }
    catch (error) { if (error.name !== 'AbortError') onError(error); }
  }
}

class PostApp {
  constructor() {
    this.page = 1;
    this.total = 0;
    this.query = '';
    this.loading = false;
    this.failed = false;
    this.requestId = 0;
    this.controller = null;
    this.boundary = new AsyncErrorBoundary();
    this.searchLater = debounce(() => { this.page = 1; this.load(); }, 500);
    $('#search').addEventListener('input', () => {
      // Batalkan respons lama segera, bukan setelah interval debounce.
      this.controller?.abort();
      this.requestId += 1;
      this.query = $('#search').value.trim();
      this.setLoading(true);
      this.boundary.clear();
      $('#results').replaceChildren();
      $('#status').textContent = 'Menunggu pencarian…';
      this.searchLater();
    });
    $('#previous').addEventListener('click', () => this.changePage(-1));
    $('#next').addEventListener('click', () => this.changePage(1));
    $('#retry').addEventListener('click', () => this.load());
    $('#reload').addEventListener('click', () => { this.searchLater.cancel(); this.page = 1; this.load(); });
    this.load();
  }

  setLoading(value) {
    this.loading = value;
    $('#loading').hidden = !value;
    $('#results').setAttribute('aria-busy', String(value));
    $('#reload').disabled = value;
    $('#retry').disabled = value;
    this.updatePagination();
  }

  updatePagination() {
    const pages = Math.max(1, Math.ceil(this.total / PAGE_SIZE));
    $('#page').textContent = `Halaman ${this.page} dari ${pages}`;
    $('#previous').disabled = this.loading || this.failed || this.page <= 1;
    $('#next').disabled = this.loading || this.failed || this.page >= pages;
  }

  async changePage(direction) {
    const next = this.page + direction;
    if (this.loading || this.failed || next < 1 || next > Math.ceil(this.total / PAGE_SIZE)) return;
    this.page = next;
    await this.load();
  }

  async load() {
    this.controller?.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    const requestId = ++this.requestId;
    this.failed = false;
    this.boundary.clear();
    this.setLoading(true);
    $('#status').textContent = 'Memuat postingan dan data pengguna…';
    $('#results').replaceChildren();
    await this.boundary.run(async () => {
      try {
        const { posts, total } = await fetchCombinedPosts({ query: this.query, page: this.page, signal, onRetry: ({ attempt, delay }) => {
          if (requestId === this.requestId) $('#status').textContent = `Permintaan gagal sementara. Retry ${attempt}/2 dalam ${delay / 1000} detik…`;
        } });
        if (requestId !== this.requestId) return;
        this.total = total;
        this.render(posts);
        $('#status').textContent = `${total} postingan ditemukan${this.query ? ` untuk “${this.query}”` : ''}. Menampilkan ${posts.length} postingan.`;
      } finally {
        if (requestId === this.requestId) this.setLoading(false);
      }
    }, (error) => {
      if (requestId !== this.requestId) return;
      this.controller.abort(); // Hentikan endpoint pasangan jika salah satunya gagal.
      this.failed = true;
      this.total = 0;
      $('#results').replaceChildren();
      $('#status').textContent = 'Pemuatan gagal. Gunakan tombol Coba lagi.';
      this.boundary.show(error);
      this.updatePagination();
    });
  }

  render(posts) {
    $('#results').innerHTML = posts.length ? posts.map(({ title, body, author, tags }) => `<article><span class="author">Oleh ${escapeHTML(author)}</span><h2>${escapeHTML(title)}</h2><p>${escapeHTML(body)}</p><div class="tags">${tags.map((tag) => `<span class="tag">#${escapeHTML(tag)}</span>`).join('')}</div></article>`).join('') : '<p class="empty">Tidak ada postingan yang cocok. Coba kata kunci lain.</p>';
  }
}

const app = new PostApp();
