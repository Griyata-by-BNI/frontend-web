import { DocumentRequirement } from "../types";

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    name: "Fotokopi KTP (suami dan istri)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Kartu Keluarga",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Surat Nikah (apabila sudah menikah)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi NPWP Pribadi/SPT PPH 21",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Rekening Gaji 3 Bulan Terakhir",
    pegawai: true,
    profesional: false,
    pengusaha: false,
  },
  {
    name: "Fotokopi Rekening Koran 6 Bulan Terakhir",
    pegawai: false,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Asli Surat Keterangan Kerja dan Slip Gaji",
    pegawai: true,
    profesional: false,
    pengusaha: false,
  },
  {
    name: "Fotokopi Ijin Praktik/Surat Kepengurusan perpanjangan izin praktik dari instansi terkait",
    pegawai: false,
    profesional: true,
    pengusaha: false,
  },
  {
    name: "Fotokopi SIUP/Surat Izin Usaha Lainnya/TDP/NIB (Nomor Induk Berusaha)/surat kepengurusan pembuatan/perpanjangan jika TDP/NIB sedang diproses",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
  {
    name: "Fotokopi Akte Pendirian dan/atau akta perubahan terakhir (jika ada perubahan pengurus/pemilik saham)",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
  {
    name: "Pas Foto Pemohon dan Suami/Istri Pemohon ukuran 3x4",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Dokumen Jaminan*)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Laporan Keuangan 2 Tahun Terakhir",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
];

export const faqData = [
  {
    question: "Properti apa saja yang bisa dijadikan agunan?",
    answer:
      "Jenis properti yang dapat dijadikan jaminan meliputi rumah tapak sebagai hunian utama, rumah susun, atau apartemen.",
  },
  {
    question: "Berapa maksimal plafon kredit yang bisa diajukan?",
    answer:
      "Plafon kredit BNI Griya dapat mencapai hingga Rp 20 miliar, disesuaikan dengan nilai properti dan kemampuan membayar kembali.",
  },
  {
    question: "Siapa saja yang bisa mengajukan KPR di BNI?",
    answer:
      "Pengajuan KPR BNI dapat dilakukan oleh Warga Negara Indonesia berusia minimal 21 tahun. Saat kredit lunas, usia maksimal adalah 55 tahun atau sesuai usia pensiun untuk pegawai/karyawan, dan 65 tahun untuk wiraswasta atau profesional.",
  },
  {
    question: "Berapa lama tenor pembiayaan KPR di BNI?",
    answer:
      "Tenor pembiayaan untuk pembelian rumah tinggal baik baru maupun seken dapat mencapai hingga 30 tahun.",
  },
];

export const jenisFitur = [
  {
    type: "Pembelian",
    description:
      "Beli rumah baru atau seken kini lebih mudah dengan KPR Griyata by BNI.",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
    link: "/info-kpr/detail",
  },
  {
    type: "Pembangunan",
    description:
      "Bangun rumah impianmu dari nol dengan dukungan KPR Griyata by BNI.",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    link: null,
  },
  {
    type: "Take Over",
    description:
      "Cicilan KPR di bank lain terasa berat? Pindah ke Griyata by BNI dan nikmati kemudahan take over.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
    link: null,
  },
  {
    type: "Refinancing",
    description:
      "Butuh dana tambahan untuk beli rumah? Griyata by BNI Refinancing siap membantu.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    link: null,
  },
  {
    type: "KPR Cermat",
    description:
      "Jaga Saldo Rata-Rata Harian (SRH) di tabungan dan nikmati diskon suku bunga KPR lewat KPR Cermat.",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    link: null,
  },
];

export const griyataContent = {
  title: "Griyata by BNI",
  description:
    "Fasilitas pembiayaan konsumtif beragunan properti rumah tinggal yang dapat digunakan untuk tujuan pembelian, pembangunan/renovasi, take over, refinancing, dan lain-lain. Fleksibilitas ini memungkinkan nasabah untuk memenuhi berbagai kebutuhan finansial dengan jaminan properti yang dimiliki.",
};

export const features = [
  { title: "Suku Bunga Ringan", icon: "wallet" },
  { title: "Tenor Hingga 30 Tahun", icon: "time" },
  { title: "Proses Mudah & Cepat", icon: "process" },
];
