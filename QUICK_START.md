# Quick Start - Deploy to GitHub Pages

**Repository:** exabyte_studio_website_website
**Domain:** exabyte.studio

---

## 1. Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `exabyte_studio_website`
3. Description: `Official website for Exabyte Studio`
4. Public repository ✓
5. Do NOT initialize with README
6. Click "Create repository"

---

## 2. Push Code

**Replace `YOUR_USERNAME` with your GitHub username:**

```bash
cd /Users/jiaweizhang/PycharmProjects/Exabyte_Studio/website

git init
git add .
git commit -m "Initial website deployment"
git remote add origin https://github.com/YOUR_USERNAME/exabyte_studio_website.git
git branch -M main
git push -u origin main
```

**Authentication:** Use Personal Access Token (not password)
- Create token at: https://github.com/settings/tokens

---

## 3. Enable GitHub Pages

1. Go to repo: `https://github.com/YOUR_USERNAME/exabyte_studio_website`
2. Click **Settings** tab
3. Click **Pages** (left sidebar)
4. Source: **Branch: main**, Folder: **/ (root)**
5. Click **Save**
6. Under "Custom domain": Enter `exabyte.studio`
7. Click **Save**

---

## 4. Configure DNS in Squarespace

1. Log in: https://account.squarespace.com/
2. Go to: **Settings** > **Domains** > **exabyte.studio** > **DNS Settings**
3. Delete existing A and CNAME records (if any)

**Add 4 A records:**
```
Type: A, Host: @, Value: 185.199.108.153
Type: A, Host: @, Value: 185.199.109.153
Type: A, Host: @, Value: 185.199.110.153
Type: A, Host: @, Value: 185.199.111.153
```

**Add 1 CNAME record:**
```
Type: CNAME, Host: www, Value: YOUR_USERNAME.github.io
```

*Replace `YOUR_USERNAME` with your actual GitHub username!*

4. Click **Save**

---

## 5. Wait for DNS

**Check propagation:** https://dnschecker.org
- Enter: `exabyte.studio`
- Should show GitHub IPs (185.199.108.153, etc.)

**Or use command:**
```bash
dig exabyte.studio +short
```

**Expected:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Typical wait time:** 2-6 hours (can be up to 48 hours)

---

## 6. Enable HTTPS

**After DNS is working:**

1. Go to repo **Settings** > **Pages**
2. Wait for: ✅ "DNS check successful"
3. Check: ☑️ **Enforce HTTPS**
4. Wait for SSL certificate (0-24 hours)

---

## 7. Verify

**Test these URLs:**
- https://exabyte.studio ✅
- https://www.exabyte.studio ✅
- All pages load correctly
- Particle animation works
- No console errors

---

## Done! 🎉

**Your website is now live at:** https://exabyte.studio

**Future updates:**
```bash
cd /Users/jiaweizhang/PycharmProjects/Exabyte_Studio/website
git add .
git commit -m "Update: description"
git push
```

---

**Full instructions:** See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
**Troubleshooting:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
