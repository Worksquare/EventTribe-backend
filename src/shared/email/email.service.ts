/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      from: `Worksquare <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Verify your email address for successful account activation',
      html: `
      <p>Please click the following link to verify your email and to complete your <strong>Worksquare</strong> registration account</p>
      
      <p>This link will expire in <strong> 24 hours</strong>.</p>
      
      <p style="margin-bottom:20px;">Click this link for active your account</p>

      <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Email</a>
      <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@Worksquare.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Worksquare Support Team</strong>
    `,
    });
  }

  async sendResetPasswordEmail(email: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      from: `Worksquare  <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Verify your email address for successful account activation',
      html: `
      <p>Please click the following link to reset your password in other to <strong>Worksquare </strong> login into your account</p>
      
      <p>This link will expire in <strong> 5 minutes</strong>.</p>
      
       <p style="margin-bottom:20px;">Click this link to reset your password</p>
      
      <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Login</a>
       <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@Worksquare.com</p>
        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Worksquare Support Team</strong>
    `,
    });
  }

  async sendForgotPasswordEmail(email: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      from: `Worksquare  <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Forgot Password',
      html: `
        <p>Hello User;</p>
        <p>We have received a request to reset your password. To proceed with the password reset, please click the following link:</p>
        <a href="${link}" style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>
        <p>Please note that this link will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not initiate this password reset request, please disregard this email or contact our support team immediately at support@Worksquare.com.</p>
        <p>Best regards,</p>
        <strong>Worksquare Support Team</strong>
      `,
    });
  }
}
