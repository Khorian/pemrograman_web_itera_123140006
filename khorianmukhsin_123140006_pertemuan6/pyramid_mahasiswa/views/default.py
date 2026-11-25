from pyramid.view import view_config

@view_config(route_name='home', renderer='string')
def home(request):
    return 'Pyramid REST API aktif: /api/mahasiswa dan /api/matakuliah'
