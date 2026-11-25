from pyramid.config import Configurator
from pyramid.response import Response


def home(request):
    return Response('Pyramid REST API aktif. Gunakan /api/mahasiswa atau /api/matakuliah.')


def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        config.include('pyramid_mahasiswa.models')
        config.include('pyramid_mahasiswa.routes')
        config.scan('pyramid_mahasiswa.views')
        return config.make_wsgi_app()
