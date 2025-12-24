import re,json,requests,pprint
url='https://stellar.org/blog/legacy'
text=requests.get(url, headers={'User-Agent':'Mozilla/5.0'}).text
match=re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', text)
data=json.loads(match.group(1))
hero=data['props']['pageProps']['hero']
pp=pprint.PrettyPrinter(depth=4)
pp.pprint(hero['latestItems'])
