from app.core.auth import verify_password, get_password_hash
import sys

def test():
    try:
        password = "test"
        # Create a valid bcrypt hash
        hashed = get_password_hash(password)
        print(f"Generated hash: {hashed}")
        
        # Test verification
        match = verify_password(password, hashed)
        print(f"Match: {match}")
        
        # Test with the 'hashed' string from main.py seed
        try:
            print("Testing with 'hashed' string...")
            verify_password("any", "hashed")
        except Exception as e:
            print(f"Caught error with 'hashed' string: {e}")
            
        # Test with a very long password
        try:
            long_pass = "a" * 100
            print(f"Testing with {len(long_pass)} char password...")
            get_password_hash(long_pass)
        except Exception as e:
            print(f"Caught error with long password: {e}")

    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
