// Interface TypeScript untuk mendefinisikan tipe data form registrasi
export interface FormData {
  fullName: string;        // Nama lengkap user (wajib diisi, min 2 karakter, hanya huruf & spasi)
  phoneNumber: string;     // Nomor HP (wajib diisi, 10-13 digit, mulai 08/62)
  email: string;          // Email user (wajib diisi, format email valid)
  password: string;       // Password (min 8 karakter, harus ada huruf besar, kecil, angka, & simbol)
  confirmPassword: string; // Konfirmasi password (harus sama dengan password)
  agreeToTerms: boolean;  // Checkbox persetujuan (harus true untuk bisa submit)
}

/*
PENJELASAN SINGKAT:
- Interface ini adalah "kontrak" yang mendefinisikan struktur data form
- TypeScript akan memastikan semua field ini ada dan tipenya benar
- Digunakan untuk type checking saat development
- Membantu mencegah error dan memudahkan debugging
*/