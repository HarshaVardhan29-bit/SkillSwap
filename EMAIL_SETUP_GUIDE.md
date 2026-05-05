# Email Setup Guide - Fix Email Delivery Issues

## Problem
Gmail SMTP is not working on Render due to network restrictions:
- ❌ Welcome emails not sent
- ❌ OTP emails not sent  
- ❌ Password reminder emails not sent

**Error**: `ENETUNREACH 2404:6800:4003:c04::6d:465` - Cannot reach Gmail SMTP server

## Solution: Use SendGrid (Recommended)

SendGrid is a transactional email service designed for sending emails from servers. It's free for up to 100 emails/day.

---

## Step-by-Step Setup

### 1. Create SendGrid Account

1. Go to [https://sendgrid.com/](https://sendgrid.com/)
2. Click **"Start for Free"**
3. Sign up with your email
4. Verify your email address
5. Complete the onboarding (select "Integrate using Web API or SMTP")

### 2. Create API Key

1. Login to SendGrid dashboard
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"**
4. Name it: `SkillSwap Production`
5. Select **"Full Access"** (or at minimum "Mail Send" permission)
6. Click **"Create & View"**
7. **COPY THE API KEY** (you won't see it again!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Verify Sender Identity

SendGrid requires you to verify your sender email:

#### Option A: Single Sender Verification (Easiest)
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name**: SkillSwap
   - **From Email**: skillswap.noreplay@gmail.com (or any email you own)
   - **Reply To**: Same as above
   - **Company**: SkillSwap
   - **Address**: Your address
4. Click **"Create"**
5. Check your email and click the verification link
6. Wait for approval (usually instant)

#### Option B: Domain Authentication (Better for production)
1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow the DNS setup instructions
4. This requires access to your domain's DNS settings

### 4. Update Environment Variables on Render

1. Go to your Render dashboard
2. Select your **backend service**
3. Go to **Environment** tab
4. Add/Update these variables:

```
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_USER=skillswap.noreplay@gmail.com
```

5. Click **"Save Changes"**
6. Render will automatically redeploy

### 5. Update Local .env File

Update your `backend/.env` file:

```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=5000

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_USER=your_email@domain.com

# Keep Gmail as fallback for local development
EMAIL_PASS=your_gmail_app_password_here

FRONTEND_URL=https://your-app-url.com
```

### 6. Test Locally (Optional)

```bash
cd backend
npm start
```

Then register a new user or request OTP - check if email is sent!

---

## Alternative: Mailgun (Another Good Option)

If you prefer Mailgun over SendGrid:

1. Sign up at [https://www.mailgun.com/](https://www.mailgun.com/)
2. Get your API key and domain
3. Update `backend/services/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_USER, // e.g., postmaster@sandbox123.mailgun.org
    pass: process.env.MAILGUN_PASS, // Your Mailgun password
  },
});
```

---

## Alternative: AWS SES (Most Reliable)

For production apps with high volume:

1. Sign up for AWS
2. Go to Amazon SES
3. Verify your email/domain
4. Get SMTP credentials
5. Update transporter:

```javascript
const transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com", // Your region
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS,
  },
});
```

---

## Alternative: Resend (Modern & Simple)

Resend is a newer service with great developer experience:

1. Sign up at [https://resend.com/](https://resend.com/)
2. Get API key
3. Install: `npm install resend`
4. Update email service to use Resend SDK

---

## Temporary Workaround (Current Solution)

Until you set up SendGrid, the app is using a fallback:

- **OTP emails**: OTP is displayed on screen when email fails ✅
- **Welcome emails**: Silently fail (non-blocking) ⚠️
- **Password reminders**: Silently fail (non-blocking) ⚠️

Users can still use the app, but won't receive emails.

---

## Testing After Setup

### Test 1: Welcome Email
1. Register a new user
2. Check email inbox
3. Should receive welcome email with SkillSwap branding

### Test 2: OTP Email
1. Login to existing account
2. Go to Profile → "Forgot password? Reset with OTP"
3. Click "Send OTP to Email"
4. Check email inbox
5. Should receive OTP email

### Test 3: Password Reminder
1. Login with Google account that hasn't set password
2. Wait 7 days (or manually trigger in code)
3. Should receive password reminder email

---

## Troubleshooting

### "Invalid API Key"
- Double-check the API key is copied correctly
- Make sure there are no extra spaces
- Verify the key has "Mail Send" permission

### "Sender not verified"
- Complete Single Sender Verification in SendGrid
- Check your email for verification link
- Wait a few minutes after verification

### "Still not receiving emails"
- Check spam folder
- Verify environment variables are set on Render
- Check Render logs for email errors
- Verify SendGrid dashboard shows email activity

### "Emails going to spam"
- Complete Domain Authentication (not just Single Sender)
- Add SPF and DKIM records to your domain
- Warm up your sending reputation gradually

---

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **SendGrid** | 100 emails/day | $19.95/mo for 50k emails |
| **Mailgun** | 5,000 emails/month | $35/mo for 50k emails |
| **AWS SES** | 62,000 emails/month (if on EC2) | $0.10 per 1,000 emails |
| **Resend** | 3,000 emails/month | $20/mo for 50k emails |
| **Gmail SMTP** | Free but unreliable | Not recommended for production |

---

## Recommended Setup

**For SkillSwap:**
- **Development**: Gmail SMTP (works locally)
- **Production**: SendGrid (free tier is enough)
- **Future**: AWS SES (if you grow beyond 100 emails/day)

---

## Code Changes Made

I've already updated the code to support SendGrid:

1. ✅ `backend/services/emailService.js` - Auto-detects SendGrid or Gmail
2. ✅ `backend/.env.example` - Shows both configurations
3. ✅ Fallback logic - Shows OTP on screen if email fails

**You just need to:**
1. Get SendGrid API key
2. Add it to Render environment variables
3. Redeploy (automatic)

---

## Next Steps

1. [ ] Sign up for SendGrid
2. [ ] Create API key
3. [ ] Verify sender email
4. [ ] Add `SENDGRID_API_KEY` to Render
5. [ ] Wait for deployment
6. [ ] Test by registering new user
7. [ ] Check email inbox for welcome email

---

**Need Help?** 
- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- Render Docs: https://render.com/docs/environment-variables

**Estimated Setup Time**: 10-15 minutes
