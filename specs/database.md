# Database Schema

## Tables

### events
- id: uuid primary key
- name: text not null
- description: text
- date: timestamp
- created_at: timestamp default now()

### categories
- id: uuid primary key
- event_id: uuid references events(id) on delete cascade
- name: text not null
- created_at: timestamp default now()

### participants
- id: uuid primary key
- category_id: uuid references categories(id) on delete cascade
- email: text not null
- full_name: text not null
- school_institution: text
- attendance_status: text check(attendance_status in ('pending','checked_in')) default 'pending'
- checked_in_at: timestamp
- winner_rank: integer check(winner_rank in (1,2,3))
- created_at: timestamp default now()
- unique(category_id, email)

## Indexes
- participants: index on category_id
- participants: index on email
- categories: index on event_id