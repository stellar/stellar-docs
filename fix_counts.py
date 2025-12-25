from pathlib import Path
import re
lines = Path('patches/@stoplight+mosaic+1.53.4.patch').read_text(encoding='utf-8').split('\n')
result = []
i = 0
pattern = re.compile(r"^@@ -(\d+)(,\d+)? \+(\d+)(,\d+)? @@(.*)")
while i < len(lines):
    line = lines[i]
    if line.startswith('@@ '):
        j = i + 1
        original_count = 0
        patched_count = 0
        while j < len(lines) and not lines[j].startswith('@@ ') and not lines[j].startswith('diff --git '):
            l = lines[j]
            if l.startswith('+') and not l.startswith('+++'):
                patched_count += 1
            elif l.startswith('-') and not l.startswith('---'):
                original_count += 1
            elif l.startswith('\\'):
                pass
            else:
                original_count += 1
                patched_count += 1
            j += 1
        m = pattern.match(line)
        if m:
            orig_start = m.group(1)
            patch_start = m.group(3)
            suffix = m.group(5) or ''
            new_header = f"@@ -{orig_start},{original_count} +{patch_start},{patched_count} @@{suffix}"
        else:
            new_header = line
        result.append(new_header)
        result.extend(lines[i+1:j])
        i = j
    else:
        result.append(line)
        i += 1
Path('patches/@stoplight+mosaic+1.53.4.patch').write_text('\n'.join(result), encoding='utf-8')
print('header counts updated, total lines', len(result))
