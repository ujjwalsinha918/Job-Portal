"""Add skills column to users

Revision ID: 23e4752d0b6b
Revises: None
Create Date: 2025-10-06 11:53:25.296461
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '23e4752d0b6b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema: add 'skills' column to users table."""
    op.add_column('users', sa.Column('skills', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Downgrade schema: remove 'skills' column from users table."""
    op.drop_column('users', 'skills')
