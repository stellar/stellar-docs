import xml.etree.ElementTree as ET
import requests
url='https://stellar.org/sitemap.xml'
text=requests.get(url).text
root=ET.fromstring(text)
ns={'ns':'http://www.sitemaps.org/schemas/sitemap/0.9'}
for loc in root.findall('.//ns:loc', ns):
    link=loc.text
    if 'open-protocol' in link:
        print(link)
