"""add saved_jobs table

Revision ID: 73cada93df8f
Revises: 23e4752d0b6b
Create Date: 2025-10-06 18:41:40.333074

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '73cada93df8f'
down_revision: Union[str, Sequence[str], None] = '23e4752d0b6b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create saved_jobs table safely
    op.create_table(
        'saved_jobs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('job_id', sa.Integer(), sa.ForeignKey('jobs.id'), nullable=False),
        sa.UniqueConstraint('user_id', 'job_id', name='unique_user_job'),
        mysql_collate='utf8mb4_general_ci',
        mysql_engine='InnoDB'
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop saved_jobs table on downgrade
    op.drop_table('saved_jobs')
