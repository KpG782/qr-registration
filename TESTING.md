# 🧪 Testing Guide - QR Registration System

## ✅ Setup Verification

Your system is ready! Here's what's been set up:

### Database
- ✅ SQLite database created at `app/data/events.db`
- ✅ All tables created (events, categories, participants)
- ✅ Indexes created for performance
- ✅ Foreign keys enabled for data integrity

### Application Structure
- ✅ Root layout with Toaster notifications
- ✅ Dashboard layout with sidebar navigation
- ✅ Event repository with full CRUD operations
- ✅ API routes for events
- ✅ Event management UI (list, create, edit, delete)

---

## 🚀 How to Start Testing

### 1. Start the Development Server

```bash
cd app
npm run dev
```

Wait for the message: `Ready on http://localhost:3000`

### 2. Open Your Browser

Visit: **http://localhost:3000**

You should be automatically redirected to: **http://localhost:3000/dashboard**

---

## 📋 Test Scenarios

### Test 1: Dashboard Page ✅

**What to check:**
- Dashboard page loads successfully
- You see "Dashboard" heading
- Three stat cards showing:
  - Total Events: 0
  - Total Categories: 0
  - Total Participants: 0
- Sidebar shows "Dashboard" and "Events" links

**Expected result:** Clean dashboard with zero stats

---

### Test 2: Navigate to Events Page ✅

**Steps:**
1. Click "Events" in the sidebar
2. You should see `/dashboard/events` in the URL

**What to check:**
- Page heading: "Events"
- Subheading: "Manage your events"
- "Create Event" button (top right)
- Empty state message: "No events yet"
- Button: "Create your first event"

**Expected result:** Empty events page with call-to-action

---

### Test 3: Create Your First Event ✅

**Steps:**
1. Click "Create Event" button
2. You should see `/dashboard/events/new` in the URL
3. Fill in the form:
   - **Event Name:** ICT Olympics 2025 (required)
   - **Description:** Annual technology competition
   - **Event Date:** Pick today's date or any future date
4. Click "Create Event" button

**What to check:**
- Form validation works (try submitting without name)
- Button shows "Creating..." while processing
- Toast notification appears: "Event created successfully"
- Redirects back to `/dashboard/events`
- Your new event card appears in the grid

**Expected result:** Event created and displayed in grid

---

### Test 4: Event Card Display ✅

**What to check on the event card:**
- Calendar icon with event name: "ICT Olympics 2025"
- Date displayed correctly
- Stats: "0 categories • 0 participants" (expected, nothing added yet)
- Two buttons: Edit (pencil icon) and Delete (trash icon)
- Card has hover effect (shadow increases on hover)

**Expected result:** Event card displays all information correctly

---

### Test 5: Create Multiple Events ✅

**Steps:**
1. Click "Create Event" again
2. Create 2-3 more events with different names:
   - Science Fair 2025
   - Math Competition 2025
   - Robotics Challenge 2025

**What to check:**
- Events appear in grid layout (3 columns on large screens)
- All events display correctly
- Grid is responsive

**Expected result:** Multiple event cards in a nice grid

---

### Test 6: Click Event Card ✅

**Steps:**
1. Click anywhere on an event card (not the buttons)

**What to check:**
- Should navigate to `/dashboard/events/[eventId]`
- You'll see a 404 or blank page (expected - we haven't built this yet)

**Expected result:** Navigation works (page not built yet is OK)

---

### Test 7: Edit Event Button ✅

**Steps:**
1. Click the Edit button (pencil icon) on an event card

**What to check:**
- Should navigate to `/dashboard/events/[eventId]/edit`
- You'll see a 404 or blank page (expected - we haven't built this yet)

**Expected result:** Navigation works (page not built yet is OK)

---

### Test 8: Delete Event ✅

**Steps:**
1. Click the Delete button (trash icon) on an event card
2. Confirmation dialog appears: "Are you sure you want to delete this event?"
3. Click "OK" to confirm

**What to check:**
- Confirmation dialog appears
- After confirming:
  - Toast notification: "Event deleted successfully"
  - Event card disappears from the grid
  - If it was the last event, empty state appears again

**Expected result:** Event deleted successfully with confirmation

---

### Test 9: Dashboard Stats Update ✅

