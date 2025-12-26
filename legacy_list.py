import re,json,requests,pprint
url='https://stellar.org/blog/legacy'
text=requests.get(url, headers={'User-Agent':'Mozilla/5.0'}).text
match=re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', text)
data=json.loads(match.group(1))
page=data['props']['pageProps']
content=page['content']
print(len(content))
pp=pprint.PrettyPrinter(depth=2)
pp.pprint(content[:3])
