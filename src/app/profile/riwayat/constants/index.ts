import { Submission } from "../types";

export const inProcessSubmissions: Submission[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
    title: "Caksana - Tipe Celosia",
    group: "Alam Sutera Group",
    date: "01/08/2025",
    status: "Diproses",
  },
];

export const completedSubmissions: Submission[] = [
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    title: "Ammaia - Tipe Heliconia",
    group: "BSD Sinarmas Land",
    date: "15/07/2025",
    status: "Disetujui",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
    title: "The Nove - Tipe Coral",
    group: "Citraland Group",
    date: "10/07/2025",
    status: "Ditolak",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1600585152225-3589404e4c9f?q=80&w=2070&auto=format&fit=crop",
    title: "Zeva - Tipe Agate",
    group: "Summarecon Serpong",
    date: "01/06/2025",
    status: "Ditolak",
  },
];
