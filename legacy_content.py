import re,json,requests
url='https://stellar.org/blog/legacy'
text=requests.get(url, headers={'User-Agent':'Mozilla/5.0'}).text
match=re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', text)
data=json.loads(match.group(1))
page=data['props']['pageProps']
print(type(page['content']))
print(page['content'].keys())
