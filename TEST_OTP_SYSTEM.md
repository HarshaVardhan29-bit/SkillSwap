# OTP System Testing Guide

## ✅ System Configuration

### Email Service
- **Email**: skillswap.noreplay@gmail.com
- **Service**: Gmail
- **Status**: ✅ Configured

### OTP Endpoints
1. ✅ `POST /api/auth/request-password-reset-otp` - Send OTP
2. ✅ `POST /api/auth/verify-otp-and-reset` - Verify & Reset

### OTP Settings
- **Length**: 6 digits
- **Expiry**: 10 minutes
- **Storage**: In-memory (otpStore Map)

## 🧪 How to Test

### Test 1: Request OTP (Manual Test)

1. **Login to your account** (any user)
2. **Go to Profile page** (`/profile`)
3. **Click "Change Password"** (if you have password) or **"Set Password"** (if Google user)
4. **Click "Forgot your password? Reset with OTP"**
5. **Click "Send OTP to Email"**
6. **Check your email** for the OTP code
7. **Expected**: Email received with 6-digit OTP

### Test 2: Verify OTP

1. **After receiving OTP**, enter it in the form
2. **Enter new password** and confirm
3. **Click "Reset Password"**
4. **Expected**: Password reset successfully

### Test 3: OTP Expiry

1. **Request OTP**
2. **Wait 11 minutes**
3. **Try to use the OTP**
4. **Expected**: "OTP has expired" error

### Test 4: Invalid OTP

1. **Request OTP**
2. **Enter wrong code** (e.g., 123456)
3. **Expected**: "Invalid OTP" error

### Test 5: Resend OTP

1. **Request OTP**
2. **Click "Didn't receive OTP? Resend"**
3. **Check email again**
4. **Expected**: New OTP received (old one invalidated)

## 🔍 Debugging

### Check Backend Logs

If OTP not working, check Render logs:

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Look for:
   - `"Request password reset OTP error:"` - Error sending OTP
   - `"Verify OTP and reset error:"` - Error verifying OTP

### Common Issues

#### Issue 1: Email Not Received
**Possible Causes**:
- Gmail app password expired
- Email in spam folder
- Email service down

**Solution**:
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASS in Render environment variables
- Check Render logs for email errors

#### Issue 2: "OTP not found"
**Possible Causes**:
- Server restarted (in-memory storage cleared)
- OTP expired
- Wrong email

**Solution**:
- Request new OTP
- Check if you're logged in with correct account

#### Issue 3: "Invalid OTP"
**Possible Causes**:
- Typo in OTP
- Using old OTP after requesting new one
- Copy-paste issue (extra spaces)

**Solution**:
- Carefully type the 6-digit code
- Request fresh OTP
- Don't copy-paste (type manually)

## 🛠️ Manual API Test

### Using cURL or Postman:

**1. Request OTP:**
```bash
curl -X POST https://skillswap-a3re.onrender.com/api/auth/request-password-reset-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "message": "OTP sent to your email address."
}
```

**2. Verify OTP:**
```bash
curl -X POST https://skillswap-a3re.onrender.com/api/auth/verify-otp-and-reset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "newPassword": "newpassword123"
  }'
```

**Expected Response:**
```json
{
  "message": "Password reset successfully."
}
```

## 📧 Email Template

The OTP email includes:
- 🔐 Lock icon
- "Password Reset" heading
- 6-digit OTP in large, monospace font
- Green border around OTP
- 10-minute expiry notice
- Security warning

## ✅ System Status

### Backend
- ✅ OTP generation (6 digits)
- ✅ OTP storage (in-memory Map)
- ✅ OTP expiry (10 minutes)
- ✅ Email sending (nodemailer + Gmail)
- ✅ OTP verification
- ✅ Password reset after verification

### Frontend
- ✅ Request OTP button
- ✅ OTP input field (6 digits)
- ✅ New password fields
- ✅ Resend OTP option
- ✅ Error handling
- ✅ Success messages

## 🚨 Important Notes

1. **In-Memory Storage**: OTP is stored in memory. If server restarts, all OTPs are lost. Users need to request new OTP.

2. **One OTP Per Email**: Requesting new OTP invalidates the old one.

3. **10-Minute Expiry**: OTP expires after 10 minutes for security.

4. **Logged-In Users Only**: OTP reset is for logged-in users who forgot their password. For logged-out users, use the "Forgot Password" on login page.

## 🔄 Alternative: Database Storage

If you want OTPs to survive server restarts, consider storing in database:

```javascript
// In User model
otpCode: String,
otpExpiry: Date,
otpPurpose: String
```

This would require updating the OTP endpoints to use database instead of in-memory Map.

## ✅ Verification Checklist

- [ ] Email credentials configured in Render
- [ ] OTP endpoints accessible
- [ ] Email service working
- [ ] OTP generation working
- [ ] OTP expiry working
- [ ] OTP verification working
- [ ] Password reset working
- [ ] Frontend forms working
- [ ] Error messages clear
- [ ] Success messages shown

---

**Status**: ✅ System should be working  
**Last Updated**: May 5, 2026  
**Test After**: Render deployment completes
