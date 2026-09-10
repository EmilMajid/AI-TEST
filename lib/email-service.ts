import nodemailer from "nodemailer"
import { generateTestResultEmailHtml, type TestEmailData } from "./email-templates/test-result-email"

export interface SendResultEmailParams extends TestEmailData {
  parentEmail: string
}

export interface EmailSendResponse {
  success: boolean
  messageId?: string
  simulated?: boolean
  redirectedTo?: string
  error?: string
}

export interface DirectEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export function isDemoEmail(email: string): boolean {
  if (!email) return false
  const clean = email.toLowerCase().trim()
  return (
    clean.endsWith("@example.com") ||
    clean.endsWith("@demo.com") ||
    clean.startsWith("demo-") ||
    clean.startsWith("student-demo") ||
    clean.startsWith("parent-demo")
  )
}

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT) || 587
  const secure = process.env.SMTP_SECURE === "true" || port === 465

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

/**
 * Universal email dispatcher:
 * 1. Tries Resend REST API (if RESEND_API_KEY is present)
 * 2. Falls back to Nodemailer SMTP (if SMTP_* is configured)
 * 3. Falls back to simulated log mode if neither is configured
 */
export async function sendDirectEmail(params: DirectEmailParams): Promise<EmailSendResponse> {
  const { to, subject, html, from } = params
  const resendApiKey = process.env.RESEND_API_KEY || "re_durkG6BR_2Hk2bAz7XJkKh11aoZPGBoxY"
  const configuredFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM.replace(/^"|"$/g, "") : ""
  const primaryFrom = from || configuredFrom || "testai.az Təhsil Portalı <info@testai.az>"
  const fallbackFrom = "testai.az Təhsil Portalı <onboarding@resend.dev>"

  // 1. Resend API Dispatch
  if (resendApiKey) {
    try {
      // First attempt with primary domain (info@testai.az)
      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: primaryFrom,
          to: [to],
          subject,
          html,
        }),
      })

      let data = await res.json()

      // If domain is pending verification, retry with verified onboarding sender only for owner
      if (!res.ok && data?.statusCode === 403 && data?.message?.includes("not verified")) {
        console.warn(`[EMAIL] testai.az domain pending verification. Retrying for ${to}`)
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fallbackFrom,
            to: [to],
            subject,
            html,
          }),
        })
        data = await res.json()
      }

      if (res.ok && data?.id) {
        console.log(`[EMAIL SUCCESS - Resend] Sent to ${to}, ID: ${data.id}`)
        return {
          success: true,
          messageId: data.id,
          simulated: false,
        }
      } else {
        const errMsg = data?.message || `Resend xətası (${res.status})`
        console.error("[EMAIL ERROR - Resend API]:", data)
        return {
          success: false,
          error: errMsg,
        }
      }
    } catch (err: any) {
      console.error("[EMAIL ERROR - Resend Fetch]:", err?.message || err)
      return {
        success: false,
        error: err?.message || "Resend şəbəkə xətası",
      }
    }
  }

  // 2. Nodemailer SMTP Dispatch
  const transporter = getSmtpTransporter()
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: primaryFrom,
        to,
        subject,
        html,
      })
      console.log(`[EMAIL SUCCESS - SMTP] Sent to ${to}, ID: ${info.messageId}`)
      return {
        success: true,
        messageId: info.messageId,
        simulated: false,
      }
    } catch (smtpErr: any) {
      console.error("[EMAIL ERROR - SMTP]:", smtpErr?.message || smtpErr)
      return {
        success: false,
        error: smtpErr?.message || "SMTP xətası baş verdi",
      }
    }
  }

  // 3. Fallback: No email provider active
  console.error(
    `[EMAIL ERROR] Neither Resend nor SMTP active.\n  To: ${to}\n  Subject: ${subject}`
  )
  return {
    success: false,
    simulated: true,
    error: "E-mail xidməti aktivləşdirilməyib",
  }
}

export async function sendTestResultNotification(
  params: SendResultEmailParams
): Promise<EmailSendResponse> {
  const { parentEmail, studentName, textbook, score } = params

  if (!parentEmail || !parentEmail.includes("@")) {
    return {
      success: false,
      error: "Etibarlı valideyn e-mail ünvanı tapılmadı",
    }
  }

  // Demo Trap / Test Redirection Logic:
  // If the parent has a demo email or if TEST_EMAIL_RECIPIENT is set,
  // route the physical email to the developer/tester's real inbox so they can verify it.
  const testRecipient = process.env.TEST_EMAIL_RECIPIENT || "emilinpoctu@gmail.com"
  const isDemo = isDemoEmail(parentEmail)
  const effectiveRecipient = isDemo ? testRecipient : parentEmail
  const isRedirected = isDemo && testRecipient.toLowerCase() !== parentEmail.toLowerCase()

  const subjectPrefix = isRedirected ? `[Demo Valideyn: ${parentEmail}] ` : ""
  const subject = `${subjectPrefix}📊 ${studentName} - ${textbook} imtahan nəticəsi: ${score}%`

  let html = generateTestResultEmailHtml(params)
  if (isRedirected) {
    const banner = `
      <div style="background-color: #fef3c7; border: 1px solid #fde047; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #854d0e;">
        <strong>⚠️ Demo Sınaq Bildirişi:</strong> Bu məktub platformadakı <strong>${parentEmail}</strong> demo valideyn hesabı üçün ünvanlanmışdır və sistem tərəfindən birbaşa sizin real poçt qutunuza (<strong>${testRecipient}</strong>) çatdırılmışdır.
      </div>
    `
    html = html.replace('<div style="padding: 28px 24px;">', `<div style="padding: 28px 24px;">${banner}`)
  }

  const result = await sendDirectEmail({
    to: effectiveRecipient,
    subject,
    html,
  })

  return {
    ...result,
    redirectedTo: isRedirected ? effectiveRecipient : undefined,
  }
}
