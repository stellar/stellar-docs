import requests
url='https://stellar.org/api/search'
params={'q':'open protocol'}
r=requests.get(url, params=params, headers={'User-Agent':'Mozilla/5.0'})
print(r.status_code)
print(r.text[:500])
