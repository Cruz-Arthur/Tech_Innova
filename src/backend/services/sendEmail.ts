// backend/functions/sendEmail.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente

// Configuração do transportador Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // Use 'true' se for porta 465 (SSL/TLS), 'false' para 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Aceita certificados auto-assinados (para ambientes de desenvolvimento)
  }
});

// Interface para tipar os dados do formulário
interface FormData {
  name: string;
  email: string;
  message: string;
}

// Função para enviar os emails (admin e usuário)
export async function sendContactEmails(data: FormData): Promise<void> {
  const { name, email, message } = data;

  const nameFormatted = name.charAt(0).toUpperCase() + name.slice(1);

  // --- HTML do Email para Admin (Nova Mensagem) ---
  const mailToAdminHtml = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Mensagem - Tech Innova</title>
</head>
<body style="margin:0;padding:0;background-color:#0F3320;font-family:'Inter',Arial,sans-serif;word-break:break-word;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F3320;padding:32px 0;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;overflow:hidden;border-radius:12px;border:1px solid #1A5C35;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1A4D2E;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:40px;height:40px;background-color:#28C273;border-radius:8px;text-align:center;vertical-align:middle;transform:rotate(45deg);display:inline-block;">
                          <span style="display:block;transform:rotate(-45deg);font-weight:900;font-size:15px;color:#1A4D2E;line-height:40px;">TI</span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.3px;">Tech Innova</p>
                          <p style="margin:2px 0 0;font-size:12px;color:#6EE7A0;letter-spacing:0.5px;text-transform:uppercase;">Painel Interno</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;background-color:#28C273;color:#1A4D2E;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase;">Nova Mensagem</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ACCENT BAR -->
          <tr>
            <td style="background:linear-gradient(90deg,#28C273,#2F855A,#1A4D2E);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#FFFFFF;padding:32px;">

              <p style="margin:0 0 24px;font-size:15px;color:#374151;">Um novo contato foi recebido pelo formulário do site.</p>

              <!-- INFO ROWS -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #D1FAE5;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="background-color:#F0FFF4;padding:12px 16px;border-bottom:1px solid #D1FAE5;width:90px;">
                    <span style="font-size:11px;font-weight:700;color:#2F855A;text-transform:uppercase;letter-spacing:0.6px;">Nome</span>
                  </td>
                  <td style="background-color:#FFFFFF;padding:12px 16px;border-bottom:1px solid #D1FAE5;font-size:15px;color:#111827;font-weight:600;">${nameFormatted}</td>
                </tr>
                <tr>
                  <td style="background-color:#F0FFF4;padding:12px 16px;border-bottom:1px solid #D1FAE5;">
                    <span style="font-size:11px;font-weight:700;color:#2F855A;text-transform:uppercase;letter-spacing:0.6px;">Email</span>
                  </td>
                  <td style="background-color:#FFFFFF;padding:12px 16px;border-bottom:1px solid #D1FAE5;font-size:15px;">
                    <a href="mailto:${email}" style="color:#28C273;text-decoration:none;font-weight:500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#F0FFF4;padding:12px 16px;vertical-align:top;">
                    <span style="font-size:11px;font-weight:700;color:#2F855A;text-transform:uppercase;letter-spacing:0.6px;">Mensagem</span>
                  </td>
                  <td style="background-color:#FFFFFF;padding:12px 16px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;overflow-wrap:break-word;">${message}</td>
                </tr>
              </table>

              <!-- REPLY CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <a href="mailto:${email}" style="display:inline-block;background-color:#1A4D2E;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;border-radius:8px;letter-spacing:0.2px;">
                      Responder ${nameFormatted} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1A4D2E;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#6EE7A0;">Gerado automaticamente pelo sistema de contato da Tech Innova.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  // --- HTML do Email para Usuário (Confirmação de Recebimento) ---
  const mailToUserHtml = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mensagem Recebida - Tech Innova</title>
</head>
<body style="margin:0;padding:0;background-color:#0F3320;font-family:'Inter',Arial,sans-serif;word-break:break-word;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F3320;padding:32px 0;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;overflow:hidden;border-radius:12px;border:1px solid #1A5C35;">

          <!-- HEADER HERO -->
          <tr>
            <td style="background-color:#1A4D2E;padding:40px 32px 36px;text-align:center;">
              <!-- Logo TI -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:20px;">
                <tr>
                  <td style="width:48px;height:48px;background-color:#28C273;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="display:block;font-weight:900;font-size:17px;color:#1A4D2E;line-height:48px;">TI</span>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">Tech Innova</p>
              <p style="margin:0;font-size:14px;color:#6EE7A0;letter-spacing:0.4px;">Soluções Ágeis para sua Empresa</p>
            </td>
          </tr>

          <!-- ACCENT BAR -->
          <tr>
            <td style="background:linear-gradient(90deg,#28C273,#2F855A,#1A4D2E);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#FFFFFF;padding:36px 32px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1A4D2E;">Olá, ${nameFormatted}!</p>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
                Recebemos sua mensagem e estamos felizes com seu contato.<br>
                Nossa equipe analisará sua solicitação e retornará em breve com as informações que você precisa.
              </p>

              <!-- MESSAGE ECHO -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-left:3px solid #28C273;background-color:#F0FFF4;padding:16px 20px;border-radius:0 8px 8px 0;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2F855A;text-transform:uppercase;letter-spacing:0.6px;">Sua mensagem</p>
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;overflow-wrap:break-word;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="text-align:center;">
                    <a href="https://tech-innova-roan.vercel.app" target="_blank" style="display:inline-block;background-color:#28C273;color:#1A4D2E;text-decoration:none;font-size:14px;font-weight:800;padding:14px 32px;border-radius:50px;letter-spacing:0.2px;">
                      Visitar nosso site &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1A4D2E;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#FFFFFF;">Equipe Tech Innova</p>
              <p style="margin:0;font-size:12px;color:#6EE7A0;">Capacitando empresas com desenvolvimento de software personalizado.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  // Objeto do email para o Admin
  const mailToAdmin = {
    from: `"${name}" <${email}>`,
    to: `"${process.env.EMAIL_TO_NAME}" <${process.env.EMAIL_TO}>`,
    subject: `Nova mensagem de ${name} no Tech Innova`,
    html: mailToAdminHtml,
    replyTo: email,
  };

  // Objeto do email para o Usuário
  const mailToUser = {
    from: `"Tech Innova" <${process.env.EMAIL_USER}>`,
    to: `"${name}" <${email}>`,
    subject: 'Recebemos sua mensagem!',
    html: mailToUserHtml,
  };

  await transporter.sendMail(mailToAdmin);
  await transporter.sendMail(mailToUser);
}