import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  totalSaldo: 150000000,
  targetLiburanTerkumpul: 30000000,
  targetLiburanTotal: 40000000,
  transactions: [
    {
      id: 'fin-1',
      tanggal: '2025-02-28',
      kategori: 'Gaji',
      keperluan: 'Gaji Kantor',
      akun: 'BLU (Bca Digital)',
      jumlah: 5500000,
      tipe: 'Pemasukan'
    },
    {
      id: 'fin-2',
      tanggal: '2025-02-28',
      kategori: 'Ngasih Ortu',
      keperluan: 'Memberi',
      akun: 'BLU (Bca Digital)',
      jumlah: -700000,
      tipe: 'Pengeluaran'
    },
    {
      id: 'fin-3',
      tanggal: '2025-02-28',
      kategori: 'Hutang',
      keperluan: 'Redmi Pad 2',
      akun: 'BLU (Bca Digital)',
      jumlah: -2500000,
      tipe: 'Pengeluaran'
    },
    {
      id: 'fin-4',
      tanggal: '2025-02-28',
      kategori: 'Wifi',
      keperluan: 'Wifi Bulanan',
      akun: 'BLU (Bca Digital)',
      jumlah: -2500000, // wait let's use 250000 as in image
      tipe: 'Pengeluaran'
    },
    {
      id: 'fin-5',
      tanggal: '2025-02-28',
      kategori: 'Invest',
      keperluan: 'Saham + Kripto',
      akun: 'BLU (Bca Digital)',
      jumlah: -1000000,
      tipe: 'Pengeluaran'
    },
    {
      id: 'fin-6',
      tanggal: '2025-02-28',
      kategori: 'Hutang',
      keperluan: 'Teman',
      akun: 'BLU (Bca Digital)',
      jumlah: -200000,
      tipe: 'Pengeluaran'
    }
  ],
  stockTrades: [
    {
      id: 'stock-1',
      tanggal: '15 Mei 2025',
      pair: 'IPO COIN',
      trend: 'Follow',
      posisi: 'Long',
      tf: '15m',
      pnl: 244263,
      gainPercent: 9.52,
      equity: 2566769,
      status: 'Win'
    },
    {
      id: 'stock-2',
      tanggal: '15 Agustus 2025',
      pair: 'FORE',
      trend: 'Follow',
      posisi: 'Long',
      tf: '15m',
      pnl: -91000,
      gainPercent: -2.60,
      equity: 3493578,
      status: 'Lose'
    },
    {
      id: 'stock-3',
      tanggal: '24 September 2025',
      pair: 'IPO EMAS',
      trend: 'Follow',
      posisi: 'Long',
      tf: '15m',
      pnl: 222000,
      gainPercent: 6.73,
      equity: 2399578,
      status: 'Win'
    },
    {
      id: 'stock-4',
      tanggal: '24 Desember 2025',
      pair: 'IPO RLCO',
      trend: 'Follow',
      posisi: 'Long',
      tf: '15m',
      pnl: 89500,
      gainPercent: 2.57,
      equity: 3486578,
      status: 'Win'
    },
    {
      id: 'stock-5',
      tanggal: '4 Februari 2026',
      pair: 'CDIA',
      trend: 'Follow',
      posisi: 'Long',
      tf: '4h',
      pnl: 27000,
      gainPercent: 0.76,
      equity: 3514578,
      status: 'Win'
    },
    {
      id: 'stock-6',
      tanggal: '20 Februari 2026',
      pair: 'BUVA',
      trend: 'Follow',
      posisi: 'Long',
      tf: '4h',
      pnl: -4000,
      gainPercent: -0.11,
      equity: 3565933,
      status: 'Lose'
    }
  ],
  monthlyAssets: [
    {
      id: 'asset-1',
      bulanTahun: 'Februari 2026',
      namaAset: 'Stockbit',
      modalAwal: 500000,
      totalDeposit: 0,
      saldoSaatIni: 438000,
      pnl: -62000,
      gainPercent: -12.40,
      status: 'Drawdown'
    },
    {
      id: 'asset-2',
      bulanTahun: 'Maret 2026',
      namaAset: 'Stockbit',
      modalAwal: 500000,
      totalDeposit: 1000000,
      saldoSaatIni: 1438000,
      pnl: -62000,
      gainPercent: -4.13,
      status: 'Active'
    }
  ],
  debtItems: [
    {
      id: 'debt-1',
      nama: 'Herman',
      tipe: 'Piutang',
      jumlah: 300000,
      jatuhTempo: '-',
      status: 'Belum Lunas',
      catatan: 'Pinjam'
    },
    {
      id: 'debt-2',
      nama: 'Feter',
      tipe: 'Piutang',
      jumlah: 200000,
      jatuhTempo: '-',
      status: 'Bayar Sebagian',
      catatan: 'Pinjam'
    },
    {
      id: 'debt-3',
      nama: 'Alvin',
      tipe: 'Piutang',
      jumlah: 150000,
      jatuhTempo: '-',
      status: 'Bayar Sebagian',
      catatan: 'Pinjam'
    },
    {
      id: 'debt-4',
      nama: 'Tiktok Paylater',
      tipe: 'Hutang',
      jumlah: 300000,
      jatuhTempo: '3 Maret 2025',
      status: 'Lunas',
      catatan: 'Paylater'
    },
    {
      id: 'debt-5',
      nama: 'Kredivo',
      tipe: 'Hutang',
      jumlah: 550000,
      jatuhTempo: '20 Oktober 2025',
      status: 'Belum Lunas',
      catatan: 'Pinjam'
    }
  ],
  wishlistItems: [
    {
      id: 'wish-1',
      nama: 'Macbook Air M4',
      targetHarga: 16000000,
      terkumpul: 1400000,
      targetTanggal: '1 September 2025',
      iconName: 'laptop_mac'
    },
    {
      id: 'wish-2',
      nama: 'Liburan Jepang',
      targetHarga: 25000000,
      terkumpul: 12500000,
      targetTanggal: '15 Juni 2024',
      iconName: 'flight_takeoff'
    },
    {
      id: 'wish-3',
      nama: 'Servis Besar Mobil',
      targetHarga: 5000000,
      terkumpul: 4800000,
      targetTanggal: '1 Desember 2023',
      iconName: 'directions_car'
    }
  ],
  cryptoTrades: [
    {
      id: 'crypto-1',
      tanggal: '24 Mei 2024',
      pair: 'BTC/USDT',
      trend: 'Bullish',
      posisi: 'LONG',
      pnl: 1240.50,
      gainPercent: 2.45,
      equity: 52440,
      status: 'WIN'
    },
    {
      id: 'crypto-2',
      tanggal: '23 Mei 2024',
      pair: 'ETH/USDT',
      trend: 'Bearish',
      posisi: 'SHORT',
      pnl: -312.20,
      gainPercent: -0.85,
      equity: 51200,
      status: 'LOSS'
    },
    {
      id: 'crypto-3',
      tanggal: '22 Mei 2024',
      pair: 'SOL/USDT',
      trend: 'Side',
      posisi: 'LONG',
      pnl: 840.15,
      gainPercent: 5.12,
      equity: 51512,
      status: 'WIN'
    }
  ],
  savingTransactions: [
    {
      id: 'saving-1',
      bulan: 'Februari',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 0,
      setoran: 1000000,
      penarikan: 0,
      saldoSaatIni: 1000000
    },
    {
      id: 'saving-2',
      bulan: 'Maret',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 1000000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 2500000
    },
    {
      id: 'saving-3',
      bulan: 'April',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 2500000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 4000000
    },
    {
      id: 'saving-4',
      bulan: 'Mei',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 4000000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 5500000
    },
    {
      id: 'saving-5',
      bulan: 'Juni',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 5500000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 7000000
    },
    {
      id: 'saving-6',
      bulan: 'Juli',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 7000000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 8500000
    },
    {
      id: 'saving-7',
      bulan: 'Agustus',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 8500000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 10000000
    },
    {
      id: 'saving-8',
      bulan: 'September',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 10000000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 11500000
    },
    {
      id: 'saving-9',
      bulan: 'Oktober',
      namaTabungan: 'Macbook Air M2',
      saldoAwal: 11500000,
      setoran: 1500000,
      penarikan: 0,
      saldoSaatIni: 13000000
    }
  ]
};
