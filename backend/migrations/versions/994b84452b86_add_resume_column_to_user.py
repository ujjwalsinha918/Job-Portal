"""add resume column to user

Revision ID: 994b84452b86
Revises: 73cada93df8f
Create Date: 2025-10-07 16:38:04.107573
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '994b84452b86'
down_revision = '73cada93df8f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    # Only add the resume column to users
    op.add_column('users', sa.Column('resume', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove the resume column if rolling back
    op.drop_column('users', 'resume')
