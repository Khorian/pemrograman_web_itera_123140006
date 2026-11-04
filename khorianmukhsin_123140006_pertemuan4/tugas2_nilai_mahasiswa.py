"""Program pengelolaan nilai akhir mahasiswa."""


mahasiswa = [
    {"nama": "Khorian Mukhsin", "nim": "123140006",
     "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Ilyas Ramadhan", "nim": "123140016",
     "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 80},
    {"nama": "Audy Olivya", "nim": "123140025",
     "nilai_uts": 65, "nilai_uas": 72, "nilai_tugas": 70},
    {"nama": "JANA ROHMAN WASISO", "nim": "123140046",
     "nilai_uts": 55, "nilai_uas": 60, "nilai_tugas": 58},
    {"nama": "DELA PUSPITA SARI", "nim": "123140080",
     "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 48},
]


def hitung_nilai_akhir(data):
    """Menghitung nilai akhir dari dictionary mahasiswa.

    Args:
        data (dict): Data mahasiswa dengan nilai UTS, UAS, dan tugas.

    Returns:
        float: Nilai akhir berdasarkan bobot 30%, 40%, dan 30%.
    """
    return (
        0.30 * data["nilai_uts"]
        + 0.40 * data["nilai_uas"]
        + 0.30 * data["nilai_tugas"]
    )


def tentukan_grade(nilai):
    """Menentukan grade berdasarkan nilai akhir.

    Args:
        nilai (float): Nilai akhir mahasiswa.

    Returns:
        str: Grade A, B, C, D, atau E.
    """
    if nilai >= 80:
        return "A"
    elif nilai >= 70:
        return "B"
    elif nilai >= 60:
        return "C"
    elif nilai >= 50:
        return "D"
    return "E"


def main():
    """Mengolah, menampilkan, dan mencari nilai tertinggi/terendah."""
    for data in mahasiswa:
        data["nilai_akhir"] = hitung_nilai_akhir(data)
        data["grade"] = tentukan_grade(data["nilai_akhir"])

    print("=" * 78)
    print("                    DATA NILAI MAHASISWA")
    print("=" * 78)
    print(
        f"{'Nama':<20} {'NIM':<12} {'UTS':>6} {'UAS':>6} "
        f"{'Tugas':>7} {'Nilai Akhir':>13} {'Grade':>7}"
    )
    print("-" * 78)

    for data in mahasiswa:
        print(
            f"{data['nama']:<20} {data['nim']:<12} "
            f"{data['nilai_uts']:>6.1f} {data['nilai_uas']:>6.1f} "
            f"{data['nilai_tugas']:>7.1f} "
            f"{data['nilai_akhir']:>13.2f} {data['grade']:>7}"
        )

    tertinggi = max(mahasiswa, key=lambda item: item["nilai_akhir"])
    terendah = min(mahasiswa, key=lambda item: item["nilai_akhir"])

    print("-" * 78)
    print(
        f"Nilai tertinggi: {tertinggi['nama']} "
        f"({tertinggi['nim']}) = {tertinggi['nilai_akhir']:.2f} "
        f"[{tertinggi['grade']}]"
    )
    print(
        f"Nilai terendah : {terendah['nama']} "
        f"({terendah['nim']}) = {terendah['nilai_akhir']:.2f} "
        f"[{terendah['grade']}]"
    )
    print("=" * 78)


if __name__ == "__main__":
    main()
