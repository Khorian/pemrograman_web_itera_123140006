import argparse
import sys
from datetime import date
from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError
from ..models import Mahasiswa, Matakuliah


def setup_models(session):
    mahasiswa_seed = [
        dict(nim='12345', nama='Budi Santoso', jurusan='Teknik Informatika', tanggal_lahir=date(2000,5,15), alamat='Bandung'),
        dict(nim='54321', nama='Siti Aminah', jurusan='Sistem Informasi', tanggal_lahir=date(2001,8,22), alamat='Jakarta'),
    ]
    for item in mahasiswa_seed:
        if session.query(Mahasiswa).filter_by(nim=item['nim']).first() is None:
            session.add(Mahasiswa(**item))
    matakuliah_seed = [
        dict(kode_mk='IF2110', nama_mk='Pemrograman Web', sks=3, semester=5),
        dict(kode_mk='IF3140', nama_mk='Basis Data', sks=4, semester=3),
        dict(kode_mk='IF2210', nama_mk='Struktur Data', sks=3, semester=2),
    ]
    for item in matakuliah_seed:
        if session.query(Matakuliah).filter_by(kode_mk=item['kode_mk']).first() is None:
            session.add(Matakuliah(**item))


def main(argv=sys.argv):
    parser=argparse.ArgumentParser()
    parser.add_argument('config_uri', help='Misalnya development.ini')
    args=parser.parse_args(argv[1:])
    setup_logging(args.config_uri)
    env=bootstrap(args.config_uri)
    try:
        with env['request'].tm:
            setup_models(env['request'].dbsession)
        print('Seeding Mahasiswa dan Matakuliah selesai (data yang sudah ada dilewati).')
    except OperationalError as exc:
        print('Database belum dapat diakses. Periksa service PostgreSQL dan development.ini.', exc)
        raise
    finally:
        env['closer']()

if __name__ == '__main__':
    main()
