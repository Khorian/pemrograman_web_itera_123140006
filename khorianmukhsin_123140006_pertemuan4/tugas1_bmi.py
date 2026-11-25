"""Program sederhana untuk menghitung BMI dan kategorinya."""


def main():
    """Meminta data berat dan tinggi, lalu menampilkan hasil BMI."""
    print("=" * 45)
    print("          PROGRAM PENGHITUNG BMI")
    print("=" * 45)

    try:
        berat = float(input("Masukkan berat badan (kg): "))
        tinggi = float(input("Masukkan tinggi badan (m): "))

        if berat <= 0 or tinggi <= 0:
            print("Berat dan tinggi harus lebih besar dari 0.")
            return

        bmi = berat / (tinggi * tinggi)

        if bmi < 18.5:
            kategori = "Berat badan kurang"
        elif bmi < 25:
            kategori = "Berat badan normal"
        elif bmi < 30:
            kategori = "Berat badan berlebih"
        else:
            kategori = "Obesitas"

        print("\nHasil Perhitungan")
        print("-" * 45)
        print(f"BMI      : {bmi:.2f}")
        print(f"Kategori : {kategori}")
        print("-" * 45)
    except ValueError:
        print("Input tidak valid. Masukkan angka, misalnya 60 atau 1.65.")


if __name__ == "__main__":
    main()
