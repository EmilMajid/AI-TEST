import os

print("Applying Phase 2 optimizations...")

# 1. Update components/pages/home-content.tsx
home_path = 'components/pages/home-content.tsx'
with open(home_path, 'r', encoding='utf-8') as f:
    home = f.read()

# Use logo-sm.webp for header
home = home.replace(
    'src="/logo.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="(max-width: 640px) 32px, 36px"',
    'src="/logo-sm.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="36px"'
)

# Fix open-tests link routing bug (lang === "az" -> lang === DEFAULT_LOCALE)
home = home.replace(
    '<Link href={lang === "az" ? "/open-tests" : `/${lang}/open-tests`}>',
    '<Link href={lang === DEFAULT_LOCALE ? "/open-tests" : `/${lang}/open-tests`}>'
)

# Fix steps card titles: H4 -> H3
home = home.replace(
    '<h4 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{step.title}</h4>',
    '<h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900">{step.title}</h3>'
)

# Fix community card titles: H4 -> H3
home = home.replace(
    '<h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">\n                  Instagram\n                </h4>',
    '<h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">\n                  Instagram\n                </h3>'
)
home = home.replace(
    '<h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">\n                  Facebook\n                </h4>',
    '<h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">\n                  Facebook\n                </h3>'
)
home = home.replace(
    '<h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">\n                  YouTube\n                </h4>',
    '<h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">\n                  YouTube\n                </h3>'
)
home = home.replace(
    '<h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">\n                  {t.officialEmail}\n                </h4>',
    '<h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">\n                  {t.officialEmail}\n                </h3>'
)

# Fix contrast for card action text (especially Contact Us / emerald-600)
home = home.replace(
    'className="flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform"',
    'className="flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform"'
)
home = home.replace(
    'className="flex items-center text-xs font-semibold text-pink-600 group-hover:translate-x-1 transition-transform"',
    'className="flex items-center text-xs font-bold text-pink-800 group-hover:translate-x-1 transition-transform"'
)
home = home.replace(
    'className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform"',
    'className="flex items-center text-xs font-bold text-blue-800 group-hover:translate-x-1 transition-transform"'
)
home = home.replace(
    'className="flex items-center text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform"',
    'className="flex items-center text-xs font-bold text-red-800 group-hover:translate-x-1 transition-transform"'
)

with open(home_path, 'w', encoding='utf-8', newline='') as f:
    f.write(home)
print("components/pages/home-content.tsx updated.")

# 2. Update components/pages/home-featured-posts.tsx (H4 -> H3)
posts_path = 'components/pages/home-featured-posts.tsx'
with open(posts_path, 'r', encoding='utf-8') as f:
    posts = f.read()

posts = posts.replace(
    '<h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">\n                  <Link href={articleUrl}>{tr.title}</Link>\n                </h4>',
    '<h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">\n                  <Link href={articleUrl}>{tr.title}</Link>\n                </h3>'
)

with open(posts_path, 'w', encoding='utf-8', newline='') as f:
    f.write(posts)
print("components/pages/home-featured-posts.tsx updated.")

# 3. Update components/layout/footer.tsx (Use logo-sm.webp)
footer_path = 'components/layout/footer.tsx'
with open(footer_path, 'r', encoding='utf-8') as f:
    footer = f.read()

footer = footer.replace(
    'src="/logo.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="36px"',
    'src="/logo-sm.webp"\n                  alt="TESTAI.AZ Logo"\n                  fill\n                  sizes="36px"'
)

with open(footer_path, 'w', encoding='utf-8', newline='') as f:
    f.write(footer)
print("components/layout/footer.tsx updated.")

# 4. Update components/blog/blog-list-view.tsx
blog_path = 'components/blog/blog-list-view.tsx'
if os.path.exists(blog_path):
    with open(blog_path, 'r', encoding='utf-8') as f:
        blog = f.read()
    blog = blog.replace(
        'const articleLink = lang === "az" ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`',
        'const articleLink = lang === DEFAULT_LOCALE ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`'
    )
    with open(blog_path, 'w', encoding='utf-8', newline='') as f:
        f.write(blog)
    print("components/blog/blog-list-view.tsx updated.")

# 5. Update app/layout.tsx (defer Meta Pixel download to idle)
layout_path = 'app/layout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout = f.read()

old_pixel_script = """              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2027404764555987');
              fbq('track', 'PageView');"""

new_pixel_script = """              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];
              var loadScript=function(){
                t=b.createElement(e);t.async=!0;t.src=v;
                s=b.getElementsByTagName(e)[0];
                if(s&&s.parentNode){s.parentNode.insertBefore(t,s);}
              };
              if('requestIdleCallback' in window){
                requestIdleCallback(function(){setTimeout(loadScript,1200);});
              }else{
                setTimeout(loadScript,1500);
              }
              }(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2027404764555987');
              fbq('track', 'PageView');"""

if old_pixel_script in layout:
    layout = layout.replace(old_pixel_script, new_pixel_script)
    with open(layout_path, 'w', encoding='utf-8', newline='') as f:
        f.write(layout)
    print("app/layout.tsx Meta Pixel deferred.")
else:
    print("Note: old_pixel_script snippet exact match not found in layout, skipping layout pixel change.")

print("Phase 2 optimizations applied successfully!")
