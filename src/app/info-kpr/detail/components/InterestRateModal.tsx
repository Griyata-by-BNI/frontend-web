interface InterestRateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterestRateModal = ({
  isOpen,
  onClose,
}: InterestRateModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl max-w-2xl w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-none border-none text-3xl cursor-pointer text-gray-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="mt-0 text-[#007A70]">Syarat & Ketentuan Suku Bunga</h3>

        <p className="text-sm leading-relaxed text-gray-600">
          <b className="text-gray-800">
            A. Pembelian di Top Selected Developer:
          </b>{" "}
          Promo spesial untuk properti baru yang dikembangkan oleh Ciputra,
          Sinarmas Land, Jaya Real Properti, Paramount, Summarecon, Agung
          Podomoro, Pakuwon Group, dan developer terpilih lainnya (plafon kredit
          min. Rp 300 Juta).
        </p>

        <p className="text-sm leading-relaxed text-gray-600">
          <b className="text-gray-800">B. Pembelian di Developer Kerjasama:</b>{" "}
          Promo khusus untuk properti baru yang dikembangkan oleh seluruh
          developer kerjasama.
        </p>

        <p className="text-sm leading-relaxed text-gray-600">
          <b className="text-gray-800">C. Non-Primary:</b> Promo untuk pembelian
          properti second, pembangunan/renovasi, top up, atau take over dari
          bank lain.
        </p>

        <p className="text-sm leading-relaxed text-gray-600">
          <b className="text-gray-800">D. Multiguna/Refinancing:</b> Promo
          khusus untuk tujuan refinancing dan multiguna.
        </p>

        <p className="text-sm leading-relaxed text-gray-600">
          <i>
            Semua promo spesial di atas hanya berlaku untuk permohonan dengan
            dokumen lengkap selambat-lambatnya tanggal 30 September 2025.
            Setelah suku bunga fixed berakhir, akan dikenakan suku bunga
            floating yang berlaku.
          </i>
        </p>
      </div>
    </div>
  );
};
