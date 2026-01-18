import re
import json
import requests
url='https://stellar.org/blog/legacy'
text=requests.get(url, headers={'User-Agent':'Mozilla/5.0'}).text
match=re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', text)
if not match:
    raise SystemExit('no data')
data=json.loads(match.group(1))
sections=data['props']['pageProps'].get('sections',[])
for sec in sections:
    articles=sec.get('articles') or []
    for art in articles:
        print(art.get('title'), art.get('url'))
