"""Modul fungsi geometri dan konversi temperatur."""

PI = 3.14159


def luas_persegi(sisi):
    """Menghitung luas persegi.

    Args:
        sisi (float): Panjang sisi persegi.

    Returns:
        float: Luas persegi.
    """
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi.

    Args:
        sisi (float): Panjang sisi persegi.

    Returns:
        float: Keliling persegi.
    """
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang.

    Args:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Returns:
        float: Luas persegi panjang.
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang.

    Args:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Returns:
        float: Keliling persegi panjang.
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran.

    Args:
        jari_jari (float): Panjang jari-jari lingkaran.

    Returns:
        float: Luas lingkaran.
    """
    return PI * jari_jari ** 2


def keliling_lingkaran(jari_jari):
    """Menghitung keliling lingkaran.

    Args:
        jari_jari (float): Panjang jari-jari lingkaran.

    Returns:
        float: Keliling lingkaran.
    """
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius):
    """Mengubah suhu Celsius ke Fahrenheit.

    Args:
        celsius (float): Suhu dalam derajat Celsius.

    Returns:
        float: Suhu dalam derajat Fahrenheit.
    """
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    """Mengubah suhu Celsius ke Kelvin.

    Args:
        celsius (float): Suhu dalam derajat Celsius.

    Returns:
        float: Suhu dalam Kelvin.
    """
    return celsius + 273.15
