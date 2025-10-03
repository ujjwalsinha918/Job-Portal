"""add skills column to users

Revision ID: 2df93b56117b
Revises: 
Create Date: 2025-10-03 16:21:16.127489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '2df93b56117b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add 'skills' column to 'users' table
    op.add_column('users', sa.Column('skills', sa.String(length=255), nullable=True))
    # Optional: create index on 'id' if not already present
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop index if exists
    op.drop_index(op.f('ix_users_id'), table_name='users')
    # Drop 'skills' column
    op.drop_column('users', 'skills')
