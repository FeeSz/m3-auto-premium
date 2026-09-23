from pathlib import Path
import difflib, json, hashlib

root = Path.cwd()
before = root / 'output/block-1/before'
paths = set()
for directory in ('src', 'tests'):
    paths.update(str(p.relative_to(root)).replace('\\', '/') for p in (root / directory).rglob('*') if p.is_file())
    paths.update(str(p.relative_to(before)).replace('\\', '/') for p in (before / directory).rglob('*') if p.is_file())
paths.update(['package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts', 'eslint.config.mjs'])
patch, changed = [], []
for name in sorted(paths):
    old, new = before / name, root / name
    a = old.read_text(encoding='utf-8').splitlines(keepends=True) if old.exists() else []
    b = new.read_text(encoding='utf-8').splitlines(keepends=True) if new.exists() else []
    if a != b:
        changed.append({'file': name, 'classification': 'REFINE' if old.exists() else 'NEW'})
        patch.extend(difflib.unified_diff(a, b, fromfile='a/'+name if old.exists() else '/dev/null', tofile='b/'+name, n=3))
(root / 'output/block-1/block-1.patch').write_text(''.join(patch), encoding='utf-8')
baseline = json.loads((root / 'output/block-1/baseline-hashes.json').read_text())
protected = [name for name in baseline if name.endswith('.css') or name in ['src/components/m3/header.tsx','src/components/m3/footer.tsx','src/data/vehicles.generated.json']]
assert all(hashlib.sha256((root / name).read_bytes()).hexdigest() == baseline[name] for name in protected), 'Protected file changed'
home='src/components/m3/home.tsx'
old=(before/home).read_text(encoding='utf-8'); new=(root/home).read_text(encoding='utf-8')
assert old[old.index('  return (', old.index('export function Home')):] == new[new.index('  return (', new.index('export async function Home')):], 'Home JSX changed'
(root / 'output/block-1/changed-files.json').write_text(json.dumps({'changed':changed,'protectedFilesUnchanged':protected,'homeJSXUnchanged':True},indent=2),encoding='utf-8')
print(json.dumps({'files':len(changed),'protectedUnchanged':len(protected),'homeJSXUnchanged':True}))
