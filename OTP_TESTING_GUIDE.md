# OTP System Testing Guide

## Current Status
✅ **OTP Generation**: Working (6-digit code)  
✅ **OTP Storage**: Working (in-memory, 10 min expiry)  
✅ **OTP Verification**: Working  
❌ **Email Delivery**: Failing (network issue on Render)  
✅ **Fallback**: OTP shown in UI when email fails

## How to Test OTP Password Reset

### Step 1: Navigate to Profile
1. Login to your account
2. Go to `/profile` page
3. Scroll down to the password section

### Step 2: Request OTP
1. If you have a password set, click **"Forgot your password? Reset with OTP"**
2. Click **"Send OTP to Email"** button
3. Wait for the response (should take 2-5 seconds)

### Step 3: What You Should See

#### If Email Works (Unlikely on Render):
- ✅ Green success message: "OTP sent to your email!"
- Check your email inbox (and spam folder)
- OTP input form appears below

#### If Email Fails (Current Situation):
- ⚠️ **Yellow warning box** with:
  - "Email Service Unavailable" heading
  - Large OTP code displayed (e.g., **770100**)
  - "Expires in 10 minutes" note
  - **📋 Copy OTP** button
- OTP input form appears below the warning box

### Step 4: Enter OTP
1. Copy the OTP from the yellow box (or click "Copy OTP" button)
2. Paste it into the OTP input field (6 digits)
3. Enter your new password (min 6 characters)
4. Confirm your new password
5. Click **"Reset Password"**

### Step 5: Success
- ✅ "Password reset successfully!" message
- You can now login with your new password

## Troubleshooting

### "OTP form not showing"
**Solution**: 
- Wait for Render to finish deploying (check Render dashboard)
- Clear browser cache and refresh
- Check browser console for errors (F12 → Console tab)

### "Invalid OTP" error
**Possible causes**:
- OTP expired (10 minutes)
- Typo in OTP entry
- Server restarted (OTP stored in memory)

**Solution**: Click "Didn't receive OTP? Resend" to get a new code

### "Email not received"
**This is expected!** The Render server cannot reach Gmail SMTP due to network restrictions.

**Solution**: Use the OTP displayed in the yellow warning box on screen

## Backend Logs to Check

When you click "Send OTP", the backend logs should show:
```
📧 OTP Request - User ID: [your-user-id]
✅ User found: [your-email]
🔢 Generated OTP: [6-digit-code] for [your-email]
💾 OTP stored in memory
📨 Attempting to send OTP email to: [your-email]
❌ Email sending failed: Error: connect ENETUNREACH...
```

The OTP shown in the logs is the same one displayed in the UI.

## Why Email Fails on Render

**Issue**: `ENETUNREACH 2404:6800:4003:c04::6d:465`

This means Render's server cannot reach Gmail's SMTP server (smtp.gmail.com:465) due to:
- Network firewall restrictions
- IPv6 connectivity issues
- SMTP port blocking

**Solutions** (for future):
1. Use a transactional email service (SendGrid, Mailgun, AWS SES)
2. Contact Render support about SMTP access
3. Use a different email provider
4. Keep current fallback (show OTP in UI)

## Current Workaround

The system is designed to work even when email fails:
1. Backend generates OTP and stores it
2. Backend tries to send email
3. If email fails, backend returns OTP in API response
4. Frontend displays OTP in a prominent yellow box
5. User copies OTP and enters it manually
6. Password reset works perfectly!

## Testing Checklist

- [ ] Login to account
- [ ] Navigate to Profile page
- [ ] Click "Forgot your password? Reset with OTP"
- [ ] Click "Send OTP to Email"
- [ ] Verify yellow warning box appears with OTP
- [ ] Copy OTP (6 digits)
- [ ] Enter OTP in input field
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Reset Password"
- [ ] Verify success message
- [ ] Logout and login with new password

## Notes

- OTP expires in **10 minutes**
- OTP is stored in **server memory** (will be lost if server restarts)
- Each user can have only **one active OTP** at a time
- Requesting a new OTP **overwrites** the previous one
- OTP is **6 digits** (100000-999999)

---

**Last Updated**: After fixing OTP display and adding copy button
**Status**: ✅ Fully functional with UI fallback for email failures
