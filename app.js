// Simple CRUD Data Siswa - localStorage, tanpa backend
const KEY = "dataSiswa";
let editIndex = -1;

// Data dummy awal (ditampilkan saat pertama kali dibuka)
const DUMMY_DATA = [
  { nama: "Budi Santoso", nim: "2024001", jurusan: "Informatika" },
  { nama: "Siti Aminah", nim: "2024002", jurusan: "Sistem Informasi" },
  { nama: "Andi Pratama", nim: "2024003", jurusan: "Teknik Elektro" },
  { nama: "Dewi Lestari", nim: "2024004", jurusan: "Manajemen" },
  { nama: "Rizky Ramadhan", nim: "2024005", jurusan: "Informatika" },
  { nama: "Putri Ayu", nim: "2024006", jurusan: "Akuntansi" },
  { nama: "Agus Wijaya", nim: "2024007", jurusan: "Sistem Informasi" },
  { nama: "Nina Kurnia", nim: "2024008", jurusan: "Manajemen" },
];

// Seed otomatis kalau belum ada data tersimpan
if (localStorage.getItem(KEY) === null) {
  saveData(DUMMY_DATA);
}

const $ = (id) => document.getElementById(id);
const formSiswa = $("formSiswa");
const inputNama = $("inputNama");
const inputNim = $("inputNim");
const inputJurusan = $("inputJurusan");
const btnSimpan = $("btnSimpan");
const btnBatal = $("btnBatal");
const formTitle = $("formTitle");
const errorMsg = $("errorMsg");
const tbodyData = $("tbodyData");
const emptyState = $("emptyState");
const totalBadge = $("totalBadge");
const inputCari = $("inputCari");

function getData() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function showError(msg) {
  errorMsg.innerHTML =
    '<span class="inline-flex items-center gap-2">' +
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>' +
    escapeHtml(msg) +
    "</span>";
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
}

function resetForm() {
  formSiswa.reset();
  editIndex = -1;
  formTitle.textContent = "Tambah Data Siswa";
  btnSimpan.textContent = "Tambah";
  btnBatal.classList.add("hidden");
  hideError();
}

btnSimpan.addEventListener("click", (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();
  const nim = inputNim.value.trim();
  const jurusan = inputJurusan.value;

  if (!nama || !nim || !jurusan) {
    showError("Semua field wajib diisi (Nama, NIM, Jurusan).");
    return;
  }

  const data = getData();

  // Cek NIM duplikat (kecuali sedang edit baris yang sama)
  const duplikat = data.some((d, i) => d.nim === nim && i !== editIndex);
  if (duplikat) {
    showError("NIM sudah terdaftar. Gunakan NIM lain.");
    return;
  }

  hideError();

  if (editIndex === -1) {
    data.push({ nama, nim, jurusan });
  } else {
    data[editIndex] = { nama, nim, jurusan };
  }

  saveData(data);
  resetForm();
  render();
});

btnBatal.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

inputCari.addEventListener("input", render);

function hapusData(index) {
  const data = getData();
  if (confirm(`Hapus data "${data[index].nama}"?`)) {
    data.splice(index, 1);
    saveData(data);
    if (editIndex === index) resetForm();
    render();
  }
}

function editData(index) {
  const data = getData();
  const s = data[index];
  inputNama.value = s.nama;
  inputNim.value = s.nim;
  inputJurusan.value = s.jurusan;
  editIndex = index;
  formTitle.textContent = "Edit Data Siswa";
  btnSimpan.textContent = "Update";
  btnBatal.classList.remove("hidden");
  hideError();
  window.scrollTo({ top: 0, behavior: "smooth" });
  inputNama.focus();
}

function render() {
  const data = getData();
  const keyword = inputCari.value.trim().toLowerCase();

  totalBadge.textContent = data.length;

  const filtered = data
    .map((s, originalIndex) => ({ ...s, originalIndex }))
    .filter(
      (s) =>
        !keyword ||
        s.nama.toLowerCase().includes(keyword) ||
        s.nim.toLowerCase().includes(keyword) ||
        s.jurusan.toLowerCase().includes(keyword)
    );

  emptyState.style.display = filtered.length === 0 ? "block" : "none";

  tbodyData.innerHTML = filtered
    .map(
      (s, i) => `
    <tr class="border-b hover:bg-blue-50/50 transition">
      <td class="px-3 py-2 text-slate-500">${i + 1}</td>
      <td class="px-3 py-2 font-medium">${escapeHtml(s.nama)}</td>
      <td class="px-3 py-2 text-slate-600">${escapeHtml(s.nim)}</td>
      <td class="px-3 py-2">
        <span class="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">${escapeHtml(s.jurusan)}</span>
      </td>
      <td class="px-3 py-2 text-center whitespace-nowrap">
        <button onclick="editData(${s.originalIndex})" class="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mr-1 transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>Edit</button>
        <button onclick="hapusData(${s.originalIndex})" class="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>Hapus</button>
      </td>
    </tr>`
    )
    .join("");
}

// Cegah XSS sederhana saat render
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Expose ke global karena dipanggil dari onclick
window.editData = editData;
window.hapusData = hapusData;
window.resetDummy = function () {
  if (confirm("Kembalikan data ke dummy awal? Data saat ini akan diganti.")) {
    saveData(DUMMY_DATA);
    resetForm();
    inputCari.value = "";
    render();
  }
};

render();
