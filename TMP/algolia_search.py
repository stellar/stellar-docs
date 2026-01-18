import requests
import json
app_id='TYESA7T7LE'
api_key='e7747db6325c07b20ac1c39ab95c24bf'
url=f'https://{app_id}-dsn.algolia.net/1/indexes/pages/query'
payload={'params':'query=Open%20Protocol%20Discussion&hitsPerPage=50'}
headers={'X-Algolia-API-Key':api_key,'X-Algolia-Application-Id':app_id,'Content-Type':'application/json'}
resp=requests.post(url, headers=headers, data=json.dumps(payload))
print(resp.status_code)
data=resp.json()
for hit in data.get('hits', []):
    print(hit.get('title'), hit.get('url'))
