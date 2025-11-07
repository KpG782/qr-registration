# Application Routes

## Admin Routes (Protected - require authentication)

### Dashboard
- Path: `/dashboard`
- Shows: Overview stats, recent events
- Actions: Quick create event

### Events
- Path: `/events`
- Shows: Grid of all events
- Actions: Create new event, search/filter

- Path: `/events/new`
- Shows: Create event form
- Fields: Name, description, date
- Actions: Save, cancel

- Path: `/events/[eventId]`
- Shows: Event details, categories list, stats
- Actions: Edit event, add category, delete event

- Path: `/events/[eventId]/edit`
- Shows: Edit event form
- Actions: Update, cancel

### Categories
- Path: `/events/[eventId]/categories/[categoryId]`
- Shows: Category name, QR code, participants table
- Actions: Upload participants, add single participant, download QR, mark winners

- Path: `/events/[eventId]/categories/[categoryId]/upload`
- Shows: File upload interface, preview table
- Actions: Select file, preview, import, cancel

## Public Routes (No authentication)

### Check-in
- Path: `/check-in/[categoryId]`
- Shows: Event/category name, email input
- Flow: Enter email → Magic link → Confirm identity → Success

- Path: `/check-in/[categoryId]/success`
- Shows: Success message, check-in timestamp
- Actions: Done button

## API Routes

### Events
- POST `/api/events` - Create event
- GET `/api/events` - List all events
- GET `/api/events/[id]` - Get event details
- PATCH `/api/events/[id]` - Update event
- DELETE `/api/events/[id]` - Delete event

### Categories
- POST `/api/categories` - Create category
- GET `/api/categories?eventId=[id]` - List categories by event
- GET `/api/categories/[id]` - Get category details
- PATCH `/api/categories/[id]` - Update category
- DELETE `/api/categories/[id]` - Delete category

### Participants
- POST `/api/participants` - Add single participant
- POST `/api/participants/bulk` - Bulk import from CSV
- GET `/api/participants?categoryId=[id]` - List by category
- PATCH `/api/participants/[id]` - Update participant
- DELETE `/api/participants/[id]` - Delete participant
- POST `/api/participants/[id]/check-in` - Manual check-in

### Check-in
- POST `/api/check-in` - Process check-in
  - Body: { categoryId, email }
  - Returns: participant data or error

### Sync
- POST `/api/sync` - Trigger Supabase sync
- GET `/api/sync/status` - Check sync status