# TODO - Layout Konsisten (ngikutin dashboard.html)

- [x] (Step 1) Samakan wrapper layout di `assets.html`, `reports.html`, `users.html`, `categories.html`, `locations.html` ke pola `dashboard.html` (sidebar + topbar + main + modal + toast).

- [ ] (Step 2) Standarisasi CSS komponen umum (sidebar/backdrop, nav-active/nav-link hover, modal overlay, toast, scrollbar) agar tidak beda-beda antar halaman.


- [ ] (Step 3) Rapikan error CSS di `reports.html` (cuplikan terlihat ada duplikasi/pecah `.nav-active` yang berpotensi merusak parsing).
- [ ] (Step 4) Pastikan ID/kelas yang dipakai JS tetap sama (mis. `sidebarBackdrop`, `userMenu`, `modalOverlay`, `modalContent`, `toast-container`).
- [ ] (Step 5) Validasi cepat di browser: cek desktop & mobile untuk setiap halaman.

