// Data cerita dan soal: setiap level berisi 3 soal yang terkait tujuan pembelajaran.
  var LEVELS = [
    {
      nama: "Level 1 - Mudah", cerita: "Cerita Tabungan Rani: Rani memiliki tabungan awal Rp20.000,00. Setiap minggu ia menabung Rp5.000,00. Misalkan x adalah banyak minggu menabung.",
      soal: [
        { tipe: "pilihan", tanya: "Manakah model persamaan total tabungan Rani setelah x minggu?", pilihan: ["20.000 + 5.000x", "20.000x + 5.000", "5.000 - 20.000x", "20.000 + 5.000 + x"], benar: 0, jelas: "Total = tabungan awal + (tabungan per minggu x banyak minggu), yaitu 20.000 + 5.000x." },
        { tipe: "isian", tanya: "Jika total tabungan Rani Rp40.000,00, selesaikan 20.000 + 5.000x = 40.000. Berapa nilai x?", benarAngka: 4, jelas: "5.000x = 40.000 - 20.000 = 20.000, sehingga x = 4 minggu." },
        { tipe: "isian", tanya: "Rani ingin total tabungannya Rp65.000,00. Selesaikan 20.000 + 5.000x = 65.000. Berapa nilai x?", benarAngka: 9, jelas: "5.000x = 65.000 - 20.000 = 45.000, sehingga x = 9 minggu." }
      ]
    },
    {
      nama: "Level 2 - Sedang", cerita: "Cerita Warung Bu Sari: Rani membeli beberapa paket nasi. Harga satu paket adalah x rupiah. Ia juga membeli es teh Rp12.000,00.",
      soal: [
        { tipe: "pilihan", tanya: "Rani membeli 3 paket dan es teh Rp12.000,00 dengan total Rp72.000,00. Manakah model persamaannya?", pilihan: ["3x + 12.000 = 72.000", "3x - 12.000 = 72.000", "x + 12.000 = 72.000", "3 + x + 12.000 = 72.000"], benar: 0, jelas: "3 paket = 3x, ditambah es teh 12.000, totalnya 72.000." },
        { tipe: "isian", tanya: "Selesaikan 3x + 12.000 = 72.000. Berapa harga satu paket (x) dalam rupiah?", benarAngka: 20000, jelas: "3x = 72.000 - 12.000 = 60.000, sehingga x = 20.000." },
        { tipe: "isian", tanya: "Dengan harga paket Rp20.000,00 dan es teh Rp12.000,00, berapa paket yang dibeli Rani jika totalnya Rp112.000,00? Selesaikan 12.000 + 20.000x = 112.000.", benarAngka: 5, jelas: "20.000x = 112.000 - 12.000 = 100.000, sehingga x = 5 paket." }
      ]
    },
    {
      nama: "Level 3 - Menantang", cerita: "Cerita Menabung Bersama: Tabungan Ani adalah x rupiah. Tabungan Budi adalah 2x + 5.000 rupiah. Total tabungan mereka Rp35.000,00.",
      soal: [
        { tipe: "pilihan", tanya: "Manakah model persamaan total tabungan Ani dan Budi?", pilihan: ["x + (2x + 5.000) = 35.000", "2x + 5.000 = 35.000", "x + 5.000 = 35.000", "3x - 5.000 = 35.000"], benar: 0, jelas: "Total = tabungan Ani + tabungan Budi = x + (2x + 5.000) = 35.000." },
        { tipe: "isian", tanya: "Selesaikan 3x + 5.000 = 35.000. Berapa tabungan Ani (x) dalam rupiah?", benarAngka: 10000, jelas: "3x = 35.000 - 5.000 = 30.000, sehingga x = 10.000." },
        { tipe: "isian", tanya: "Berdasarkan soal sebelumnya, berapa tabungan Budi (2x + 5.000) dalam rupiah?", benarAngka: 25000, jelas: "Budi = 2(10.000) + 5.000 = 25.000. Pemeriksaan: 10.000 + 25.000 = 35.000." }
      ]
    }
  ];
  var KUNCI = "plsv_mpi_resti_v1";
  var state = { nama: "", jawaban: {} };
  try {
    var tersimpan = localStorage.getItem(KUNCI);
    if (tersimpan) { state = JSON.parse(tersimpan); }
  } catch (e) { state = { nama: "", jawaban: {} }; }
  var levelAktif = 0, soalAktif = 0, pilihanAktif = null;

  function simpan() {
    try { localStorage.setItem(KUNCI, JSON.stringify(state)); } catch (e) {}
    perbaruiProgres();
  }
  function tampil(id) {
    var semua = document.querySelectorAll(".screen");
    for (var i = 0; i < semua.length; i++) { semua[i].classList.remove("active"); }
    document.getElementById(id).classList.add("active");
    if (id === "latihan") { renderLevel(); }
    if (id === "hasil") { renderHasil(); }
    window.scrollTo(0, 0);
  }
  function simpanNama() {
    state.nama = document.getElementById("nama").value.trim();
    simpan();
    alert("Nama tersimpan di perangkat ini.");
  }
  function hapusProgres() {
    if (confirm("Hapus semua progres yang tersimpan di perangkat ini?")) {
      state = { nama: "", jawaban: {} };
      try { localStorage.removeItem(KUNCI); } catch (e) {}
      document.getElementById("nama").value = "";
      perbaruiProgres(); renderLevel();
    }
  }
  function kunciJawaban(li, qi) { return li + "-" + qi; }
  function hitung() {
    var dijawab = 0, benar = 0, perLevel = [0, 0, 0];
    for (var li = 0; li < LEVELS.length; li++) {
      for (var qi = 0; qi < LEVELS[li].soal.length; qi++) {
        var j = state.jawaban[kunciJawaban(li, qi)];
        if (j) { dijawab++; if (j.benar) { benar++; perLevel[li]++; } }
      }
    }
    return { dijawab: dijawab, benar: benar, perLevel: perLevel };
  }
  function perbaruiProgres() {
    var h = hitung();
    document.getElementById("teksProgres").textContent = "Progres: " + h.dijawab + " dari 9 soal dijawab.";
    document.getElementById("barProgres").style.width = Math.round(h.dijawab / 9 * 100) + "%";
    document.getElementById("teksSkor").textContent = "Skor benar: " + h.benar + " dari 9 soal.";
    if (state.nama) { document.getElementById("nama").value = state.nama; }
  }
  function renderLevel() {
    var h = hitung(), html = "";
    for (var i = 0; i < LEVELS.length; i++) {
      var selesai = h.perLevel[i] === 3 && Object.keys(state.jawaban).filter(function(k){ return k.indexOf(i + "-") === 0; }).length === 3;
      html += '<div class="level-card"><h3>' + LEVELS[i].nama + '</h3><p>Benar: ' + h.perLevel[i] + ' dari 3 soal.</p><p>' + (selesai ? "Status: Selesai" : "Status: Belum selesai") + '</p><button type="button" onclick="mulaiLevel(' + i + ')">Mainkan Level Ini</button></div>';
    }
    document.getElementById("daftarLevel").innerHTML = html;
  }
  function mulaiLevel(i) {
    levelAktif = i; soalAktif = 0; pilihanAktif = null;
    document.getElementById("areaSoal").style.display = "block";
    document.getElementById("kotakCerita").innerHTML = "<strong>" + LEVELS[i].nama + "</strong><p>" + LEVELS[i].cerita + "</p>";
    tampilSoal();
    document.getElementById("areaSoal").scrollIntoView();
  }
  function tampilSoal() {
    var soal = LEVELS[levelAktif].soal[soalAktif];
    document.getElementById("judulSoal").textContent = "Soal " + (soalAktif + 1) + " dari 3";
    document.getElementById("teksSoal").textContent = soal.tanya;
    document.getElementById("umpanBalik").innerHTML = "";
    document.getElementById("tombolLanjut").style.display = "none";
    document.getElementById("tombolPeriksa").style.display = "inline-block";
    var area = document.getElementById("areaJawaban");
    if (soal.tipe === "pilihan") {
      var html = '<div class="options">';
      for (var i = 0; i < soal.pilihan.length; i++) {
        html += '<button type="button" onclick="pilihJawaban(' + i + ', this)">' + soal.pilihan[i] + '</button>';
      }
      html += "</div>";
      area.innerHTML = html;
    } else {
      area.innerHTML = '<label for="inputJawaban">Jawabanmu (angka saja):</label><input type="number" id="inputJawaban" inputmode="numeric">';
      var inp = document.getElementById("inputJawaban");
      inp.addEventListener("keydown", function(ev) { if (ev.key === "Enter") { periksaJawaban(); } });
    }
  }
  function pilihJawaban(i, tombol) {
    pilihanAktif = i;
    var semua = document.querySelectorAll("#areaJawaban .options button");
    for (var j = 0; j < semua.length; j++) { semua[j].classList.remove("selected"); }
    tombol.classList.add("selected");
  }
  function periksaJawaban() {
    var soal = LEVELS[levelAktif].soal[soalAktif], benar = false, isi = "";
    if (soal.tipe === "pilihan") {
      if (pilihanAktif === null) { alert("Pilih satu jawaban dulu."); return; }
      benar = (pilihanAktif === soal.benar); isi = soal.pilihan[pilihanAktif];
    } else {
      var nilai = document.getElementById("inputJawaban").value;
      if (nilai === "") { alert("Tulis jawaban angkamu dulu."); return; }
      benar = (Number(nilai) === soal.benarAngka); isi = nilai;
    }
    state.jawaban[kunciJawaban(levelAktif, soalAktif)] = { jawaban: isi, benar: benar };
    simpan();
    var box = document.getElementById("umpanBalik");
    box.className = "feedback " + (benar ? "benar" : "salah");
    box.innerHTML = (benar ? "Benar! " : "Belum tepat. ") + soal.jelas;
    document.getElementById("tombolPeriksa").style.display = "none";
    document.getElementById("tombolLanjut").style.display = "inline-block";
    document.getElementById("tombolLanjut").textContent = (soalAktif === 2 ? "Selesai Level Ini" : "Soal Berikutnya");
  }
  function soalBerikutnya() {
    if (soalAktif < 2) { soalAktif++; pilihanAktif = null; tampilSoal(); }
    else {
      document.getElementById("areaSoal").style.display = "none";
      renderLevel();
      var h = hitung();
      if (h.dijawab === 9) { tampil("hasil"); } else { alert("Level selesai! Pilih level berikutnya."); }
    }
  }
  function renderHasil() {
    var h = hitung(), persen = Math.round(h.benar / 9 * 100);
    var predikat = persen >= 85 ? "Sangat Baik" : persen >= 70 ? "Baik" : persen >= 55 ? "Cukup" : "Perlu Latihan Lagi";
    document.getElementById("hasilNama").textContent = state.nama ? "Nama: " + state.nama : "Nama: (belum diisi di Beranda)";
    document.getElementById("hasilSkor").textContent = "Skor akhir: " + h.benar + " dari 9 soal benar (" + persen + "%). Soal dijawab: " + h.dijawab + " dari 9.";
    document.getElementById("hasilPredikat").textContent = "Predikat: " + predikat;
    var html = "";
    for (var i = 0; i < LEVELS.length; i++) {
      var dijawabLevel = Object.keys(state.jawaban).filter(function(k){ return k.indexOf(i + "-") === 0; }).length;
      html += "<tr><td>" + LEVELS[i].nama + "</td><td>" + h.perLevel[i] + " dari 3</td><td>" + (dijawabLevel === 3 ? "Selesai" : "Belum selesai") + "</td></tr>";
    }
    document.getElementById("tabelHasil").innerHTML = html;
  }
  perbaruiProgres();
