# Component Specifications

## shadcn/ui Components Needed
- button
- card
- table
- dialog
- form
- input
- label
- badge
- alert
- progress
- tabs
- select
- checkbox
- separator
- toast

## Custom Components

### EventCard
**Purpose:** Display event summary card
**Props:**
- event: { id, name, date, categoryCount, participantCount }
**Features:**
- Click to navigate to event detail
- Show event name, date
- Show stats: "X categories • Y participants"
- Action buttons: Edit, Delete

### CategoryList
**Purpose:** Display categories under an event
**Props:**
- categories: { id, name, participantCount, checkedInCount }[]
- eventId: string
**Features:**
- Table layout: Name | Participants | Checked In | QR Code | Actions
- QR code preview thumbnail
- Click row to view category detail

### ParticipantTable
**Purpose:** Display and manage participants
**Props:**
- participants: Participant[]
- onCheckIn: (id) => void
- onEdit: (participant) => void
- onDelete: (id) => void
- onMarkWinner: (id, rank) => void
**Features:**
- Columns: Email | Name | School | Status | Check-in Time | Winner | Actions
- Status badge: green for checked-in, gray for pending
- Winner badge: gold/silver/bronze for 1st/2nd/3rd
- Search input
- Filter tabs: All | Checked In | Pending
- Manual check-in toggle
- Winner dropdown (1st/2nd/3rd place)

### QRCodeDisplay
**Purpose:** Generate and display QR code
**Props:**
- categoryId: string
- categoryName: string
**Features:**
- Generate QR encoding: https://yourdomain.com/check-in/[categoryId]
- Display QR code image
- Download button (PNG, 512x512px)
- Copy link button

### FileUploadModal
**Purpose:** Upload and preview CSV/Excel
**Props:**
- categoryId: string
- onImportComplete: () => void
**Features:**
- Drag-drop zone
- File type validation (.csv, .xlsx, .xls)
- Parse file with papaparse/xlsx
- Preview table (first 10 rows)
- Show row count
- Validation errors display
- Import button (disabled if errors)
- Progress bar during import

### CheckInForm
**Purpose:** User check-in interface
**Props:**
- categoryId: string
**Features:**
- Display event and category name
- Email input field
- "Send Verification Link" button
- Loading state during magic link send
- Success message after link sent
- Auto-handle magic link callback
- Display participant info for confirmation
- "Confirm Attendance" button
- Success screen after confirmation

### SyncModal
**Purpose:** Manage SQLite to Supabase sync
**Props:**
- participantCount: number
- onSync: () => Promise<void>
**Features:**
- Show current participant count
- Warning when approaching 50
- Sync progress bar
- Success/error messages
- Close after successful sync

### StatsCard
**Purpose:** Display key metrics
**Props:**
- title: string
- value: number
- icon: ReactNode
**Features:**
- Large number display
- Icon
- Optional subtitle