
const hargaLayanan = {
    "Reguler": 20000,
    "Express": 30000,
    "Cuci Kering": 10000,
    "Setrika": 15000
};


let transaksi = JSON.parse(
    localStorage.getItem("transaksiLaundry") || "[]"
);


function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}


function hitungHarga() {
    const layanan = document.getElementById("jenisLayanan").value;
    const berat = Number(document.getElementById("berat").value);

    const harga = hargaLayanan[layanan] || 0;
    const total = harga * berat;

    document.getElementById("totalHarga").value =
        total > 0 && Number.isFinite(total) ? rupiah(total) : "";
}


document.getElementById("jenisLayanan").addEventListener("change", hitungHarga);
document.getElementById("berat").addEventListener("input", hitungHarga);

// MENYIMPAN DATA
function simpanData() {
    localStorage.setItem(
        "transaksiLaundry",
        JSON.stringify(transaksi)
    );
}


function tanggalHariIni() {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const hari = String(sekarang.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}


function aman(teks) {
    return String(teks).replace(/[&<>"']/g, function(karakter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[karakter];
    });
}


document.getElementById("formPemesanan").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const hp = document.getElementById("hp").value.trim();
    const layanan = document.getElementById("jenisLayanan").value;
    const berat = Number(document.getElementById("berat").value);
    const tanggal = document.getElementById("tanggal").value;


    if (
        !nama ||
        !hp ||
        !tanggal ||
        !hargaLayanan[layanan] ||
        !Number.isFinite(berat) ||
        berat <= 0
    ) {
        alert("Silakan periksa kembali data pemesanan!");
        return;
    }


    const total = hargaLayanan[layanan] * berat;


    const dataBaru = {
        nama: nama,
        hp: hp,
        layanan: layanan,
        berat: berat,
        total: total,
        tanggal: tanggal,
        status: "Diterima"
    };


    transaksi.push(dataBaru);


    simpanData();
    tampilkanTransaksi();


    this.reset();

    document.getElementById("totalHarga").value = "";
    document.getElementById("tanggal").value = tanggalHariIni();

    alert("Pemesanan laundry berhasil!");

    // MENUJU TABEL
    document.getElementById("data").scrollIntoView({
        behavior: "smooth"
    });
});


function tampilkanTransaksi() {
    const tabel = document.getElementById("tabelPemesanan");

    tabel.innerHTML = "";

    // JIKA BELUM ADA DATA
    if (transaksi.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="9" class="kosong">
                    Belum ada pemesanan laundry.
                </td>
            </tr>
        `;
        return;
    }


    transaksi.forEach(function(data, index) {
        tabel.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${aman(data.nama)}</td>
                <td>${aman(data.hp)}</td>
                <td>${aman(data.layanan)}</td>
                <td>${data.berat} kg</td>
                <td>${rupiah(data.total)}</td>
                <td>${aman(data.tanggal)}</td>

                <td>
                    <select class="status-select" data-index="${index}">
                        ${["Diterima", "Dicuci", "Disetrika", "Siap Diambil", "Sudah Diambil"]
                            .map(function(status) {
                                return `
                                    <option value="${status}"
                                        ${data.status === status ? "selected" : ""}>
                                        ${status}
                                    </option>
                                `;
                            }).join("")}
                    </select>
                </td>

                <td>
                    <button type="button" class="btn-hapus" data-index="${index}">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}


document.getElementById("tabelPemesanan").addEventListener("change", function(e) {

    if (e.target.classList.contains("status-select")) {

        const index = Number(e.target.dataset.index);

        transaksi[index].status = e.target.value;

        simpanData();
        tampilkanTransaksi();
    }

});


document.getElementById("tabelPemesanan").addEventListener("click", function(e) {

    if (e.target.classList.contains("btn-hapus")) {

        const index = Number(e.target.dataset.index);

        if (confirm("Apakah kamu yakin ingin menghapus pesanan ini?")) {

            transaksi.splice(index, 1);

            simpanData();
            tampilkanTransaksi();
        }
    }

});


document.getElementById("tanggal").value = tanggalHariIni();

tampilkanTransaksi();
