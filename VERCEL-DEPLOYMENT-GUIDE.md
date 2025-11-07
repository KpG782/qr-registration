# 🚀 Vercel Deployment Configuration Guide

## 🎉 Your App is Live!
**URL:** https://qr-registration-4vot.vercel.app

---

## ⚙️ Step 1: Add Environment Variables to Vercel

### **Go to Vercel Dashboard:**

1. Visit: https://vercel.com/dashboard
2. Click on your project: **qr-registration**
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

---

### **Add These 3 Variables:**

#### **1. NEXT_PUBLIC_SUPABASE_URL**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://jxvxchjvxexwskzqlqjm.supabase.co`
- **Environment:** Production, Preview, Development (select all)

#### **2. NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dnhjaGp2eGV4d3NrenFscWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Mjc2MTAsImV4cCI6MjA3ODEwMzYxMH0.mzSPSKl9zcrmjObnfXVm5f9TtC5Yuknt-zvgcgHNs3k`
- **Environment:** Production, Preview, Development (select all)

#### **3. NEXT_PUBLIC_APP_URL**
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://qr-registration-4vot.vercel.app`
- **Environment:** Production, Preview, Development (select all)

---

### **Screenshot Guide:**

```
Vercel Dashboard → Your Project → Settings → Environment Variables

┌─────────────────────────────────────────────────────────┐
│ Add New Variable                                         │
├─────────────────────────────────────────────────────────┤
│ Key:   NEXT_PUBLIC_SUPABASE_URL                         │
│ Value: https://jxvxchjvxexwskzqlqjm.supabase.co        │
│                                                          │
│ ☑ Production  ☑ Preview  ☑ Development                 │
│                                                          │
│ [Add]                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Step 2: Redeploy After Adding Variables

After adding all 3 environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2 minutes)

**Or trigger a new deployment:**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

---

## 🔗 Step 3: Update Supabase Redirect URLs

Your QR codes will redirect to your Vercel URL, so Supabase needs to allow it.

### **Go to Supabase Dashboard:**

1. Visit: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**

### **Add These URLs:**

#### **Site URL:**
```
https://qr-registration-4vot.vercel.app
```

#### **Redirect URLs (add both):**
```
https://qr-registration-4vot.vercel.app/check-in/*
http://localhost:3000/check-in/*
```

**Why both?**
- Production URL for live QR codes
- Localhost for local development

---

## 📱 Step 4: Test Your QR Codes

Now your QR codes will work with the production URL!

### **Test Flow:**

1. **Go to your live app:**
   https://qr-registration-4vot.vercel.app/dashboard

2. **Create an event and category**

3. **View QR code** - it should now show:
   ```
   https://qr-registration-4vot.vercel.app/check-in/[categoryId]
   ```

4. **Download and scan** the QR code with your phone

5. **It should redirect** to your live check-in page

---

## 🗄️ Important: Database Limitation

### **⚠️ SQLite Won't Work on Vercel!**

Vercel is **serverless** - each request runs in a new container. SQLite needs a persistent file system.

### **Solutions:**

#### **Option 1: Use Supabase Database (Recommended)**
- Switch from SQLite to Supabase PostgreSQL
- Supabase is already set up for auth
- Free tier: 500MB database, 2GB bandwidth

#### **Option 2: Use Vercel Postgres**
- Vercel's managed PostgreSQL
- Paid service ($20/month)

#### **Option 3: Keep SQLite for Local Only**
- Use SQLite for development
- Use Supabase for production
- Implement database switching based on environment

---

## 🔄 Recommended: Switch to Supabase Database

Since you're already using Supabase for auth, let's use it for the database too!

### **Benefits:**
- ✅ Works on Vercel (serverless)
- ✅ Already configured
- ✅ Free tier available
- ✅ Real-time features
- ✅ Built-in auth integration

### **What Needs to Change:**
1. Create tables in Supabase (same schema as SQLite)
2. Update repositories to use Supabase client instead of SQLite
3. Keep SQLite for local development (optional)

---

## 📋 Current Status

### **✅ Working:**
- Vercel deployment
- Environment variables (after you add them)
- Frontend UI
- QR code generation with production URL

### **⚠️ Not Working Yet:**
- Database operations (SQLite doesn't work on Vercel)
- Creating events/categories/participants
- Check-in flow

### **🔧 Needs Setup:**
- Supabase database tables
- Repository layer update
- Database switching logic

---

## 🎯 Next Steps

### **Immediate (Do Now):**

1. **Add environment variables to Vercel** (see Step 1)
2. **Redeploy** (see Step 2)
3. **Update Supabase redirect URLs** (see Step 3)

### **Soon (For Full Functionality):**

4. **Create Supabase tables** (I can help with this)
5. **Update repository layer** to use Supabase
6. **Test full flow** on production

---

## 🆘 Troubleshooting

### **QR codes still show localhost:**
- Check if `NEXT_PUBLIC_APP_URL` is set in Vercel
- Redeploy after adding env vars
- Clear browser cache

### **Supabase auth not working:**
- Check redirect URLs in Supabase dashboard
- Make sure anon key is correct
- Check browser console for errors

### **Database errors:**
- Expected! SQLite doesn't work on Vercel
- Need to switch to Supabase database

---

## 📝 Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase auth |
| `NEXT_PUBLIC_APP_URL` | `https://qr-registration-4vot.vercel.app` | QR code URLs |

---

## 🎉 After Configuration

Once you add the env vars and redeploy:

1. ✅ QR codes will use production URL
2. ✅ Supabase auth will work
3. ⚠️ Database operations need Supabase setup

---

## 🚀 Want to Set Up Supabase Database Now?

I can help you:
1. Create the tables in Supabase
2. Update the repository layer
3. Make it work on both local (SQLite) and production (Supabase)

**Ready to continue?** Let me know! 💪

---

**Your deployment is live! Just needs env vars and database setup!** 🎉
