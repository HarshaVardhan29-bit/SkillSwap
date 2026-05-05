# 🚨 SECURITY FIX - Quick Action Checklist

## ⏱️ DO THIS NOW (10 Minutes)

### ✅ Step 1: Change MongoDB Password (3 min)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Database Access → Find `skillswap_user` → Edit
3. Edit Password → Autogenerate Secure Password
4. **COPY THE NEW PASSWORD** 📋
5. Update User

### ✅ Step 2: Update Render Environment (2 min)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Environment tab → Edit `MONGO_URI`
4. Replace password in connection string:
   ```
   mongodb+srv://skillswap_user:NEW_PASSWORD@cluster0.f1hi6bb.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Save Changes (auto-deploys)

### ✅ Step 3: Update Local .env (1 min)
1. Open `backend/.env`
2. Update `MONGO_URI` with new password
3. Save file
4. **DO NOT commit this file!**

### ✅ Step 4: Verify Fix (2 min)
1. Wait for Render deployment to complete
2. Test your app - try logging in
3. Check if everything works

### ✅ Step 5: Secure Network Access (2 min)
1. MongoDB Atlas → Network Access
2. Remove `0.0.0.0/0` if present
3. Add specific IPs:
   - Your Render server IP
   - Your development IP

---

## 🎯 What I Already Fixed

✅ Removed exposed credentials from `EMAIL_SETUP_GUIDE.md`  
✅ Committed and pushed the fix  
✅ Created comprehensive security guide  
✅ Verified `.env` is in `.gitignore`  

---

## ⚠️ Why This Happened

Your MongoDB credentials were in `EMAIL_SETUP_GUIDE.md` which was committed to GitHub. MongoDB's automated scanners detected this and sent you a warning.

---

## 🔒 After You Fix

- [ ] Test app works with new password
- [ ] Reply to MongoDB's email confirming fix
- [ ] Monitor database logs for 24 hours
- [ ] Consider rotating JWT secret (logs out all users)
- [ ] Consider rotating Gmail app password

---

## 📚 Full Details

See `SECURITY_URGENT_FIX.md` for complete instructions and prevention measures.

---

**Time Required**: 10 minutes  
**Priority**: 🔴 CRITICAL  
**Impact**: Prevents unauthorized database access
