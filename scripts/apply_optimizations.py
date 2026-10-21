import re
import os

print("Applying performance and accessibility optimizations...")

# 1. Update app/layout.tsx
layout_path = 'app/layout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout = f.read()

# Replace afterInteractive with lazyOnload for adsbygoogle and meta-pixel
layout = layout.replace(
    'id="adsbygoogle-init"\n          strategy="afterInteractive"',
    'id="adsbygoogle-init"\n          strategy="lazyOnload"'
)
layout = layout.replace(
    'id="meta-pixel"\n          strategy="afterInteractive"',
    'id="meta-pixel"\n          strategy="lazyOnload"'
)

# Add preconnect in head if not present
if 'preconnect" href="https://pagead2.googlesyndication.com' not in layout:
    old_head = '<head>\n        <meta name="google" content="notranslate" />\n      </head>'
    new_head = '<head>\n        <meta name="google" content="notranslate" />\n        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />\n        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />\n      </head>'
    layout = layout.replace(old_head, new_head)

# Update icon
layout = layout.replace('{ url: "/logo.jpg" }', '{ url: "/logo.webp" },\n      { url: "/logo.jpg" }')
layout = layout.replace('apple: [{ url: "/logo.jpg" }]', 'apple: [{ url: "/logo.webp" }, { url: "/logo.jpg" }]')

with open(layout_path, 'w', encoding='utf-8', newline='') as f:
    f.write(layout)
print("app/layout.tsx updated.")

# 2. Update next.config.mjs
next_config_path = 'next.config.mjs'
with open(next_config_path, 'r', encoding='utf-8') as f:
    config = f.read()

old_headers = """          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },"""

new_headers = """          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },"""

if 'Strict-Transport-Security' not in config:
    config = config.replace(old_headers, new_headers)
    with open(next_config_path, 'w', encoding='utf-8', newline='') as f:
        f.write(config)
    print("next.config.mjs updated with HSTS & COOP headers.")

# 3. Update components/layout/footer.tsx
footer_path = 'components/layout/footer.tsx'
with open(footer_path, 'r', encoding='utf-8') as f:
    footer = f.read()

# Fix aboutHref
footer = footer.replace(
    'const aboutHref = lang === "az" ? "/about" : `/${lang}/about`',
    'const aboutHref = lang === DEFAULT_LOCALE ? "/about" : `/${lang}/about`'
)

# Update logo to webp
footer = footer.replace(
    'src="/logo.jpg"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  className="object-contain rounded-lg"',
    'src="/logo.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="36px"\n                  className="object-contain rounded-lg"'
)

# Update social icons target size in col 1 (lines 181-207)
footer = footer.replace(
    'className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-tr',
    'className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-gradient-to-tr'
)
footer = footer.replace(
    'className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2]',
    'className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-[#1877F2]'
)
footer = footer.replace(
    'className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#FF0000]',
    'className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-[#FF0000]'
)
footer = footer.replace(
    'className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600',
    'className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-emerald-600'
)

# Update social links in col 4 for better touch targets and spacing
footer = footer.replace(
    '<div className="space-y-1">',
    '<div className="space-y-2.5 pt-0.5">'
)
footer = footer.replace(
    'className="hover:text-pink-400 transition-colors flex items-center gap-1.5"',
    'className="hover:text-pink-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"'
)
footer = footer.replace(
    'className="hover:text-blue-400 transition-colors flex items-center gap-1.5"',
    'className="hover:text-blue-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"'
)
footer = footer.replace(
    'className="hover:text-red-400 transition-colors flex items-center gap-1.5"',
    'className="hover:text-red-400 transition-colors inline-flex items-center gap-2 py-1 px-0.5"'
)

with open(footer_path, 'w', encoding='utf-8', newline='') as f:
    f.write(footer)
print("components/layout/footer.tsx updated.")

# 4. Update components/pages/home-featured-posts.tsx
posts_path = 'components/pages/home-featured-posts.tsx'
with open(posts_path, 'r', encoding='utf-8') as f:
    posts = f.read()

