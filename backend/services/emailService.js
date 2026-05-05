import nodemailer from "nodemailer";

// Configure email transporter based on environment
const transporter = nodemailer.createTransport(
  process.env.SENDGRID_API_KEY
    ? {
        // SendGrid configuration (recommended for production)
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      }
    : {
        // Gmail configuration (fallback for development)
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Gmail App Password
        },
      }
);

// Welcome email for new users
export const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to SkillSwap!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
          
          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#34d399,#38bdf8,#6366f1);padding:2px;border-radius:16px;">
              <div style="background:#0f172a;border-radius:14px;padding:12px 24px;">
                <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Skill<span style="color:#34d399;">Swap</span></span>
              </div>
            </div>
          </div>

          <!-- Main Card -->
          <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;overflow:hidden;">
            <!-- Top gradient bar -->
            <div style="height:4px;background:linear-gradient(90deg,#34d399,#38bdf8,#6366f1);"></div>
            
            <div style="padding:40px 36px;">
              <!-- Greeting -->
              <h1 style="color:#f8fafc;font-size:28px;font-weight:700;margin:0 0 8px;">
                Welcome, ${name}! 🎉
              </h1>
              <p style="color:#94a3b8;font-size:15px;margin:0 0 28px;line-height:1.6;">
                You've successfully joined SkillSwap — the platform where real people share real skills.
              </p>

              <!-- Divider -->
              <div style="height:1px;background:#334155;margin:0 0 28px;"></div>

              <!-- Features -->
              <p style="color:#cbd5e1;font-size:14px;font-weight:600;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.1em;">What you can do:</p>
              
              <div style="space-y:12px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                  <div style="width:36px;height:36px;background:#34d39920;border:1px solid #34d39940;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:36px;">📚</div>
                  <div>
                    <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">Browse Sessions</p>
                    <p style="color:#64748b;font-size:12px;margin:0;">Find mentors and learn new skills</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                  <div style="width:36px;height:36px;background:#38bdf820;border:1px solid #38bdf840;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:36px;">🏆</div>
                  <div>
                    <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">Earn Achievements</p>
                    <p style="color:#64748b;font-size:12px;margin:0;">Climb the leaderboard and earn certificates</p>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
                  <div style="width:36px;height:36px;background:#6366f120;border:1px solid #6366f140;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:36px;">💬</div>
                  <div>
                    <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">Real-time Chat</p>
                    <p style="color:#64748b;font-size:12px;margin:0;">Connect with mentors directly</p>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                   style="display:inline-block;background:linear-gradient(135deg,#34d399,#38bdf8);color:#0f172a;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                  Get Started →
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align:center;margin-top:24px;">
            <p style="color:#475569;font-size:12px;margin:0;">
              © 2025 SkillSwap — Designed & Developed by 
              <a href="https://harshavardhan29-bit.github.io/portfolio/" style="color:#34d399;text-decoration:none;">Harsha Vardhan Pushadapu</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// OTP email for forgot password
export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Password Reset OTP - SkillSwap",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:500px;margin:0 auto;padding:40px 20px;">
          
          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:22px;font-weight:800;color:#fff;">Skill<span style="color:#34d399;">Swap</span></span>
          </div>

          <!-- Card -->
          <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;overflow:hidden;">
            <div style="height:4px;background:linear-gradient(90deg,#34d399,#38bdf8,#6366f1);"></div>
            <div style="padding:40px 36px;text-align:center;">
              
              <div style="font-size:48px;margin-bottom:16px;">🔐</div>
              <h2 style="color:#f8fafc;font-size:24px;font-weight:700;margin:0 0 8px;">Password Reset</h2>
              <p style="color:#94a3b8;font-size:14px;margin:0 0 32px;">Use the OTP below to reset your password. It expires in 10 minutes.</p>

              <!-- OTP Box -->
              <div style="background:#0f172a;border:2px solid #34d399;border-radius:16px;padding:24px;margin:0 0 28px;">
                <p style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px;">Your OTP Code</p>
                <p style="color:#34d399;font-size:42px;font-weight:800;letter-spacing:12px;margin:0;font-family:monospace;">${otp}</p>
              </div>

              <p style="color:#64748b;font-size:12px;margin:0;">
                ⚠️ Never share this OTP with anyone. If you didn't request this, ignore this email.
              </p>
            </div>
          </div>

          <div style="text-align:center;margin-top:24px;">
            <p style="color:#475569;font-size:12px;">© 2025 SkillSwap</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Password reminder email for Google users
export const sendPasswordReminderEmail = async (to, userName) => {
  const mailOptions = {
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Set Your Password - SkillSwap",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
          
          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:22px;font-weight:800;color:#fff;">Skill<span style="color:#34d399;">Swap</span></span>
          </div>

          <!-- Card -->
          <div style="background:#1e293b;border:1px solid #334155;border-radius:20px;overflow:hidden;">
            <div style="height:4px;background:linear-gradient(90deg,#34d399,#38bdf8,#6366f1);"></div>
            <div style="padding:40px 36px;">
              
              <div style="font-size:48px;text-align:center;margin-bottom:16px;">🔐</div>
              <h2 style="color:#f8fafc;font-size:24px;font-weight:700;margin:0 0 8px;text-align:center;">Secure Your Account</h2>
              <p style="color:#94a3b8;font-size:14px;margin:0 0 28px;text-align:center;">Hi ${userName}, set a password for extra security!</p>

              <!-- Highlight Box -->
              <div style="background:#fbbf2420;border-left:4px solid #fbbf24;padding:16px;border-radius:8px;margin:0 0 24px;">
                <p style="color:#fbbf24;font-size:13px;font-weight:600;margin:0 0 4px;">💡 Pro Tip</p>
                <p style="color:#cbd5e1;font-size:13px;margin:0;">Set a password to access your account even without Google!</p>
              </div>

              <!-- Benefits -->
              <p style="color:#cbd5e1;font-size:14px;font-weight:600;margin:0 0 12px;">Why set a password?</p>
              <div style="margin:0 0 24px;">
                <div style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:#34d399;font-size:16px;">✅</span>
                  <p style="color:#94a3b8;font-size:13px;margin:0;">Login with email & password anytime</p>
                </div>
                <div style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:#34d399;font-size:16px;">✅</span>
                  <p style="color:#94a3b8;font-size:13px;margin:0;">Access your account from any device</p>
                </div>
                <div style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:#34d399;font-size:16px;">✅</span>
                  <p style="color:#94a3b8;font-size:13px;margin:0;">Extra security for your account</p>
                </div>
                <div style="display:flex;align-items:start;gap:8px;">
                  <span style="color:#34d399;font-size:16px;">✅</span>
                  <p style="color:#94a3b8;font-size:13px;margin:0;">No dependency on Google login</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL || 'https://skillswap-a3re.onrender.com'}/profile" 
                   style="display:inline-block;background:linear-gradient(135deg,#34d399,#38bdf8);color:#0f172a;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                  Set Password Now →
                </a>
              </div>

              <p style="color:#64748b;font-size:12px;margin:28px 0 0;text-align:center;">
                You can continue using Google Sign-In as usual. This is optional.
              </p>
            </div>
          </div>

          <div style="text-align:center;margin-top:24px;">
            <p style="color:#475569;font-size:12px;">© 2025 SkillSwap</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
