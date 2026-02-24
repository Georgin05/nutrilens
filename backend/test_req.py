import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://127.0.0.1:8000/users/register',
    data=json.dumps({'email': 'test16@example.com', 'password': 'def'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    print('Status:', response.getcode())
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('Error Status:', e.getcode())
    print(e.read().decode('utf-8'))
