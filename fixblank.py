from pathlib import Path
lines=Path('patches/@stoplight+mosaic+1.53.4.patch').read_text(encoding='utf-8').split('\n')
result=[]
skip_next_blank=False
for line in lines:
    if skip_next_blank and line=='':
        continue
    result.append(line)
    skip_next_blank=line.startswith('diff --git') or line.startswith('index') or line.startswith('---') or line.startswith('+++')
Path('patches/@stoplight+mosaic+1.53.4.patch').write_text('\n'.join(result),encoding='utf-8')
print('clean src lines', len(result))
