# Step-by-Step GitHub Pages Setup

**Repository Name:** exabyte_studio_website
**Custom Domain:** exabyte.studio

Follow these steps in order.

---

## Part 1: Create GitHub Repository

### Step 1: Create Repository on GitHub

1. **Go to GitHub:** https://github.com/new

2. **Fill in repository details:**
   - **Repository name:** `exabyte_studio_website`
   - **Description:** `Official website for Exabyte Studio - 3D Spatial Intelligence Platform`
   - **Visibility:** Select **Public** (required for free GitHub Pages)
   - **Initialize repository:**
     - ❌ Do NOT check "Add a README file"
     - ❌ Do NOT add .gitignore
     - ❌ Do NOT choose a license

3. **Click "Create repository"**

You'll see a page with setup instructions. Keep this page open.

---

## Part 2: Push Your Website to GitHub

### Step 2: Prepare Your Local Files

Open Terminal and navigate to your website directory:

```bash
cd /Users/jiaweizhang/PycharmProjects/Exabyte_Studio/website
```

### Step 3: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial website deployment - Exabyte Studio"
```

### Step 4: Connect to GitHub and Push

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/exabyte_studio_website.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:** If your GitHub username is `exabyte-ai`:
```bash
git remote add origin https://github.com/exabyte-ai/exabyte_studio_website.git
git branch -M main
git push -u origin main
```

**You'll be asked to authenticate:**
- Enter your GitHub username
- Enter your Personal Access Token (NOT password)
  - If you don't have a token, create one at: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select scope: `repo` (full control of private repositories)
  - Copy the token and use it as password

---

## Part 3: Enable GitHub Pages

### Step 5: Configure GitHub Pages

1. **Go to your repository on GitHub:**
   - URL: `https://github.com/YOUR_USERNAME/exabyte_studio_website`

2. **Click the "Settings" tab** (top navigation)

3. **In left sidebar, click "Pages"**

4. **Configure Source:**
   - **Branch:** Select `main` from dropdown
   - **Folder:** Select `/ (root)` from dropdown
   - **Click "Save"**

5. **Wait for deployment:**
   - You'll see: "Your site is ready to be published at `https://YOUR_USERNAME.github.io/exabyte_studio_website/`"
   - Wait 1-2 minutes, then refresh the page
   - It will change to: "Your site is published at `https://YOUR_USERNAME.github.io/exabyte_studio_website/`"

6. **Test the default URL:**
   - Visit: `https://YOUR_USERNAME.github.io/exabyte_studio_website/`
   - Your website should load (but without custom domain yet)

---

## Part 4: Add Custom Domain

### Step 6: Add CNAME File

**Stay on the GitHub Pages settings page:**

1. **Under "Custom domain" section:**
   - Enter: `exabyte.studio`
   - **Click "Save"**

2. **What happens:**
   - GitHub creates a `CNAME` file in your repository
   - You'll see: "DNS check in progress"
   - This is normal - DNS isn't configured yet

