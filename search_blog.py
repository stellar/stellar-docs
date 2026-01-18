import requests, json
app_id='TYESA7T7LE'
api_key='e7747db6325c07b20ac1c39ab95c24bf'
url=f'https://{app_id}-dsn.algolia.net/1/indexes/pages/query'
params='query=Open%20Protocol%20Discussion&hitsPerPage=50&filters=_type:blogPage'
resp=requests.post(url, headers={'X-Algolia-API-Key':api_key,'X-Algolia-Application-Id':app_id,'Content-Type':'application/json'}, data=json.dumps({'params':params}))
data=resp.json()
for hit in data.get('hits', []):
    print(hit.get('title'), hit.get('url'))
