"""Create matakuliah table."""
from alembic import op
import sqlalchemy as sa
revision='0002_matakuliah'
down_revision='0001_mahasiswa'
branch_labels=None
depends_on=None

def upgrade():
    op.create_table('matakuliah',
        sa.Column('id',sa.Integer(),primary_key=True,autoincrement=True),
        sa.Column('kode_mk',sa.Text(),nullable=False,unique=True),
        sa.Column('nama_mk',sa.Text(),nullable=False),
        sa.Column('sks',sa.Integer(),nullable=False),
        sa.Column('semester',sa.Integer(),nullable=False))

def downgrade():
    op.drop_table('matakuliah')
