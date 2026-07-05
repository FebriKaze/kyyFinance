export interface FinancialTransaction {
  id: string;
  tanggal: string;
  kategori: string;
  keperluan: string;
  akun: string;
  jumlah: number;
  tipe: 'Pemasukan' | 'Pengeluaran';
}

export interface StockTrade {
  id: string;
  tanggal: string;
  pair: string;
  trend: 'Follow' | 'Counter';
  posisi: 'Long' | 'Short';
  tf: string;
  pnl: number;
  gainPercent: number;
  equity: number;
  status: 'Win' | 'Lose';
}

export interface MonthlyAsset {
  id: string;
  bulanTahun: string;
  namaAset: string;
  modalAwal: number;
  totalDeposit: number;
  saldoSaatIni: number;
  pnl: number;
  gainPercent: number;
  status: 'Active' | 'Drawdown';
}

export interface DebtItem {
  id: string;
  nama: string;
  tipe: 'Hutang' | 'Piutang';
  jumlah: number;
  jatuhTempo: string;
  status: 'Lunas' | 'Belum Lunas' | 'Bayar Sebagian';
  catatan: string;
}

export interface WishlistItem {
  id: string;
  nama: string;
  targetHarga: number;
  terkumpul: number;
  targetTanggal: string;
  iconName: 'laptop_mac' | 'flight_takeoff' | 'directions_car' | 'smartphone' | 'house' | 'other';
}

export interface CryptoTrade {
  id: string;
  tanggal: string;
  pair: string;
  trend: 'Bullish' | 'Bearish' | 'Side';
  posisi: 'LONG' | 'SHORT';
  pnl: number;
  gainPercent: number;
  equity: number;
  status: 'WIN' | 'LOSS';
}

export interface SavingTransaction {
  id: string;
  bulan: string;
  namaTabungan: string;
  saldoAwal: number;
  setoran: number;
  penarikan: number;
  saldoSaatIni: number;
}

export interface AppState {
  totalSaldo: number;
  transactions: FinancialTransaction[];
  stockTrades: StockTrade[];
  monthlyAssets: MonthlyAsset[];
  debtItems: DebtItem[];
  wishlistItems: WishlistItem[];
  cryptoTrades: CryptoTrade[];
  savingTransactions: SavingTransaction[];
  targetLiburanTerkumpul: number;
  targetLiburanTotal: number;
}
