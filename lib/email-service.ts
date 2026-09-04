import nodemailer from "nodemailer"
import { generateTestResultEmailHtml, type TestEmailData } from "./email-templates/test-result-email"

export interface SendResultEmailParams extends TestEmailData {
  parentEmail: string
}

export interface EmailSendResponse {
  success: boolean
  messageId?: string
  simulated?: boolean
  error?: string
}

function getTransporter() {
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
    auth: {
      user,
      pass,
    },
  })
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

  const transporter = getTransporter()
  const fromAddress = process.env.EMAIL_FROM || '"testai.az Təhsil Portalı" <info@testai.az>'
  const subject = `📊 ${studentName} - ${textbook} imtahan nəticəsi: ${score}%`
  const html = generateTestResultEmailHtml(params)

  if (!transporter) {
    console.log(
      `[EMAIL SIMULATION] SMTP not configured. Simulating email dispatch:` +
        `\n  To: ${parentEmail}` +
        `\n  Subject: ${subject}` +
        `\n  Student: ${studentName}, Score: ${score}%`
    )
    return {
      success: true,
      simulated: true,
      messageId: `sim-${Date.now()}`,
    }
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: parentEmail,
      subject,
      html,
    })

    console.log(`[EMAIL SUCCESS] Sent test result email to ${parentEmail}, ID: ${info.messageId}`)
    return {
      success: true,
      messageId: info.messageId,
      simulated: false,
    }
  } catch (error: any) {
    console.error("[EMAIL ERROR] Failed to send email via SMTP:", error)
    return {
      success: false,
      error: error?.message || "E-mail göndərilərkən xəta baş verdi",
    }
  }
}
