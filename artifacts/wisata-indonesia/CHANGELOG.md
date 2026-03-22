# Changelog - Wisata Sumut

Seluruh perubahan dan penyempurnaan pada platform Wisata Sumatera Utara.

## [1.0.0] - 2026-03-21

### Added
- **Halaman Rental Mobil**: Implementasi penuh halaman penyewaan kendaraan dengan berbagai pilihan armada (Avanza, Innova, Hiace, Pajero).
- **Halaman Galeri**: Implementasi galeri visual interaktif untuk menampilkan keindahan destinasi di Sumatera Utara.
- **Halaman Blog**: Implementasi sistem blog untuk artikel tips perjalanan dan informasi destinasi.
- **Fitur Pencarian**: Penambahan search bar fungsional di halaman Beranda yang terintegrasi dengan filter di halaman Paket Wisata.
- **SEO Optimization**: Penambahan meta tags, Open Graph, dan Twitter Card untuk meningkatkan visibilitas di mesin pencari dan media sosial.
- **Font Baru**: Penggunaan `Playfair Display` untuk heading dan `Plus Jakarta Sans` untuk body text guna meningkatkan estetika dan keterbacaan.

### Improved
- **Integrasi Backend**: Perbaikan konfigurasi proxy dan penanganan fallback data jika API tidak tersedia.
- **Booking Flow**: Penyempurnaan proses pemesanan pada detail paket dengan notifikasi toast dan integrasi WhatsApp.
- **Responsive Design**: Optimasi breakpoint untuk memastikan tampilan sempurna di perangkat mobile, tablet, dan desktop.
- **Aksesibilitas**: Penambahan atribut ARIA pada elemen interaktif untuk memenuhi standar WCAG 2.1 level AA.
- **Performa**: Optimasi loading font dan aset gambar melalui penggunaan `preconnect` dan parameter Unsplash yang tepat.

### Fixed
- **Dependency Issues**: Perbaikan masalah instalasi pnpm pada sistem operasi Windows dengan memodifikasi script `preinstall`.
- **Navigation Inconsistency**: Memastikan semua tautan di Navbar dan Footer mengarah ke halaman yang benar dan fungsional.
- **Form Validation**: Memastikan semua input pada form Custom Trip dan Booking memiliki validasi yang tepat menggunakan Zod.

### Technical
- Framework: React with Vite
- Styling: Tailwind CSS
- State Management: TanStack Query
- Routing: Wouter
- Icons: Lucide React
- Animations: Framer Motion