3. **DO NOT check "Enforce HTTPS" yet** (we'll do this after DNS is working)

---

## Part 5: Configure DNS in Squarespace

### Step 7: Access Squarespace DNS Settings

1. **Log in to Squarespace:** https://account.squarespace.com/

2. **Navigate to DNS settings:**
   - Click **Settings** (left sidebar)
   - Click **Domains**
   - Click on **exabyte.studio**
   - Click **DNS Settings** or **Advanced DNS** or **Manage DNS**

### Step 8: Add DNS Records

**IMPORTANT:** Delete any existing A records or CNAME records for @ and www first.

**Add these 4 A records:**

```
Type: A
Host: @
Value: 185.199.108.153
TTL: 3600
```

```
Type: A
Host: @
Value: 185.199.109.153
TTL: 3600
```

```
Type: A
Host: @
Value: 185.199.110.153
TTL: 3600
```

```
Type: A
Host: @
Value: 185.199.111.153
TTL: 3600
```

**Add this CNAME record:**

```
Type: CNAME
Host: www
Value: YOUR_USERNAME.github.io
TTL: 3600
```

**Replace `YOUR_USERNAME` with your GitHub username!**

Example: If your username is `exabyte-ai`, the CNAME value should be:
```
exabyte-ai.github.io
```

### Step 9: Save DNS Settings

1. **Click "Save" or "Apply Changes"** in Squarespace

2. **Verify settings saved:**
   - Review the DNS records you just added
   - Ensure all 4 A records are there
   - Ensure CNAME record is correct

---

## Part 6: Wait for DNS Propagation

### Step 10: Check DNS Status

**DNS propagation can take 0-48 hours (typically 2-6 hours)**

**Check propagation status:**

1. **Use online tool:**
   - Go to: https://dnschecker.org
   - Enter: `exabyte.studio`
   - Select: `A` record type
   - Click "Search"
   - Look for green checkmarks showing GitHub's IPs

2. **Use command line (macOS/Linux):**
   ```bash
   dig exabyte.studio +short
   ```

   **Expected output:**
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. **Check www subdomain:**
   ```bash
   dig www.exabyte.studio +short
   ```

   **Expected output:**
   ```
   YOUR_USERNAME.github.io.
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

**Keep checking every hour until you see GitHub's IPs.**

---

## Part 7: Verify Custom Domain

### Step 11: Check GitHub Pages Status

**After DNS is working (IPs show correctly):**

1. **Go back to GitHub repository:**
   - Settings > Pages

2. **Check custom domain status:**
   - Should show: ✅ "DNS check successful"
   - If still shows "DNS check in progress", wait and refresh page

3. **Test website access:**
   - Visit: `http://exabyte.studio` (should load your website)
   - Visit: `http://www.exabyte.studio` (should redirect to non-www)

---

## Part 8: Enable HTTPS

### Step 12: Enable SSL Certificate

**ONLY do this after DNS is working and website loads on HTTP:**

1. **Go to repository Settings > Pages**

2. **Verify:**
   - Custom domain shows: `exabyte.studio`
   - DNS check shows: ✅ Green checkmark

3. **Check the box:**
   - ☑️ **Enforce HTTPS**

4. **Wait for certificate:**
   - GitHub will provision a Let's Encrypt SSL certificate
   - This can take 0-24 hours
   - Page will show: "Certificate provisioning in progress"

5. **When ready:**
   - Page will show: "Your site is published at `https://exabyte.studio`"
   - The lock icon will appear in browser

6. **Test HTTPS:**
   - Visit: `https://exabyte.studio` (should work with padlock)
   - Visit: `https://www.exabyte.studio` (should redirect)

---

## Part 9: Final Verification

### Step 13: Complete Testing Checklist

**Test all these URLs:**

- [ ] `http://exabyte.studio` → loads website
- [ ] `https://exabyte.studio` → loads with HTTPS ✅
- [ ] `http://www.exabyte.studio` → redirects to https://exabyte.studio
- [ ] `https://www.exabyte.studio` → redirects to https://exabyte.studio
- [ ] All pages load correctly (features.html, technology.html, etc.)
- [ ] Particle animation works
- [ ] Navigation works
- [ ] No console errors (check browser DevTools)
- [ ] Mobile responsive (test on phone)

**Test browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Step 14: Performance Check

**Run performance tests:**

1. **Google PageSpeed Insights:**
   - Go to: https://pagespeed.web.dev/
   - Enter: `https://exabyte.studio`
   - Check both Mobile and Desktop scores
   - Target: 90+ score

2. **SSL Labs Test:**
   - Go to: https://www.ssllabs.com/ssltest/
   - Enter: `exabyte.studio`
   - Target: A or A+ rating

---

## Troubleshooting

### Issue: "git push" asks for password but password doesn't work

**Solution:** GitHub no longer accepts passwords. Use Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Website deployment"
4. Select scope: `repo`
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

**Better solution:** Use SSH instead:
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy the output

# Add to GitHub:
# Go to: https://github.com/settings/keys
# Click "New SSH key"
# Paste the public key

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/exabyte_studio_website.git
```

### Issue: DNS not propagating

**Solutions:**
1. **Wait longer** - Can take up to 48 hours
2. **Check Squarespace:**
   - Ensure domain is not "connected to website"
   - Ensure domain is not parked
   - Verify all 4 A records saved correctly
3. **Flush local DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

### Issue: "Enforce HTTPS" checkbox is disabled

**This means DNS isn't verified yet.**

**Solutions:**
1. Wait for DNS propagation
2. Remove and re-add custom domain:
   - Remove `exabyte.studio` from custom domain field
   - Wait 5 minutes
   - Add it back
   - Click Save
3. Check DNS records are correct

### Issue: Website shows 404 error

**Solutions:**
1. Check `index.html` is in repository root
2. Verify GitHub Pages is enabled (Settings > Pages)
3. Check branch is set to `main`
4. Wait 2-3 minutes after pushing changes

### Issue: Particle animation not working on live site

**Solutions:**
1. Check browser console for errors
2. Verify `particle-hero.js` is in same directory as `index.html`
3. Clear browser cache (Cmd+Shift+R)
4. Check file was actually pushed to GitHub (view files on GitHub)

---

## Quick Command Summary

```bash
# Navigate to website directory
cd /Users/jiaweizhang/PycharmProjects/Exabyte_Studio/website

# Initialize and push
git init
git add .
git commit -m "Initial website deployment"
git remote add origin https://github.com/YOUR_USERNAME/exabyte_studio_website.git
git branch -M main
git push -u origin main

# Check DNS
dig exabyte.studio +short
dig www.exabyte.studio +short

# Future updates
git add .
git commit -m "Update: description"
git push
```

---

## Timeline Expectations

| Step | Immediate | Wait Time |
|------|-----------|-----------|
| Create repo | ✓ Done | 0 min |
| Push code | ✓ Done | 0 min |
| Enable Pages | ✓ Done | 1-2 min |
| Add custom domain | ✓ Done | 0 min |
| Configure DNS | ✓ Done | 0 min |
| DNS propagation | ⏳ Wait | 0-48 hours (typically 2-6 hours) |
| DNS check passes | ⏳ Wait | After DNS propagates |
| Enable HTTPS | ⏳ Wait | 0-24 hours after DNS works |
| SSL certificate | ⏳ Wait | Usually 1-2 hours |
| **Total** | | **3-72 hours** (typically working in 6-12 hours) |

---

## Your GitHub Repository Info

**Repository URL:** `https://github.com/YOUR_USERNAME/exabyte_studio_website`
**Website URL (after setup):** `https://exabyte.studio`
**GitHub Pages URL:** `https://YOUR_USERNAME.github.io/exabyte_studio_website/`

**Remember to replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Next Steps After Deployment

1. **Set up Google Analytics** (optional)
2. **Add to Google Search Console**
3. **Set up monitoring** (UptimeRobot)
4. **Share with team**
5. **Announce launch!**

---

**Ready? Start with Part 1: Create GitHub Repository!**

Good luck! 🚀
