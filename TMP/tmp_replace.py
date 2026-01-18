from pathlib import Path
import re
path = Path('node_modules/zustand/system/middleware.production.js')
text = path.read_text()
m = re.search(r"c\.removeItem\|\|console\.warn\([^)]+removeItem[^)]*\);", text)
print('found', bool(m))
if m:
    text = text.replace(m.group(0), 'c.removeItem||(c.removeItem=function(){});')
    path.write_text(text)
