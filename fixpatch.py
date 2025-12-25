from pathlib import Path
import re
lines = Path('patches/@stoplight+mosaic+1.53.4.patch').read_text(encoding='utf-8').split('\n')
result_lines = []
i = 0
hunk_pattern = re.compile(r"^@@ -(\d+)(,\d+)? \+(\d+)(,\d+)? @@(.*)")
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
        m = hunk_pattern.match(line)
        if m:
            orig_start = m.group(1)
            patch_start = m.group(3)
            suffix = m.group(5) or ''
            new_header = f"@@ -{orig_start},{original_count} +{patch_start},{patched_count} @@{suffix}"
        else:
            new_header = line
        result_lines.append(new_header)
        for k in range(i+1, j):
            result_lines.append(lines[k])
        i = j
    else:
        result_lines.append(line)
        i += 1
Path('patches/@stoplight+mosaic+1.53.4.patch').write_text('\n'.join(result_lines), encoding='utf-8')
print('replaced hunk lengths')
