with open('app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace('/ingilis|english/i', '/ingilis|english|İngilis/i')
new_content = new_content.replace('/ingilis|alman|fransız|fransiz|rus/i', '/ingilis|İngilis|alman|fransız|fransiz|rus/i')

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done!')
