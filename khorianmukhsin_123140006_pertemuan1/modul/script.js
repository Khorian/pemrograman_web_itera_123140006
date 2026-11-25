"use strict";

// Tema berlaku untuk seluruh dashboard.
(() => {
"use strict";
const STORAGE_KEY = "latihan-dark-mode-123140006";
const button = document.getElementById("theme-toggle");
const storageError = document.getElementById("storage-error");
function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  button.setAttribute("aria-pressed", String(isDark));
  button.textContent = isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode";
  document.getElementById("theme-status").textContent = isDark ? "Tema gelap aktif." : "Tema terang aktif.";
}
try { applyTheme(localStorage.getItem(STORAGE_KEY) === "dark"); }
catch { applyTheme(false); storageError.textContent = "Tema tersimpan tidak dapat dibaca."; }
button.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  applyTheme(isDark);
  try { localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light"); storageError.textContent = ""; }
  catch { storageError.textContent = "Tema berhasil diubah, tetapi tidak dapat disimpan."; }
});

})();

// Data Mahasiswa: lingkup lokal menjaga variabel setiap fitur tetap terpisah.
(() => {
  const document = {
    getElementById: id => window.document.getElementById("mhs-" + id),
    createElement: tag => window.document.createElement(tag),
    body: window.document.body
  };
"use strict";

const STORAGE_KEY = "latihan-mahasiswa-123140006";
const form = document.getElementById("mahasiswa-form");
const status = document.getElementById("status");
const storageError = document.getElementById("storage-error");
const inputs = Object.fromEntries(["nama", "nim", "email", "prodi"].map(id => [id, document.getElementById(id)]));
let mahasiswa = [];

// Ketentuan latihan: nama minimal 3 karakter, NIM 9 digit dan unik,
// email valid menurut input HTML, serta prodi dipilih dari daftar.
function dataValid(data) {
  if (!data || typeof data !== "object") return false;
  if (!["nama", "nim", "email", "prodi"].every(key => typeof data[key] === "string")) return false;
  const cekEmail = document.createElement("input");
  cekEmail.type = "email";
  cekEmail.required = true;
  cekEmail.value = data.email;
  const pilihan = Array.from(inputs.prodi.options).map(option => option.value).filter(Boolean);
  return data.nama.trim().length >= 3 && /^\d{9}$/.test(data.nim) &&
    cekEmail.checkValidity() && pilihan.includes(data.prodi);
}

function muatData() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (tersimpan === null) return;
    const data = JSON.parse(tersimpan);
    if (!Array.isArray(data) || !data.every(dataValid) || new Set(data.map(item => item.nim)).size !== data.length) {
      throw new Error("Data tidak valid");
    }
    mahasiswa = data;
  } catch {
    storageError.textContent = "Data tidak dapat dimuat. Penyimpanan mungkin tidak tersedia atau data tersimpan rusak.";
  }
}

function simpanData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mahasiswa));
    storageError.textContent = "";
  } catch {
    storageError.textContent = "Data gagal disimpan ke browser dan bisa hilang setelah refresh.";
  }
}

function renderData() {
  const tbody = document.getElementById("daftar-mahasiswa");
  tbody.replaceChildren();
  if (mahasiswa.length === 0) {
    const baris = document.createElement("tr");
    const sel = document.createElement("td");
    sel.colSpan = 5;
    sel.textContent = "Belum ada data mahasiswa.";
    baris.append(sel);
    tbody.append(baris);
  }
  mahasiswa.forEach((item, index) => {
    const baris = document.createElement("tr");
    [index + 1, item.nama, item.nim, item.email, item.prodi].forEach(nilai => {
      const sel = document.createElement("td");
      sel.textContent = nilai;
      baris.append(sel);
    });
    tbody.append(baris);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  status.textContent = "";
  const data = Object.fromEntries(Object.entries(inputs).map(([id, input]) => [id, input.value.trim()]));
  inputs.email.value = data.email;
  const errors = {
    nama: data.nama.length < 3 ? "Nama wajib diisi, minimal 3 karakter." : "",
    nim: !/^\d{9}$/.test(data.nim) ? "NIM wajib terdiri dari 9 digit angka." :
      mahasiswa.some(item => item.nim === data.nim) ? "NIM sudah terdaftar." : "",
    email: !inputs.email.checkValidity() ? "Masukkan alamat email yang valid." : "",
    prodi: !inputs.prodi.checkValidity() ? "Pilih program studi." : ""
  };
  let salahPertama = null;
  Object.entries(errors).forEach(([id, pesan]) => {
    document.getElementById(`${id}-error`).textContent = pesan;
    inputs[id].setAttribute("aria-invalid", pesan ? "true" : "false");
    if (pesan && !salahPertama) salahPertama = inputs[id];
  });
  if (salahPertama) {
    salahPertama.focus();
    return;
  }
  mahasiswa.push(data);
  simpanData();
  renderData();
  form.reset();
  status.textContent = `${data.nama} berhasil ditambahkan.`;
  inputs.nama.focus();
});

muatData();
renderData();

})();

