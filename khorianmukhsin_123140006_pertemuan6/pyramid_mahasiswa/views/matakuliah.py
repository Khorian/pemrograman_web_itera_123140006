from sqlalchemy.exc import IntegrityError
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from ..models import Matakuliah
from .helpers import json_object

FIELDS = ('kode_mk', 'nama_mk', 'sks', 'semester')


def _id(request):
    try: return int(request.matchdict['id'])
    except (ValueError, TypeError): raise HTTPNotFound(json_body={'error':'ID tidak valid.'})


def _validate(data, partial=False):
    for field in FIELDS:
        if not partial and (field not in data or data[field] is None or data[field] == ''):
            raise HTTPBadRequest(json_body={'error':f'Field {field} wajib diisi.'})
        if field in data and field in ('kode_mk','nama_mk'):
            if not isinstance(data[field], str) or not data[field].strip():
                raise HTTPBadRequest(json_body={'error':f'Field {field} harus berupa teks dan tidak boleh kosong.'})
        if field in data and field in ('sks','semester'):
            value=data[field]
            if isinstance(value,bool) or not isinstance(value,int) or value <= 0:
                raise HTTPBadRequest(json_body={'error':f'Field {field} harus berupa integer positif.'})


@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    rows=request.dbsession.query(Matakuliah).order_by(Matakuliah.id).all()
    return {'matakuliah':[row.to_dict() for row in rows]}


@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    row=request.dbsession.get(Matakuliah,_id(request))
    if row is None: raise HTTPNotFound(json_body={'error':'Matakuliah tidak ditemukan.'})
    return {'matakuliah':row.to_dict()}


@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    data=json_object(request); _validate(data)
    row=Matakuliah(kode_mk=data['kode_mk'].strip(),nama_mk=data['nama_mk'].strip(),
                   sks=data['sks'],semester=data['semester'])
    request.dbsession.add(row)
    try: request.dbsession.flush()
    except IntegrityError: raise HTTPBadRequest(json_body={'error':'kode_mk sudah terdaftar.'})
    return {'success':True,'matakuliah':row.to_dict()}


@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    row=request.dbsession.get(Matakuliah,_id(request))
    if row is None: raise HTTPNotFound(json_body={'error':'Matakuliah tidak ditemukan.'})
    data=json_object(request); _validate(data,partial=True)
    for key in FIELDS:
        if key in data: setattr(row,key,data[key].strip() if isinstance(data[key],str) else data[key])
    try: request.dbsession.flush()
    except IntegrityError: raise HTTPBadRequest(json_body={'error':'kode_mk sudah digunakan matakuliah lain.'})
    return {'success':True,'matakuliah':row.to_dict()}


@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    row=request.dbsession.get(Matakuliah,_id(request))
    if row is None: raise HTTPNotFound(json_body={'error':'Matakuliah tidak ditemukan.'})
    request.dbsession.delete(row)
    return {'success':True,'message':'Data matakuliah berhasil dihapus.'}
