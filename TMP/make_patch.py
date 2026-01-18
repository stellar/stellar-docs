from pathlib import Path

def clean_diff(src, rel_path):
    data = Path(src).read_bytes()
    if data.startswith(b'\xff\xfe') or data.startswith(b'\xfe\xff'):
        text = data.decode('utf-16')
    else:
        text = data.decode('utf-8', errors='ignore')
    full_path = f"C:/Users/John/AppData/Local/Yarn/Cache/v6/npm-@stoplight-mosaic-1.53.4-04e03a4dfb95e0a451cd2bde6e14ad66103a684d-integrity/node_modules/@stoplight/mosaic/{rel_path}"
    text = text.replace(f"a/{full_path}", f"a/node_modules/@stoplight/mosaic/{rel_path}")
    text = text.replace(f"b/{full_path}", f"b/node_modules/@stoplight/mosaic/{rel_path}")
    text = text.replace(f"--- a/{full_path}", f"--- a/node_modules/@stoplight/mosaic/{rel_path}")
    text = text.replace(f"+++ b/{full_path}", f"+++ b/node_modules/@stoplight/mosaic/{rel_path}")
    return text

parts = [
    clean_diff('tmp1.diff', 'core.esm.js'),
    clean_diff('tmp2.diff', 'core.umd.js'),
]
combined = '\n'.join(parts)
lines = combined.split('\n')
result = []
skip_blank = False
for line in lines:
    if skip_blank and line == '':
        continue
    result.append(line)
    skip_blank = line.startswith('diff --git') or line.startswith('index') or line.startswith('---') or line.startswith('+++')
final = '\n'.join(result).strip() + '\n'
Path('patches/@stoplight+mosaic+1.53.4.patch').write_text(final, encoding='utf-8')
print('generated patch lines', len(final.splitlines()))