# Fix heading hierarchy: H3 -> H2 for section title
posts = posts.replace(
    '<h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">\n            {ui.title}\n          </h3>',
    '<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">\n            {ui.title}\n          </h2>'
)

# Fix contrast: read time
posts = posts.replace(
    'text-slate-400 text-[11px]',
    'text-slate-600 text-xs font-medium'
)

# Fix contrast: tags
posts = posts.replace(
    'text-[10px] font-medium text-slate-500 bg-slate-100',
    'text-[11px] font-semibold text-slate-700 bg-slate-200/80'
)

# Fix contrast: date
posts = posts.replace(
    '<span className="text-[11px] text-slate-400">{post.publishDate}</span>',
    '<span className="text-xs font-medium text-slate-600">{post.publishDate}</span>'
)

with open(posts_path, 'w', encoding='utf-8', newline='') as f:
    f.write(posts)
print("components/pages/home-featured-posts.tsx updated.")

# 5. Update components/pages/home-content.tsx
home_path = 'components/pages/home-content.tsx'
with open(home_path, 'r', encoding='utf-8') as f:
    home = f.read()

# Update logo to webp with responsive sizes
home = home.replace(
    'src="/logo.jpg"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  className="object-contain rounded-md"\n                  priority',
    'src="/logo.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="(max-width: 640px) 32px, 36px"\n                  className="object-contain rounded-md"\n                  priority'
)

# Fix heading order: What is TESTAI.AZ section
home = home.replace(
    '<h3 className="text-xl sm:text-2xl font-bold text-gray-900">\n                {t.aboutSectionTitle}\n              </h3>',
    '<h2 className="text-xl sm:text-2xl font-bold text-gray-900">\n                {t.aboutSectionTitle}\n              </h2>'
)

# Fix heading order: Steps section
home = home.replace(
    '<h3 className="text-xl sm:text-3xl font-extrabold text-center mb-8 text-slate-900">\n            {t.stepsTitle}\n          </h3>',
    '<h2 className="text-xl sm:text-3xl font-extrabold text-center mb-8 text-slate-900">\n            {t.stepsTitle}\n          </h2>'
)

# Fix heading order: Community section
home = home.replace(
    '<h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">\n              {t.communityTitle}\n            </h3>',
    '<h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">\n              {t.communityTitle}\n            </h2>'
)

# Fix contrast in social cards badges
home = home.replace(
    'text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full group-hover:bg-pink-100',
    'text-[11px] font-semibold text-pink-700 bg-pink-100/90 px-2.5 py-1 rounded-full group-hover:bg-pink-200/80'
)
home = home.replace(
    'text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-100',
    'text-[11px] font-semibold text-blue-700 bg-blue-100/90 px-2.5 py-1 rounded-full group-hover:bg-blue-200/80'
)
home = home.replace(
    'text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full group-hover:bg-red-100',
    'text-[11px] font-semibold text-red-700 bg-red-100/90 px-2.5 py-1 rounded-full group-hover:bg-red-200/80'
)
home = home.replace(
    'text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-100',
    'text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full group-hover:bg-emerald-200/80'
)

# Fix contrast for gray-500 description text in cards
home = home.replace(
    'className="text-xs text-gray-500 mb-4 leading-relaxed"',
    'className="text-xs text-gray-600 mb-4 leading-relaxed"'
)
home = home.replace(
    'className="text-xs text-gray-500 mb-4 break-all leading-relaxed"',
    'className="text-xs text-gray-600 mb-4 break-all leading-relaxed"'
)

with open(home_path, 'w', encoding='utf-8', newline='') as f:
    f.write(home)
print("components/pages/home-content.tsx updated.")

# 6. Update discoveries and auth pages
for path in ['components/discoveries/discoveries-catalog.tsx', 'components/discoveries/discovery-viewer.tsx', 'app/login/page.tsx', 'app/register/page.tsx']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('src="/logo.jpg"', 'src="/logo.webp"')
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(c)
        print(f"{path} updated to /logo.webp.")

print("All file optimizations applied successfully!")
