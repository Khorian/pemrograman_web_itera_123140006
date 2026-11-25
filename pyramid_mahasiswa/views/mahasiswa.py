from datetime import date
from sqlalchemy.exc import IntegrityError
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from ..models import Mahasiswa
from .helpers import json_object


@view_config(route_name='mahasiswa_list', renderer='json')
def mahasiswa_list(request):
    rows = request.dbsession.query(Mahasiswa).order_by(Mahasiswa.id).all()
    return {'mahasiswas': [row.to_dict() for row in rows]}


@view_config(route_name='mahasiswa_detail', renderer='json')
def mahasiswa_detail(request):
    row = request.dbsession.get(Mahasiswa, _id(request))
    if row is None:
        raise HTTPNotFound(json_body={'error': 'Mahasiswa tidak ditemukan.'})
    return {'mahasiswa': row.to_dict()}


def _id(request):
    try: return int(request.matchdict['id'])
    except (ValueError, TypeError): raise HTTPNotFound(json_body={'error': 'ID tidak valid.'})


def _required(data, fields):
    for field in fields:
        if field not in data or data[field] is None or (isinstance(data[field], str) and not data[field].strip()):
            raise HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi.'})


def _date(value):
    if value in (None, ''): return None
    try: return date.fromisoformat(value)
    except (ValueError, TypeError): raise HTTPBadRequest(json_body={'error': 'tanggal_lahir harus berformat YYYY-MM-DD.'})


@view_config(route_name='mahasiswa_add', request_method='POST', renderer='json')
def mahasiswa_add(request):
    data = json_object(request); _required(data, ['nim','nama','jurusan'])
    row = Mahasiswa(nim=str(data['nim']).strip(), nama=str(data['nama']).strip(),
                   jurusan=str(data['jurusan']).strip(), tanggal_lahir=_date(data.get('tanggal_lahir')),
                   alamat=data.get('alamat'))
    request.dbsession.add(row)
    try: request.dbsession.flush()
    except IntegrityError: raise HTTPBadRequest(json_body={'error': 'NIM sudah terdaftar.'})
    return {'success': True, 'mahasiswa': row.to_dict()}


@view_config(route_name='mahasiswa_update', request_method='PUT', renderer='json')
def mahasiswa_update(request):
    row=request.dbsession.get(Mahasiswa, _id(request))
    if row is None: raise HTTPNotFound(json_body={'error':'Mahasiswa tidak ditemukan.'})
    data=json_object(request)
    for key in ('nim','nama','jurusan','alamat'):
        if key in data: setattr(row,key,data[key])
    if 'tanggal_lahir' in data: row.tanggal_lahir=_date(data['tanggal_lahir'])
    _required({'nim':row.nim,'nama':row.nama,'jurusan':row.jurusan}, ['nim','nama','jurusan'])
    try: request.dbsession.flush()
    except IntegrityError: raise HTTPBadRequest(json_body={'error':'NIM sudah digunakan data lain.'})
    return {'success':True,'mahasiswa':row.to_dict()}


@view_config(route_name='mahasiswa_delete', request_method='DELETE', renderer='json')
def mahasiswa_delete(request):
    row=request.dbsession.get(Mahasiswa,_id(request))
    if row is None: raise HTTPNotFound(json_body={'error':'Mahasiswa tidak ditemukan.'})
    request.dbsession.delete(row)
    return {'success':True,'message':'Data mahasiswa berhasil dihapus.'}
