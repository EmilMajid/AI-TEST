# Mock Mode Konfiqurasiya Bələdçisi

## Kritik Fayllar

### 1. Authentication (Login)
**Fayl:** `app/api/auth/login/route.ts`
- **Sətir 16:** `const isDemoMode = true` - Mock modu aktivləşdirir
- **Sətir 19:** `let shouldTryRealAuth = false` - Real DB-yə müraciət etmir
- **Sətir 47-208:** Mock istifadəçilər siyahısı
- **Vacib:** Bütün mock istifadəçilər `region` sahəsinə malik olmalıdır!

**Test üçün istifadəçilər:**
- `sevinc.ismayilova@test.com` / `test12345` (8-ci sinif, Lənkəran)
- `ali.velizade@test.com` / `test12345` (8-ci sinif, Bakı)

### 2. Middleware
**Fayl:** `middleware.ts`
- **Sətir 8:** `const isDemoMode = true` - Session yoxlamasını bypass edir

### 3. Mövzu (Topics) API
**Fayl:** `app/api/textbooks/topics/route.ts`
- `toc.xhtml` fayllarından mövzuları parse edir
- Test: `http://localhost:3000/api/textbooks/topics?class=8`

**Fayl:** `app/dashboard/test/page.tsx`
- **Sətir 41-55:** API-dan mövzuları yükləyir
- **Vacib:** Hardcoded TOPICS istifadə etmir!

### 4. Dashboard
**Fayl:** `app/dashboard/page.tsx`
- **Sətir 61-63:** Region yoxlaması - əgər `userData.region` yoxdursa modal açır
- **Həll:** Bütün mock istifadəçilər region sahəsinə malik olmalıdır

## Problemlərin Həlli

### Problem: "Demo İstifadəçi" görünür
**Səbəb:** Şifrə yanlışdır və ya mock siyahısında istifadəçi yoxdur
**Həll:** `app/api/auth/login/route.ts` faylında mock siyahısını yoxlayın

### Problem: Region modal açılır
**Səbəb:** Mock istifadəçinin `region` sahəsi yoxdur
**Həll:** `app/api/auth/login/route.ts` - sətir 280-də `region: "Bakı"` əlavə edin

### Problem: Mövzular görünmür
**Səbəb:** API çağırılmır və ya `toc.xhtml` tapılmır
**Həll:** 
1. `app/dashboard/test/page.tsx` - sətir 45-də API çağırıldığını yoxlayın
2. `public/textbooks/8/riyaziyyat/OEBPS/toc.xhtml` faylının olduğunu yoxlayın

## Test Skriptləri

```bash
# Login testi
node scripts/test_login.js

# Topics API testi  
node scripts/test-topics-api.js

# Generic fallback testi
node scripts/test_generic_login.js
```

## Yoxlama Siyahısı (Hər dəyişiklikdən sonra)

- [ ] Login işləyir? (sevinc.ismayilova@test.com)
- [ ] Region modal açılmır?
- [ ] Dashboard-da düzgün ad görünür? (Sevinc İsmayılova)
- [ ] Mövzular dropdown-da var? (Riyaziyyat seçəndə)
- [ ] Console-da "[Mock Auth]" yazır? ("[Demo Auth]" deyil)

## Git Workflow

```bash
# Dəyişiklikləri yadda saxla
git add .
git commit -m "Açıqlayıcı mesaj"
git push

# Əgər problem olarsa, geri qayıt
git log --oneline  # Commit tarixini gör
git checkout <commit-hash>  # Köhnə versiyaya qayıt
```
