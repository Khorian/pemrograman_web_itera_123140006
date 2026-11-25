from sqlalchemy import Column, Integer, Text, Date
from .meta import Base


class Mahasiswa(Base):
    __tablename__ = 'mahasiswa'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nim = Column(Text, unique=True, nullable=False)
    nama = Column(Text, nullable=False)
    jurusan = Column(Text, nullable=False)
    tanggal_lahir = Column(Date, nullable=True)
    alamat = Column(Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id, 'nim': self.nim, 'nama': self.nama,
            'jurusan': self.jurusan,
            'tanggal_lahir': self.tanggal_lahir.isoformat() if self.tanggal_lahir else None,
            'alamat': self.alamat,
        }