**Steps:**
1. Create 2-3 events
2. Click "Dashboard" in the sidebar
3. Check the stats

**What to check:**
- Total Events should show the correct count (e.g., 3)
- Total Categories: still 0 (we haven't built this yet)
- Total Participants: still 0 (we haven't built this yet)

**Note:** You may need to refresh the page to see updated stats

**Expected result:** Event count updates on dashboard

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch events"

**Solution:**
1. Check if dev server is running
2. Open browser console (F12) → Console tab
3. Check for errors
4. Verify database file exists: `app/data/events.db`

### Issue: "Failed to create event"

**Solution:**
1. Open browser console (F12) → Network tab
2. Look for the POST request to `/api/events`
3. Check the response for error details
4. Verify all required fields are filled

### Issue: Database errors

**Solution:**
```bash
# Re-initialize the database
node app/test-db-setup.js
```

### Issue: Page not found (404)

**Solution:**
- Some pages aren't built yet (event detail, edit page)
- This is expected! We're building step by step
- Only these pages should work now:
  - `/dashboard`
  - `/dashboard/events`
  - `/dashboard/events/new`

---

## ✅ What Should Work Now

- ✅ Root page redirects to dashboard
- ✅ Dashboard displays with stats
- ✅ Events list page (empty state and with data)
- ✅ Create event form
- ✅ Event cards display correctly
- ✅ Delete events with confirmation
- ✅ Toast notifications
- ✅ Responsive grid layout
- ✅ Navigation between pages

---

## ⏳ What's Not Built Yet (Expected)

- ⏳ Event detail page (`/dashboard/events/[id]`)
- ⏳ Event edit page (`/dashboard/events/[id]/edit`)
- ⏳ Categories management
- ⏳ Participants upload
- ⏳ QR code generation
- ⏳ Check-in flow

---

## 🎯 Success Criteria

You've successfully tested Event Management if:

1. ✅ You can create events
2. ✅ Events display in a grid
3. ✅ You can delete events
4. ✅ Toast notifications appear
5. ✅ Dashboard stats update
6. ✅ No console errors (except for unbuilt pages)

---

## 📊 Your Progress

**Current Status: 35% Complete**

✅ **Completed:**
- Database setup
- Supabase client
- Basic layouts
- Event CRUD (full)

⏳ **Next Up:**
- Category Management (25%)
- Participant Upload (15%)
- QR Generation (10%)
- Check-in Flow (10%)

---

## 🚀 Ready for Next Step?

Once you've tested everything and it works, paste this to Kiro:

```
Great! Events CRUD is working. Now let's implement Category Management from features.md section 2.

1. Create /app/lib/repositories/category-repository.ts:
   - getAllCategories()
   - getCategoriesByEventId(eventId)
   - getCategoryById(id)
   - createCategory(data: { eventId, name })
   - updateCategory(id, data)
   - deleteCategory(id)
   - Include participantCount in category objects

2. Create API routes:
   - POST /api/categories - Create category
   - GET /api/categories?eventId=[id] - List by event
   - GET /api/categories/[id] - Get single category
   - PATCH /api/categories/[id] - Update category
   - DELETE /api/categories/[id] - Delete category

3. Create /app/dashboard/events/[eventId]/page.tsx:
   - Show event details at top
   - List all categories in table format
   - "Add Category" button
   - Each category row shows: Name, Participants count, Actions (View, Edit, Delete)

4. Create /app/components/category-list.tsx:
   - Table component to display categories
   - Columns: Name | Participants | Actions
   - Actions: View Details, Edit, Delete
   - Empty state if no categories

5. Add category creation dialog/modal:
   - Simple form: Category Name input
   - Save button posts to API
   - Closes on success and refreshes list

Follow the specs and use shadcn Table, Dialog components.
```

---

## 💡 Pro Tips

1. **Keep the dev server running** - It auto-reloads on changes
2. **Check browser console** - Press F12 to see errors
3. **Use Network tab** - See API requests and responses
4. **Test edge cases** - Try empty forms, long names, etc.
5. **Create test data** - Make 3-5 events to see the grid properly

---

## 🎉 You're Doing Great!

The foundation is solid. Event management is fully functional. Now we'll build categories, then participants, then the QR check-in flow!

Keep going! 💪
