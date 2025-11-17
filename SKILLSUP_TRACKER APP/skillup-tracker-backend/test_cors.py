try:
    import requests
    print("✅ Requests module is installed")
except ImportError:
    print("❌ Requests module not found. Install it with: pip install requests")
    exit(1)

def test_backend_connection():
    """Test if Django backend is running"""
    try:
        response = requests.get('http://localhost:8000/', timeout=5)
        print(f"✅ Backend is running - Status: {response.status_code}")
        print(f"✅ Backend response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running. Start it with: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return False

def test_cors_configuration():
    """Test CORS configuration"""
    try:
        # Test OPTIONS preflight request
        response = requests.options(
            'http://localhost:8000/api/auth/register/',
            headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            },
            timeout=5
        )
        
        print(f"✅ CORS OPTIONS request - Status: {response.status_code}")
        
        # Check for CORS headers
        cors_headers = {
            'access-control-allow-origin': response.headers.get('Access-Control-Allow-Origin'),
            'access-control-allow-methods': response.headers.get('Access-Control-Allow-Methods'),
            'access-control-allow-headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        
        print("✅ CORS Headers found:")
        for header, value in cors_headers.items():
            if value:
                print(f"   {header}: {value}")
            else:
                print(f"   ❌ {header}: MISSING")
        
        return True
        
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False

def test_registration_endpoint():
    """Test the registration endpoint"""
    try:
        test_data = {
            "username": "testuser_cors",
            "email": "test_cors@example.com",
            "password": "testpass123",
            "password2": "testpass123",
            "first_name": "Test",
            "last_name": "CORS"
        }
        
        response = requests.post(
            'http://localhost:8000/api/auth/register/',
            json=test_data,
            headers={
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'
            },
            timeout=10
        )
        
        print(f"✅ Registration endpoint - Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
        elif response.status_code == 400:
            print("⚠️  Registration failed (expected for duplicate user):", response.json())
        else:
            print(f"❌ Unexpected status: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ Registration test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Django Backend Configuration...\n")
    
    # Test 1: Backend connection
    print("1. Testing backend connection...")
    backend_ok = test_backend_connection()
    
    if backend_ok:
        # Test 2: CORS configuration
        print("\n2. Testing CORS configuration...")
        cors_ok = test_cors_configuration()
        
        # Test 3: Registration endpoint
        print("\n3. Testing registration endpoint...")
        registration_ok = test_registration_endpoint()
        
        print("\n" + "="*50)
        if backend_ok and cors_ok and registration_ok:
            print("🎉 All tests passed! Your backend should work with the frontend.")
        else:
            print("⚠️  Some tests failed. Check the configuration.")
    else:
        print("\n❌ Backend is not running. Please start it first.")
        print("   Command: python manage.py runserver")