// Post API: lingkup lokal menjaga variabel setiap fitur tetap terpisah.
(() => {
  const document = {
    getElementById: id => window.document.getElementById("post-" + id),
    createElement: tag => window.document.createElement(tag),
    body: window.document.body
  };
"use strict";
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 5;
let posts = [];
let currentPage = 1;
const search = document.getElementById("search");
const container = document.getElementById("posts");
const statusMessage = document.getElementById("status");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const retry = document.getElementById("retry");

// Filter seluruh data terlebih dahulu, kemudian ambil bagian halaman aktif.
function renderPosts() {
  const keyword = search.value.trim().toLowerCase();
  const filtered = posts.filter(post => post.title.toLowerCase().includes(keyword));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  currentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const start = (currentPage - 1) * PAGE_SIZE;
  container.replaceChildren();
  filtered.slice(start, start + PAGE_SIZE).forEach(post => {
    const article = document.createElement("article");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    title.textContent = post.title;
    body.textContent = post.body;
    article.append(title, body);
    container.append(article);
  });
  statusMessage.textContent = filtered.length ? `${filtered.length} post ditemukan.` : "Tidak ada post yang cocok.";
  document.getElementById("page-info").textContent = totalPages ? `Halaman ${currentPage} dari ${totalPages}` : "Halaman 0 dari 0";
  previous.disabled = currentPage <= 1;
  next.disabled = totalPages === 0 || currentPage >= totalPages;
}

async function loadPosts() {
  statusMessage.classList.remove("error");
  statusMessage.textContent = "Memuat data...";
  retry.hidden = true;
  search.disabled = previous.disabled = next.disabled = true;
  container.setAttribute("aria-busy", "true");
  container.replaceChildren();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !data.every(post => post && typeof post.title === "string" && typeof post.body === "string")) {
      throw new Error("Format data tidak valid");
    }
    posts = data;
    currentPage = 1;
    search.disabled = false;
    renderPosts();
  } catch {
    statusMessage.classList.add("error");
    statusMessage.textContent = "Gagal memuat post. Periksa koneksi internet, lalu klik Coba Lagi.";
    document.getElementById("page-info").textContent = "";
    retry.hidden = false;
  } finally {
    clearTimeout(timeout);
    container.setAttribute("aria-busy", "false");
  }
}
search.addEventListener("input", () => { currentPage = 1; renderPosts(); });
previous.addEventListener("click", () => { currentPage--; renderPosts(); });
next.addEventListener("click", () => { currentPage++; renderPosts(); });
retry.addEventListener("click", loadPosts);
loadPosts();

})();

// Todo List: lingkup lokal menjaga variabel setiap fitur tetap terpisah.
(() => {
  const document = {
    getElementById: id => window.document.getElementById("todo-" + id),
    createElement: tag => window.document.createElement(tag),
    body: window.document.body
  };
"use strict";
const STORAGE_KEY = "latihan-todo-123140006";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const storageError = document.getElementById("storage-error");
const statusMessage = document.getElementById("status");
let todos = [];
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return;
    const data = JSON.parse(saved);
    if (!Array.isArray(data) || !data.every(item => item && typeof item.text === "string" && item.text.trim().length > 0 && typeof item.done === "boolean")) {
      throw new Error("Data rusak");
    }
    todos = data;
  } catch { storageError.textContent = "Data tugas tidak dapat dimuat. Penyimpanan mungkin tidak tersedia atau data rusak."; }
}
function saveTodos() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); storageError.textContent = ""; }
  catch { storageError.textContent = "Data gagal disimpan dan bisa hilang setelah refresh."; }
}
function renderTodos() {
  list.replaceChildren();
  document.getElementById("summary").textContent = `${todos.filter(item => item.done).length} dari ${todos.length} tugas selesai.`;
  if (!todos.length) { const empty = document.createElement("p"); empty.textContent = "Belum ada tugas."; list.append(empty); }
  todos.forEach((todo, index) => {
    const row = document.createElement("div");
    row.className = todo.done ? "todo-item done" : "todo-item";
    row.setAttribute("role", "listitem");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `todo-${index}`;
    checkbox.checked = todo.done;
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = todo.text;
    checkbox.addEventListener("change", () => {
      // Ubah DOM yang aktif tanpa menghilangkan fokus checkbox.
      todo.done = checkbox.checked;
      row.classList.toggle("done", todo.done);
      saveTodos();
      document.getElementById("summary").textContent = `${todos.filter(item => item.done).length} dari ${todos.length} tugas selesai.`;
      statusMessage.textContent = todo.done ? "Tugas ditandai selesai." : "Tugas ditandai belum selesai.";
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = "Hapus";
    remove.setAttribute("aria-label", `Hapus tugas ${index + 1}: ${todo.text}`);
    remove.addEventListener("click", () => {
      todos.splice(index, 1); saveTodos(); renderTodos();
      statusMessage.textContent = "Tugas dihapus.";
      const buttons = list.querySelectorAll("button");
      if (buttons.length) buttons[Math.min(index, buttons.length - 1)].focus(); else input.focus();
    });
    row.append(checkbox, label, remove);
    list.append(row);
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  document.getElementById("input-error").textContent = text ? "" : "Tugas wajib diisi, tidak boleh hanya spasi.";
  input.setAttribute("aria-invalid", text ? "false" : "true");
  if (!text) { input.focus(); return; }
  todos.push({text, done: false});
  saveTodos(); renderTodos(); form.reset(); input.focus();
  statusMessage.textContent = "Tugas berhasil ditambahkan.";
});
loadTodos();
renderTodos();

})();
