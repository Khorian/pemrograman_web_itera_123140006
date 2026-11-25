from setuptools import setup, find_packages

setup(
    name='pyramid-mahasiswa',
    version='0.1.0',
    description='RESTful API Mahasiswa dan Matakuliah dengan Pyramid dan PostgreSQL',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'pyramid>=2.0,<3.0',
        'pyramid_tm>=2.5',
        'pyramid_debugtoolbar>=4.0',
        'SQLAlchemy>=1.4,<3.0',
        'alembic>=1.10',
        'zope.sqlalchemy>=3.0',
        'psycopg2-binary>=2.9',
        'waitress>=2.1',
    ],
    extras_require={'testing': ['pytest', 'webtest', 'coverage']},
    entry_points={
        'paste.app_factory': ['main = pyramid_mahasiswa:main'],
        'console_scripts': ['initialize_pyramid_db = pyramid_mahasiswa.scripts.initialize_db:main'],
    },
)
