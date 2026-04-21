import requests

def test_api():
    base_url = "http://127.0.0.1:8000"
    
    # 1. Login to get token
    login_res = requests.post(f"{base_url}/users/login", json={"email": "test@example.com", "password": "password"})
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        return
    
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Test GET /meals/weekly
    weekly_res = requests.get(f"{base_url}/meals/weekly", headers=headers)
    print(f"GET /meals/weekly status: {weekly_res.status_code}")
    if weekly_res.status_code == 200:
        plans = weekly_res.json()
        print(f"Found {len(plans)} meal plans.")
        if plans and plans[0].get("meal_template"):
            print(f"Sample template: {plans[0]['meal_template']['name']}")
        else:
            print("Template not found in response!")
    else:
        print(f"Error details: {weekly_res.text}")

if __name__ == "__main__":
    test_api()
