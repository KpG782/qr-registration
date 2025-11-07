# 🚀 GitHub Push Guide - QR Registration System

## 📋 Complete Step-by-Step Instructions

### **Step 1: Initialize Git Repository**

```bash
# Navigate to project root
cd ~/Desktop/`KEN/qr-registration-system

# Initialize git (if not already done)
git init
```

---

### **Step 2: Configure Git User**

```bash
# Set your name and email
git config user.name "Ken Patrick Garcia"
git config user.email "kenpatrickgarcia123@gmail.com"
```

---

### **Step 3: Set Up SSH Agent**

```bash
# Start SSH agent and add your key
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519_KpG782

# Test SSH connection to GitHub
ssh -T git@github.com-KpG782
```

**Expected output:**
```
Hi KpG782! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### **Step 4: Add Remote Repository**

```bash
# Add your GitHub repository as remote
git remote add origin git@github.com-KpG782:KpG782/qr-registration.git

# Verify remote was added
git remote -v
```

**Expected output:**
```
origin  git@github.com-KpG782:KpG782/qr-registration.git (fetch)
origin  git@github.com-KpG782:KpG782/qr-registration.git (push)
```

---

### **Step 5: Stage All Files**

```bash
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status
```

**You should see:**
- ✅ All code files in `app/src/`
- ✅ Spec files in `specs/`
- ✅ Documentation files (*.md)
- ✅ Configuration files
- ❌ NOT `.env.local` (ignored)
- ❌ NOT `data/events.db` (ignored)
- ❌ NOT `node_modules/` (ignored)

---

### **Step 6: Commit Changes**

```bash
# Create initial commit
git commit -m "Initial commit: QR Registration System with Events, Categories, Participants, and QR Code generation"
```

---

### **Step 7: Push to GitHub**

```bash
# Push to main branch
git push -u origin main
```

**If you get an error about branch name, try:**
```bash
# Rename branch to main if needed
git branch -M main

# Then push
git push -u origin main
```

---

## 🔄 Complete Command Sequence (Copy & Paste)

Here's everything in one block for easy copy-paste:

```bash
# Navigate to project
cd ~/Desktop/`KEN/qr-registration-system

# Initialize git (skip if already done)
git init

# Configure user
git config user.name "Ken Patrick Garcia"
git config user.email "kenpatrickgarcia123@gmail.com"

# Set up SSH
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519_KpG782

# Test connection
ssh -T git@github.com-KpG782

# Add remote
git remote add origin git@github.com-KpG782:KpG782/qr-registration.git

# Stage files
git add .

# Check status
git status

# Commit
git commit -m "Initial commit: QR Registration System with Events, Categories, Participants, and QR Code generation"

# Rename branch to main (if needed)
git branch -M main

# Push
git push -u origin main
```

---

## 📦 What Gets Pushed to GitHub

### ✅ **Included (Will be pushed):**

```
qr-registration-system/
├── app/
│   ├── src/
│   │   ├── app/                    ✅ All pages and routes
│   │   ├── components/             ✅ All UI components
│   │   └── lib/                    ✅ Database and repositories
│   ├── public/                     ✅ Static files
│   ├── package.json                ✅ Dependencies
│   ├── .env.example                ✅ Example env file
│   ├── .gitignore                  ✅ Ignore rules
│   ├── next.config.ts              ✅ Next.js config
│   ├── tsconfig.json               ✅ TypeScript config
│   └── data/
│       └── .gitignore              ✅ Database ignore rules
│
├── specs/                          ✅ All specifications
│   ├── database.md
│   ├── features.md
│   ├── routes.md
│   └── components.md
│
├── README.md                       ✅ Project documentation
├── TESTING.md                      ✅ Testing guide
├── PROGRESS.md                     ✅ Progress tracker
├── START-HERE.md                   ✅ Quick start guide
├── QR-CODE-GUIDE.md                ✅ QR feature guide
├── GITHUB-PUSH-GUIDE.md            ✅ This file
└── sample-participants.csv         ✅ Example data
```

### ❌ **Excluded (Won't be pushed):**

```
❌ app/.env.local                   (Your Supabase keys - SENSITIVE!)
❌ app/data/events.db               (Your database with data)
❌ app/data/events.db-shm           (SQLite temp files)
❌ app/data/events.db-wal           (SQLite temp files)
❌ app/node_modules/                (Dependencies - too large)
❌ app/.next/                       (Build files - auto-generated)
```

---

## 🔐 Security Check

**Before pushing, verify sensitive files are ignored:**

```bash
# Check if .env.local is tracked
git status | grep .env.local

# Should return nothing (file is ignored)

# Check if database is tracked
git status | grep events.db

# Should return nothing (file is ignored)
```

---

## 🆘 Troubleshooting

### **Error: "Permission denied (publickey)"**

```bash
# Re-add SSH key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_KpG782

# Test again
ssh -T git@github.com-KpG782
```

### **Error: "remote origin already exists"**

```bash
# Remove existing remote
git remote remove origin

# Add again
git remote add origin git@github.com-KpG782:KpG782/qr-registration.git
```

### **Error: "failed to push some refs"**

```bash
# Pull first (if repo has files)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

### **Error: "src refspec main does not match any"**

```bash
# Make sure you have commits
git log

# If no commits, create one
git commit -m "Initial commit"

# Then push
git push -u origin main
```

---

## 🔄 Future Updates (After Initial Push)

When you make changes later:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Add check-in flow feature"

# Push
git push
```

---

## 👥 For Team Members Cloning Your Repo

When someone clones your repository:

```bash
# Clone the repo
git clone git@github.com-KpG782:KpG782/qr-registration.git

# Navigate to app folder
cd qr-registration/app

# Copy example env file
cp .env.example .env.local

# Edit .env.local and add their Supabase credentials
# (They need to create their own Supabase project)

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## 📝 Recommended README Update

Add this to your `README.md`:

```markdown
## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com-KpG782:KpG782/qr-registration.git
   cd qr-registration/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Database
The SQLite database will be automatically created at `app/data/events.db` on first run.

### Testing
See `TESTING.md` for detailed testing instructions.
```

---

## ✅ Verification Checklist

After pushing, verify on GitHub:

- [ ] Repository shows all files
- [ ] `.env.local` is NOT visible (good!)
- [ ] `events.db` is NOT visible (good!)
- [ ] `node_modules/` is NOT visible (good!)
- [ ] All code files are visible
- [ ] Documentation files are visible
- [ ] `.env.example` is visible

---

## 🎉 Success!

Once pushed, your repository will be live at:
**https://github.com/KpG782/qr-registration**

You can now:
- ✅ Share the repo with others
- ✅ Clone it on other machines
- ✅ Deploy to Vercel/Netlify
- ✅ Collaborate with team members

---

## 🚀 Next Steps

After pushing to GitHub:

1. **Deploy to Vercel** (optional)
   - Connect GitHub repo to Vercel
   - Add environment variables
   - Deploy automatically

2. **Continue Development**
   - Build check-in flow
   - Add winner management
   - Implement offline support

3. **Documentation**
   - Update README with screenshots
   - Add API documentation
   - Create user guide

---

**Need help?** Check the troubleshooting section above or ask! 💪
