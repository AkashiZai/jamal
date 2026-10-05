import glob
import os
import re
import io
import urllib.request
import base64
from PIL import Image

import html

def fetch_and_resize_base64(url, max_width=300, max_height=225, quality=75):
    clean_url = html.unescape(url)
    print(f"Fetching: {clean_url}")
    req = urllib.request.Request(clean_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw_data = resp.read()
    
    img = Image.open(io.BytesIO(raw_data)).convert('RGB')
    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=quality, optimize=True)
    b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    print(f"  -> Encoded: {len(b64_str)} base64 chars (JPEG {img.size})")
    return f"data:image/jpeg;base64,{b64_str}"

def process_svgs():
    svg_files = glob.glob('design/figma_import/*.svg')
    url_cache = {}
    
    # First find all unique URLs
    for svg_file in svg_files:
        with open(svg_file, 'r', encoding='utf-8') as f:
            content = f.read()
        urls = re.findall(r'href=["\'](https?://[^"\']+)["\']', content)
        for u in urls:
            if u not in url_cache:
                url_cache[u] = None

    print(f"Found {len(url_cache)} unique image URLs to embed.")
    for u in url_cache:
        try:
            url_cache[u] = fetch_and_resize_base64(u)
        except Exception as e:
            print(f"Error fetching {u}: {e}")

    # Now replace in all SVGs
    for svg_file in svg_files:
        with open(svg_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        # Ensure xmlns:xlink is present on root svg
        if 'xmlns:xlink=' not in content:
            content = content.replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"')
        
        for u, b64 in url_cache.items():
            if b64 and u in content:
                # Replace href with both href and xlink:href for maximum Figma compatibility
                content = content.replace(f'href="{u}"', f'href="{b64}" xlink:href="{b64}"')
                content = content.replace(f"href='{u}'", f'href="{b64}" xlink:href="{b64}"')
        
        # Clean non-standard CSS clip-path which breaks in Figma SVG importer
        content = re.sub(r'clip-path=["\']inset\([^"\']+\)["\']', '', content)
        
        if content != orig_content:
            with open(svg_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {svg_file} with embedded base64 images.")

if __name__ == '__main__':
    process_svgs()
