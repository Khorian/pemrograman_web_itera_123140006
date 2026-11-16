"""Class anggota perpustakaan."""

class Member:
    """Merepresentasikan anggota yang dapat meminjam koleksi."""

    def __init__(self, member_id: str, nama: str):
        self._member_id = str(member_id)
        self._nama = str(nama)

    @property
    def member_id(self):
        return self._member_id

    @property
    def nama(self):
        return self._nama

    def get_detail(self):
        return f"ID Anggota: {self.member_id} | Nama: {self.nama}"
