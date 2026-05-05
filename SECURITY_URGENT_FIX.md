# 🚨 URGENT: MongoDB Security Breach - Immediate Action Required

## ⚠️ CRITICAL ISSUE
Your MongoDB credentials were exposed in the GitHub repository in `EMAIL_SETUP_GUIDE.md`. MongoDB has detected this and sent you a warning email.

**Exposed Information:**
- ❌ MongoDB connection string
- ❌ Database username: `skillswap_user`
- ❌ Database password: `harsha10576`
- ❌ Cluster URL: `cluster0.f1hi6bb.mongodb.net`
- ❌ Gmail app password
- ❌ JWT secret

---

## 🔥 IMMEDIATE ACTIONS (Do This NOW - 10 Minutes)

### Step 1: Change MongoDB Password (URGENT)

1. **Login to MongoDB Atlas**
   - Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
   - Login with your account

2. **Change Database User Password**
   - Click on your cluster (Cluster0)
   - Go to **Database Access** (left sidebar)
   - Find user `skillswap_user`
   - Click **Edit** (pencil icon)
   - Click **Edit Password**
   - Generate a new strong password (use the "Autogenerate Secure Password" button)
   - **COPY THE NEW PASSWORD** (you'll need it)
   - Click **Update User**

3. **Update Network Access (Recommended)**
   - Go to **Network Access** (left sidebar)
   - If you see `0.0.0.0/0` (Allow access from anywhere), this is risky
   - Click **Edit**
   - Add specific IP addresses:
     - Your Render server IP (get from Render dashboard)
     - Your local development IP (Google "what is my IP")
   - Remove `0.0.0.0/0` if possible

### Step 2: Update Environment Variables on Render

1. **Go to Render Dashboard**
   - [https://dashboard.render.com/](https://dashboard.render.com/)
   - Select your backend service

2. **Update MONGO_URI**
   - Go to **Environment** tab
   - Find `MONGO_URI`
   - Click **Edit**
   - Replace with new connection string (use new password)
   - Format: `mongodb+srv://skillswap_user:NEW_PASSWORD_HERE@cluster0.f1hi6bb.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster0`
   - Click **Save Changes**

3. **Update JWT_SECRET (Recommended)**
   - Generate a new secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - Update `JWT_SECRET` in Render environment variables
   - **Note**: This will log out all existing users

4. **Wait for Deployment**
   - Render will automatically redeploy with new credentials

### Step 3: Update Local .env File

1. **Update `backend/.env`**
   ```env
   MONGO_URI=mongodb+srv://skillswap_user:NEW_PASSWORD_HERE@cluster0.f1hi6bb.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=new_jwt_secret_here
   PORT=5000
   EMAIL_USER=skillswap.noreplay@gmail.com
   EMAIL_PASS=wnen tejk vxaf nzdq
   FRONTEND_URL=https://skillswap-a3re.onrender.com
   ```

2. **NEVER commit this file!**
   - It's already in `.gitignore` ✅
   - Double-check: `git status` should NOT show `.env`

### Step 4: Remove Credentials from Git History

The credentials are in `EMAIL_SETUP_GUIDE.md` which was committed. We need to remove them:

1. **I've already removed them from the file** ✅
2. **Commit the fix**:
   ```bash
   git add EMAIL_SETUP_GUIDE.md
   git commit -m "Remove exposed credentials from documentation"
   git push origin master
   ```

3. **Remove from Git History** (Advanced):
   ```bash
   # This rewrites history - use with caution
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch EMAIL_SETUP_GUIDE.md" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This changes history)
   git push origin --force --all
   ```

   **OR use BFG Repo-Cleaner** (easier):
   ```bash
   # Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
   java -jar bfg.jar --replace-text passwords.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin --force --all
   ```

---

## 🛡️ ADDITIONAL SECURITY MEASURES

### 1. Rotate All Secrets

**Gmail App Password:**
1. Go to Google Account → Security → 2-Step Verification → App passwords
2. Delete old app password
3. Generate new one
4. Update in Render environment variables

**JWT Secret:**
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Enable MongoDB Security Features

**IP Whitelist:**
- Only allow specific IPs (not 0.0.0.0/0)
- Add Render server IP
- Add your development IP

**Database Auditing:**
- Go to MongoDB Atlas → Security → Database Auditing
- Enable auditing to track access

**Encryption at Rest:**
- Already enabled by default on Atlas

**TLS/SSL:**
- Already enforced in connection string

### 3. Secure Your GitHub Repository

**Check for Other Exposed Secrets:**
```bash
# Search for potential secrets
git log -p | grep -i "password\|secret\|key\|token"
```

**Enable GitHub Secret Scanning:**
1. Go to your GitHub repo
2. Settings → Security → Code security and analysis
3. Enable "Secret scanning"
4. Enable "Push protection"

**Use GitHub Secrets for CI/CD:**
- Never hardcode secrets in workflows
- Use GitHub Secrets for environment variables

### 4. Use Environment Variables Properly

**Never commit:**
- `.env` files
- `config.js` with hardcoded secrets
- Any file with passwords/keys

**Always use:**
- Environment variables
- Secret management services (AWS Secrets Manager, HashiCorp Vault)
- `.env.example` with placeholder values

---

## 🔍 Check for Unauthorized Access

### MongoDB Atlas Logs

1. **Go to MongoDB Atlas**
2. **Activity Feed** (left sidebar)
3. Check for:
   - Unusual login locations
   - Unexpected database operations
   - Failed authentication attempts

### Check Database for Suspicious Activity

```javascript
// Connect to MongoDB and check recent activity
// Look for:
// - New users you didn't create
// - Modified data
// - Deleted collections
```

### Render Logs

1. Go to Render dashboard
2. Check logs for unusual activity
3. Look for failed authentication attempts

---

## 📋 Security Checklist

- [ ] Changed MongoDB password
- [ ] Updated MONGO_URI on Render
- [ ] Updated local .env file
- [ ] Removed credentials from EMAIL_SETUP_GUIDE.md
- [ ] Committed and pushed the fix
- [ ] Verified .env is in .gitignore
- [ ] Enabled IP whitelist on MongoDB
- [ ] Rotated JWT secret (optional but recommended)
- [ ] Rotated Gmail app password (optional)
- [ ] Checked MongoDB activity logs
- [ ] Enabled GitHub secret scanning
- [ ] Tested app still works with new credentials

---

## 🚀 Prevention for Future

### 1. Use .env.example Template

Always use placeholder values:
```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_password_here
```

### 2. Pre-commit Hook

Install a pre-commit hook to prevent committing secrets:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or download from https://github.com/awslabs/git-secrets

# Setup
git secrets --install
git secrets --register-aws
git secrets --add 'mongodb\+srv://[^:]+:[^@]+'
git secrets --add 'JWT_SECRET=.+'
```

### 3. Use Secret Scanning Tools

**TruffleHog:**
```bash
pip install truffleHog
trufflehog --regex --entropy=False https://github.com/yourusername/yourrepo
```

**GitGuardian:**
- Install GitGuardian CLI
- Scan your repo regularly

### 4. Environment-Specific Configs

**Development:**
- Use local MongoDB or MongoDB Atlas with dev cluster
- Different credentials than production

**Production:**
- Use Render environment variables
- Never hardcode in code

### 5. Regular Security Audits

- [ ] Monthly: Review MongoDB access logs
- [ ] Monthly: Rotate secrets
- [ ] Quarterly: Security audit of codebase
- [ ] Yearly: Penetration testing

---

## 📞 If You've Been Compromised

### Signs of Compromise:
- Unexpected data changes
- New users you didn't create
- Unusual database queries in logs
- MongoDB warning emails
- Increased database usage

### Immediate Actions:
1. **Change ALL passwords immediately**
2. **Revoke ALL API keys**
3. **Check database for malicious data**
4. **Restore from backup if needed**
5. **Enable 2FA on all accounts**
6. **Contact MongoDB support**
7. **Monitor for 30 days**

### MongoDB Support:
- Email: support@mongodb.com
- Chat: Available in Atlas dashboard
- Docs: https://docs.atlas.mongodb.com/security/

---

## 🎓 Learn More

**MongoDB Security Best Practices:**
- https://docs.mongodb.com/manual/security/

**OWASP Top 10:**
- https://owasp.org/www-project-top-ten/

**GitHub Security:**
- https://docs.github.com/en/code-security

---

## ✅ After Fixing

Once you've completed all steps:

1. **Test your app** - Make sure it still works
2. **Monitor logs** - Watch for any issues
3. **Reply to MongoDB** - Let them know you've secured it
4. **Document the incident** - Learn from it
5. **Implement prevention** - Use the checklist above

---

**Priority**: 🔴 CRITICAL - Do this immediately!  
**Time Required**: 10-15 minutes  
**Impact**: Prevents unauthorized database access  

**Remember**: Security is not a one-time task, it's an ongoing process! 🛡️
