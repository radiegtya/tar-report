// 👔Pemasukan👔
// ✅IPL
// ✅Donasi
// ✅Pemasukan Lainnya
//
// 👗Pengeluaran👗
// ✅Keamanan
// ✅Kebersihan
// ✅Listrik
// ✅Konsumsi
// ✅Penambahan Fasilitas
// ✅Pengeluaran Lainnya


export default Rule = {
  //pemasukan
  ipl: {
    d: "kas",
    c: "ipl"
  },
  donasi: {
    d: "kas",
    c: "donasi"
  },
  pemasukan_lainnya: {
    d: "kas",
    c: "pemasukan_lainnya"
  },
  //pengeluaran
  keamanan: {
    d: "keamanan",
    c: "kas"
  },
  kebersihan: {
    d: "kebersihan",
    c: "kas"
  },
  listrik: {
    d: "listrik",
    c: "kas"
  },
  konsumsi: {
    d: "konsumsi",
    c: "kas"
  },
  penambahan_fasilitas: {
    d: "penambahan_fasilitas",
    c: "kas"
  },
  pengeluaran_lainnya: {
    d: "pengeluaran_lainnya",
    c: "kas"
  },
}
