# 🎉 Hybrid Database Setup Complete!

## ✅ What's Been Implemented

Your app now automatically switches between SQLite and Supabase based on the environment!

### **Local Development (Your Computer):**
- ✅ Uses SQLite (`app/data/events.db`)
- ✅ Fast and offline
- ✅ No network latency
- ✅ Free (no database costs)

### **Production (Vercel):**
- ✅ Uses Supabase PostgreSQL
- ✅ Works on serverless
- ✅ Scalable and reliable
- ✅ Real-time capabilities

---

## 🚀 Setup Instructions

### **Step 1: Set Up Supabase Tables**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase-setup.sql`
6. Click **Run** (or press Ctrl+Enter)

**Expected output:**
```
Success. No rows returned
```

**Verify tables were created:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'categories', 'participants');
```

Should show 3 tables.

---

### **Step 2: Add Environment Variables to Vercel**

1. Go to: https://vercel.com/dashboard
2. Select your project: **qr-registration**
3. Go to **Settings** → **Environment Variables**

**Add these 3 variables:**

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jxvxchjvxexwskzqlqjm.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://qr-registration-4vot.vercel.app` | Production, Preview, Development |

---

### **Step 3: Redeploy to Vercel**

After adding environment variables:

**Option A: From Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

**Option B: Push to GitHub**
```bash
git add .
git commit -m "Add hybrid database support"
git push
```

---

### **Step 4: Update Supabase Redirect URLs**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**

**Add these redirect URLs:**
```
https://qr-registration-4vot.vercel.app/check-in/*
http://localhost:3000/check-in/*
```

---

## 🧪 Testing

### **Test Local (SQLite):**

```bash
# Run locally
npm run dev

# Visit
http://localhost:3000/dashboard

# Create events, categories, participants
# Data saved to: app/data/events.db
```

### **Test Production (Supabase):**

```bash
# Visit your live app
https://qr-registration-4vot.vercel.app/dashboard

# Create events, categories, participants
# Data saved to: Supabase PostgreSQL
```

---

## 🔄 How It Works

### **Automatic Database Switching:**

```typescript
// app/src/lib/db-config.ts
export const useSupabase = isProduction || isVercel;
```

**Logic:**
- If `NODE_ENV === 'production'` → Use Supabase
- If `VERCEL === '1'` → Use Supabase
- Otherwise → Use SQLite

### **Unified Repository Interface:**

```typescript
// app/src/lib/repositories/index.ts
export const eventRepository = getDbType() === 'sqlite' 
  ? sqliteEventRepo 
  : supabaseEventRepository;
```

**Your API routes don't change!** They just import from `@/lib/repositories` and the correct database is used automatically.

---

## 📊 Database Comparison

| Feature | SQLite (Local) | Supabase (Production) |
|---------|----------------|----------------------|
| **Speed** | ⚡ Very Fast | 🌐 Network latency |
| **Offline** | ✅ Works offline | ❌ Needs internet |
| **Scalability** | ⚠️ Single file | ✅ Highly scalable |
| **Serverless** | ❌ Needs file system | ✅ Works on Vercel |
| **Cost** | ✅ Free | ✅ Free tier (500MB) |
| **Real-time** | ❌ No | ✅ Yes |
| **Backup** | ⚠️ Manual | ✅ Automatic |

---

## 🗂️ File Structure

```
app/src/lib/
├── db.ts                                    # SQLite setup
├── supabase.ts                              # Supabase client
├── db-config.ts                             # Database switcher
└── repositories/
    ├── index.ts                             # Unified exports
    ├── event-repository.ts                  # SQLite events
    ├── category-repository.ts               # SQLite categories
    ├── participant-repository.ts            # SQLite participants
    ├── supabase-event-repository.ts         # Supabase events
    ├── supabase-category-repository.ts      # Supabase categories
    └── supabase-participant-repository.ts   # Supabase participants
```

---

## 🔍 Verify Setup

### **Check Local Database:**
```bash
# SQLite database should exist
ls -la app/data/events.db
```

### **Check Supabase Tables:**
```sql
-- Run in Supabase SQL Editor
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('events', 'categories', 'participants');
```

### **Check Environment:**
```bash
# Local
echo $NODE_ENV  # Should be empty or 'development'

# Vercel (check in deployment logs)
# NODE_ENV = 'production'
# VERCEL = '1'
```

---

## 🎯 Current Status

### ✅ **Completed:**
- Database switcher logic
- SQLite repositories (existing)
- Supabase repositories (new)
- Unified repository exports
- API routes updated
- Automatic environment detection

### ⏳ **Next Steps:**
1. Run `supabase-setup.sql` in Supabase
2. Add env vars to Vercel
3. Redeploy
4. Test both environments

---

## 🆘 Troubleshooting

### **Local: "Database file not found"**
```bash
# Create data directory
mkdir -p app/data

# Run app - database will be created automatically
npm run dev
```

### **Production: "Failed to fetch events"**
- Check Supabase tables are created
- Verify env vars in Vercel
- Check Supabase RLS policies
- Look at Vercel deployment logs

### **Supabase: "Row Level Security" errors**
The setup script includes policies that allow all operations. If you get RLS errors:

```sql
-- Disable RLS temporarily for testing
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
```

---

## 🔐 Security Notes

### **Current Setup:**
- ✅ RLS enabled on all tables
- ✅ Policies allow all operations (for development)
- ⚠️ **Production:** You should restrict policies

### **Recommended Production Policies:**

```sql
-- Only allow authenticated users to manage events
DROP POLICY IF EXISTS "Allow all operations on events" ON events;

CREATE POLICY "Authenticated users can manage events" 
ON events FOR ALL 
USING (auth.role() = 'authenticated');

-- Similar for categories and participants
```

---

## 📈 Performance Tips

### **Local Development:**
- SQLite is already optimized
- Database file is small and fast
- No network calls

### **Production (Supabase):**
- Use indexes (already created)
- Batch operations when possible
- Consider caching for read-heavy operations

---

## 🎉 Success Checklist

- [ ] Supabase tables created
- [ ] Environment variables added to Vercel
- [ ] App redeployed
- [ ] Supabase redirect URLs configured
- [ ] Local app works (SQLite)
- [ ] Production app works (Supabase)
- [ ] QR codes show production URL
- [ ] Can create events/categories/participants

---

## 🚀 You're Ready!

Your hybrid database setup is complete! 

**Local:** Fast SQLite development
**Production:** Scalable Supabase deployment

**Next:** Build the check-in flow! 💪
