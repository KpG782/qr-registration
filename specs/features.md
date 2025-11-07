# Feature Requirements

## 1. Event Management
- Create event with name, description, date
- List all events in card grid layout
- Edit event details
- Delete event (cascades to categories and participants)
- View event statistics (total categories, total participants)

## 2. Category Management
- Add category to event (input: category name)
- List all categories under an event
- Each category automatically gets unique QR code
- QR code URL format: https://yourdomain.com/check-in/[categoryId]
- Download QR code as PNG
- Edit category name
- Delete category

## 3. Participant Management
- Upload CSV/Excel file with columns: email, full_name, school_institution
- Validate: email format must be valid
- Validate: no duplicate emails within same category
- Show preview of parsed data before importing
- Display progress during bulk import
- View all participants in table format
- Columns: Email, Full Name, School, Status, Check-in Time, Actions
- Filter by status: All | Checked In | Pending
- Search by name or email
- Manual add single participant via form
- Edit participant details
- Delete participant
- Manual check-in toggle (admin override)

## 4. QR Check-in Flow (User-facing)
- User scans QR code
- Redirect to check-in page: /check-in/[categoryId]
- Show category name and event name
- Input field: "Enter your registered email"
- Click "Send Verification Link"
- System sends magic link to email via Supabase Auth
- User clicks magic link
- Auto-redirect back to check-in page
- System finds participant by email + categoryId
- Display: "Is this you? [Full Name] from [School]"
- Button: "Yes, Confirm Attendance"
- On confirm: mark attendance_status = 'checked_in', set checked_in_at timestamp
- Show success screen: "✓ Attendance Confirmed!"
- Display check-in time

## 5. Winner Management
- Admin can mark winners: 1st, 2nd, 3rd place
- UI: Dropdown on participant row or dedicated modal
- Only one participant can be 1st place (validation)
- Display winner badges on participant table
- Export winners list (CSV)

## 6. Offline Support
- When offline: queue check-ins in IndexedDB
- Show "Offline Mode" indicator in UI
- When online: auto-sync queued check-ins to database
- Show sync status notification

## 7. Data Sync to Supabase
- Monitor total participant count
- When count >= 50: trigger sync modal
- Admin can manually trigger sync anytime
- Sync process:
  1. Export all data from SQLite
  2. Batch insert to Supabase
  3. Mark local data as "synced"
  4. Switch app to use Supabase for all operations
- Show sync progress