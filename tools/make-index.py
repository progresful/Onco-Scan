#!/usr/bin/env python3
"""Copy landing/index.html to the site root (index.html) with its paths adjusted.
Run from the project root after every landing page edit:  python3 tools/make-index.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'landing/index.html').read_text()
s = re.sub(r'(url\(|src="|href=")assets/', r'\1landing/assets/', s)             # landing's own assets (first)
s = s.replace('"../', '"').replace("'../", "'").replace('(../', '(')            # ../patient/ -> patient/
(root / 'index.html').write_text(s)
print('index.html written,', len(s), 'bytes')
