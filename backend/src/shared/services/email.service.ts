import nodemailer from "nodemailer";

class EmailService {
  private transporter!: nodemailer.Transporter;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.isInitialized = true;
      console.log("📫 Email service initialized with Ethereal.");
      console.log(`   - User: ${testAccount.user}`);
      console.log(`   - Pass: ${testAccount.pass}`);
    } catch (error) {
      console.error("Failed to initialize email service:", error);
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      // Agar servis hali tayyor bo'lmasa, 1 soniya kutish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!this.isInitialized) {
        throw new Error("Email service could not be initialized.");
      }
    }
  }

  public async sendVerificationEmail(
    to: string,
    code: string,
    firstName: string
  ) {
    await this.ensureInitialized();

    const subject = "E-Navbat | Email manzilingizni tasdiqlang";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">E-Navbat</h1>
          <p style="color: white; margin: 5px 0;">Elektron navbat tizimi</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Salom, ${firstName}!</h2>
          <p style="color: #666; margin-bottom: 25px;">
            E-Navbat tizimiga xush kelibsiz! Email manzilingizni tasdiqlash uchun quyidagi kodni kiriting:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #667eea; color: white; padding: 20px 40px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
              ${code}
            </div>
          </div>
          
          <p style="color: #666;">Bu kod <strong>10 daqiqa</strong> davomida amal qiladi.</p>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;"> 2024 E-Navbat. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: '"E-Navbat" <noreply@e-navbat.com>',
      to,
      subject,
      html,
    });

    console.log(
      ` Verification email sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(
        info
      )}`
    );

    return nodemailer.getTestMessageUrl(info);
  }

  public async sendPasswordResetEmail(to: string, resetToken: string) {
    await this.ensureInitialized();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = "E-Navbat | Parolni tiklash so'rovi";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">E-Navbat</h1>
          <p style="color: white; margin: 5px 0;">Elektron navbat tizimi</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Parolingizni tiklash</h2>
          <p>Parolingizni tiklash uchun so'rov yubordingiz. Yangi parol o'rnatish uchun quyidagi tugmani bosing:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Parolni Tiklash
            </a>
          </div>
          
          <p style="color: #666;">Bu link <strong>10 daqiqa</strong> davomida amal qiladi.</p>
          <p style="color: #666; font-size: 14px;">Agar tugma ishlamasa, quyidagi linkni nusxalab brauzeringizga joylashtiring:</p>
          <p style="word-break: break-all; color: #667eea; font-size: 12px;">${resetUrl}</p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; color: #856404;">
              <strong>Xavfsizlik:</strong> Agar siz bu so'rovni yubormagan bo'lsangiz, bu xabarga e'tibor bermang.
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;"> 2024 E-Navbat. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: '"E-Navbat" <noreply@e-navbat.com>',
      to,
      subject,
      html,
    });

    console.log(
      ` Password reset email sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(
        info
      )}`
    );

    return nodemailer.getTestMessageUrl(info);
  }

  public async sendWelcomeEmail(to: string, firstName: string) {
    await this.ensureInitialized();

    const subject = "E-Navbat | Xush kelibsiz!";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">E-Navbat</h1>
          <p style="color: white; margin: 5px 0;">Elektron navbat tizimi</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Salom, ${firstName}!</h2>
          <p>E-Navbat tizimiga muvaffaqiyatli ro'yxatdan o'tdingiz! </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Nima qila olasiz:</h3>
            <ul style="color: #666;">
              <li>Turli xizmatlar uchun navbat olish</li>
              <li>Navbat holatini real vaqtda kuzatish</li>
              <li>Navbat tarixini ko'rish</li>
              <li>QR kod orqali tez kirish</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Tizimga Kirish
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;"> 2024 E-Navbat. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: '"E-Navbat" <noreply@e-navbat.com>',
      to,
      subject,
      html,
    });

    console.log(
      ` Welcome email sent to ${to}. Preview: ${nodemailer.getTestMessageUrl(
        info
      )}`
    );

    return nodemailer.getTestMessageUrl(info);
  }
}

export default new EmailService();
