export interface TestEmailData {
  parentName?: string
  studentName: string
  studentClass?: string
  studentSchool?: string
  textbook: string
  topic: string
  score: number
  correctCount: number
  totalQuestions: number
  timeSpentMinutes: number
  completedAt?: string
  dashboardUrl?: string
}

export function generateTestResultEmailHtml(data: TestEmailData): string {
  const scoreColor = data.score >= 80 ? "#16a34a" : data.score >= 60 ? "#ca8a04" : "#dc2626"
  const scoreBadgeBg = data.score >= 80 ? "#dcfce7" : data.score >= 60 ? "#fef9c3" : "#fee2e2"
  const statusText =
    data.score >= 80 ? "Əla Nəticə! 🌟" : data.score >= 60 ? "Yaxşı Nəticə 👍" : "Təkmilləşdirməyə ehtiyac var 📚"

  const formattedDate = data.completedAt
    ? new Date(data.completedAt).toLocaleString("az-AZ", { timeZone: "Asia/Baku" })
    : new Date().toLocaleString("az-AZ", { timeZone: "Asia/Baku" })

  const parentGreeting = data.parentName ? `Hörmətli ${data.parentName},` : "Hörmətli Valideyn,"
  const dashboardUrl = data.dashboardUrl || "https://testai.az/parent-dashboard"

  return `
<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İmtahan Nəticəsi Hesabatı - testai.az</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">testai.az</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Süni İntellekt Dəstəkli Təhsil Portalı</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">${parentGreeting}</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
        Övladınız <strong>${data.studentName}</strong> indicə <strong>${data.textbook}</strong> fənni üzrə testi tamamladı. İmtahan nəticələri aşağıdakı kimidir:
      </p>

      <!-- Score Banner -->
      <div style="background-color: ${scoreBadgeBg}; border: 1px solid ${scoreColor}33; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: ${scoreColor}; letter-spacing: 0.5px; margin-bottom: 4px;">
          ${statusText}
        </div>
        <div style="font-size: 48px; font-weight: 900; color: ${scoreColor}; line-height: 1.1;">
          ${data.score}%
        </div>
        <div style="font-size: 14px; color: #64748b; margin-top: 6px;">
          ${data.correctCount} düzgün / ${data.totalQuestions} sual
        </div>
      </div>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">📖 Fənn:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${data.textbook}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">📌 Mövzu:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${data.topic}</td>
          </tr>
          ${
            data.studentClass
              ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">🎒 Sinif:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${data.studentClass}-ci sinif</td>
          </tr>`
              : ""
          }
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">⏱️ Sərf Olunan Vaxt:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${data.timeSpentMinutes} dəqiqə</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;">📅 Tarix və Saat:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${formattedDate}</td>
          </tr>
        </tbody>
      </table>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="${dashboardUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(37,99,235,0.25);">
          Valideyn Panelinə Keçid Et →
        </a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 0;">
        Ətraflı zəif/güclü mövzu analizi və inkişaf qrafiki üçün panelə daxil olun.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px 0;">Bu bildiriş <strong>testai.az</strong> platformasında övladınızın hesabı ilə əlaqəli olduğu üçün göndərilmişdir.</p>
      <p style="margin: 0;">© 2026 testai.az - Bütün hüquqlar qorunur.</p>
    </div>

  </div>
</body>
</html>
  `
}
