# fix_none_string.py
# Run this script to fix the 'None' string issue in the database

import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from core.database import SessionLocal

def fix_none_strings():
    """Fix resume column where it contains the string 'None' instead of NULL"""
    
    db = SessionLocal()
    try:
        print("🔍 Checking for 'None' string values in resume column...")
        
        # Check current values
        result = db.execute(text("""
            SELECT id, email, name, resume 
            FROM users 
            WHERE resume = 'None' OR resume = 'null' OR resume = ''
        """))
        
        users_with_none = result.fetchall()
        
        if not users_with_none:
            print("✅ No 'None' string values found!")
            
            # Show all users anyway
            print("\n📊 Current state of all users:")
            result = db.execute(text("SELECT id, email, resume FROM users"))
            for user in result.fetchall():
                status = "NULL" if user[2] is None else f"'{user[2]}'"
                print(f"  - ID: {user[0]}, Email: {user[1]}, Resume: {status}")
            return
        
        print(f"\n⚠️  Found {len(users_with_none)} users with invalid resume values:")
        for user in users_with_none:
            print(f"  - ID: {user[0]}, Email: {user[1]}, Resume: '{user[3]}'")
        
        # Fix the values
        print("\n🔧 Fixing invalid values...")
        db.execute(text("""
            UPDATE users 
            SET resume = NULL 
            WHERE resume = 'None' OR resume = 'null' OR resume = ''
        """))
        
        db.commit()
        print("✅ Fixed! Resume column now has proper NULL values.")
        
        # Verify
        result = db.execute(text("""
            SELECT id, email, resume IS NULL as is_null, resume
            FROM users
        """))
        
        print("\n📊 Current state of all users:")
        print("-" * 70)
        for user in result.fetchall():
            status = "NULL (correct)" if user[2] else f"Has value: '{user[3]}'"
            print(f"  ID: {user[0]}, Email: {user[1]}, Resume: {status}")
        print("-" * 70)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 70)
    print("FIX 'None' STRING IN RESUME COLUMN")
    print("=" * 70)
    print()
    
    fix_none_strings()
    
    print()
    print("=" * 70)
    print("✅ Done! Now restart your server and try uploading a resume.")
    print("=" * 70)