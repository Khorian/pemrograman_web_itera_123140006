"""Program utama untuk menguji seluruh fungsi math_operations."""

import math_operations
from math_operations import (
    luas_persegi,
    keliling_persegi,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
)


def main():
    """Menjalankan contoh perhitungan geometri dan konversi suhu."""
    print("=" * 58)
    print("             DEMO MODUL OPERASI MATEMATIKA")
    print("=" * 58)

    sisi = 5
    panjang, lebar = 8, 4
    jari_jari = 7
    suhu = 25

    print("\n1. PERSEGI")
    print(f"Sisi                 : {sisi}")
    print(f"Luas                 : {luas_persegi(sisi):.2f}")
    print(f"Keliling             : {keliling_persegi(sisi):.2f}")

    print("\n2. PERSEGI PANJANG")
    print(f"Panjang dan lebar    : {panjang} dan {lebar}")
    print(
        "Luas                 : "
        f"{math_operations.luas_persegi_panjang(panjang, lebar):.2f}"
    )
    print(
        "Keliling             : "
        f"{math_operations.keliling_persegi_panjang(panjang, lebar):.2f}"
    )

    print("\n3. LINGKARAN")
    print(f"Jari-jari            : {jari_jari}")
    print(
        "Luas                 : "
        f"{math_operations.luas_lingkaran(jari_jari):.2f}"
    )
    print(
        "Keliling             : "
        f"{math_operations.keliling_lingkaran(jari_jari):.2f}"
    )
    print(f"Konstanta PI         : {math_operations.PI}")

    print("\n4. KONVERSI TEMPERATUR")
    print(f"Celsius              : {suhu:.2f} °C")
    print(f"Fahrenheit           : {celsius_ke_fahrenheit(suhu):.2f} °F")
    print(f"Kelvin               : {celsius_ke_kelvin(suhu):.2f} K")
    print("=" * 58)


if __name__ == "__main__":
    main()
