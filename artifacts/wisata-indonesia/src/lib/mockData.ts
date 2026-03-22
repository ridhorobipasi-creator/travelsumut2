export const MOCK_PACKAGES = [
  {
    id: 1,
    title: "Eksplorasi Keindahan Danau Toba & Pulau Samosir",
    description: "Nikmati keindahan alam Danau Toba yang spektakuler sambil mengunjungi desa-desa adat Batak di Pulau Samosir.",
    price: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=800",
    rating: 4.8,
    slug: "eksplorasi-danau-toba",
    duration: 3,
    city: { name: "Samosir", id: 1 },
    featured: true,
    isActive: true,
  },
  {
    id: 2,
    title: "Petualangan Rimbanya Bukit Lawang",
    description: "Trekking memacu adrenalin menelusuri hutan hujan tropis dan melihat habitat asli Orangutan Sumatera.",
    price: 2100000,
    imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800",
    rating: 4.9,
    slug: "bukit-lawang-trekking",
    duration: 4,
    city: { name: "Langkat", id: 2 },
    featured: true,
    isActive: true,
  },
  {
    id: 3,
    title: "Wisata Dingin Berastagi & Air Terjun Sipiso-piso",
    description: "Nikmati udara sejuk pegunungan Bukit Barisan dan keindahan spektakuler air terjun tertinggi.",
    price: 850000,
    imageUrl: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=800",
    rating: 4.7,
    slug: "berastagi-sipisopiso",
    duration: 2,
    city: { name: "Karo", id: 3 },
    featured: true,
    isActive: true,
  },
  {
    id: 4,
    title: "Pesona Pantai Nias & Surfing Paradise",
    description: "Jelajahi surga peselancar dunia dan nikmati atraksi budaya lompat batu Nias yang ikonik.",
    price: 3200000,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    rating: 4.9,
    slug: "nias-surfing-culture",
    duration: 5,
    city: { name: "Nias", id: 4 },
    featured: false,
    isActive: false,
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: 1,
    customerName: "Budi Santoso",
    rating: 5,
    comment: "Pelayanannya sangat luar biasa! Guide kami ramah dan sangat faham sejarah lokal di Danau Toba. Liburan keluarga jadi super seru.",
    customerAvatar: "https://i.pravatar.cc/150?u=budi",
  },
  {
    id: 2,
    customerName: "Sarah Wijayanto",
    rating: 5,
    comment: "Trekking di Bukit Lawang sangat menantang tapi sepadan. Organisasi tour rapi, makanannya juga enak-enak. Sangat direkomendasikan!",
    customerAvatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 3,
    customerName: "Andi Permana",
    rating: 4,
    comment: "Paket tripnya sangat lengkap. Pemandangan Air Terjun Sipiso-piso benar-benar tak terlupakan. Will defintely comeback!",
    customerAvatar: "https://i.pravatar.cc/150?u=andi",
  }
];

export const MOCK_CITIES = [
  { id: 1, name: "Samosir" },
  { id: 2, name: "Langkat" },
  { id: 3, name: "Karo" },
  { id: 4, name: "Nias" },
  { id: 5, name: "Medan" },
  { id: 6, name: "Simalungun" }
];

export const MOCK_ADMIN_STATS = {
  totalRevenue: 125000000,
  totalBookings: 48,
  activeBookings: 12,
  totalPackages: 15,
  totalCustomTrips: 24,
  recentBookings: [
    { 
      id: 101, 
      customerName: "Andi Wijaya", 
      customerEmail: "andi@mail.com", 
      customerPhone: "08123456789", 
      type: "package", 
      startDate: new Date().toISOString(), 
      totalPrice: 4500000, 
      status: "confirmed",
      package: { title: "Eksplorasi Danau Toba" }
    },
    { 
      id: 102, 
      customerName: "Siska Putri", 
      customerEmail: "siska@mail.com", 
      customerPhone: "08771234567", 
      type: "vehicle", 
      startDate: new Date().toISOString(), 
      totalPrice: 1200000, 
      status: "pending",
      vehicle: { name: "Toyota Avanza" }
    },
    { 
      id: 103, 
      customerName: "Budi Setiawan", 
      customerEmail: "budi@mail.com", 
      customerPhone: "08529876543", 
      type: "package", 
      startDate: new Date().toISOString(), 
      totalPrice: 8900000, 
      status: "confirmed",
      package: { title: "Custom Trip 5 Hari" }
    },
    { 
      id: 104, 
      customerName: "Rina Sari", 
      customerEmail: "rina@mail.com", 
      customerPhone: "08215555444", 
      type: "package", 
      startDate: new Date().toISOString(), 
      totalPrice: 3000000, 
      status: "cancelled",
      package: { title: "Berastagi Sipiso-piso" }
    },
  ]
};

export const MOCK_VEHICLES = [
  {
    id: 1,
    name: "Toyota Avanza",
    type: "MPV",
    capacity: 7,
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
    description: "Mobil keluarga yang nyaman untuk perjalanan jauh.",
    features: ["AC", "Audio", "Airbag"],
  },
  {
    id: 2,
    name: "Toyota Innova Zenix",
    type: "MPV Premium",
    capacity: 7,
    price: 850000,
    imageUrl: "https://images.unsplash.com/photo-1606148334073-958e9c394590?w=800",
    description: "Kenyamanan ekstra dengan kabin luas dan suspensi empuk.",
    features: ["Captain Seat", "AC Double Blower", "Panoramic Roof"],
  },
  {
    id: 3,
    name: "Toyota Hiace Premio",
    type: "Van",
    capacity: 14,
    price: 1500000,
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    description: "Pilihan terbaik untuk rombongan besar.",
    features: ["AC Central", "Reclining Seat", "LED TV"],
  },
  {
    id: 4,
    name: "Mitsubishi Pajero Sport",
    type: "SUV",
    capacity: 7,
    price: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    description: "Gagah dan tangguh untuk segala medan di Sumatera Utara.",
    features: ["4WD", "Leather Seat", "Sunroof"],
  }
];

export const MOCK_GALLERY = [
  { id: 1, title: "Danau Toba", imageUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=800" },
  { id: 2, title: "Bukit Lawang", imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800" },
  { id: 3, title: "Berastagi", imageUrl: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=800" },
  { id: 4, title: "Pulau Nias", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" },
  { id: 5, title: "Samosir", imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800" },
  { id: 6, title: "Air Terjun Sipiso-piso", imageUrl: "https://images.unsplash.com/photo-1596402184320-417d717867cd?w=800" },
];

export const MOCK_BLOG = [
  {
    id: 1,
    title: "5 Destinasi Wajib di Danau Toba",
    excerpt: "Danau Toba bukan hanya soal air. Temukan 5 tempat tersembunyi yang wajib Anda kunjungi.",
    date: "2024-03-20",
    imageUrl: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=800",
    slug: "destinasi-wajib-danau-toba",
  },
  {
    id: 2,
    title: "Tips Trekking di Bukit Lawang untuk Pemula",
    excerpt: "Persiapan matang adalah kunci kenyamanan trekking di hutan hujan tropis Sumatera.",
    date: "2024-03-15",
    imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800",
    slug: "tips-trekking-bukit-lawang",
  },
  {
    id: 3,
    title: "Kuliner Khas Karo yang Menggugah Selera",
    excerpt: "Jelajahi cita rasa otentik dari tanah Karo yang unik dan kaya rempah.",
    date: "2024-03-10",
    imageUrl: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=800",
    slug: "kuliner-khas-karo",
  }
];
