// Unified repository exports - automatically switches between SQLite and Supabase

import { getDbType } from '../db-config';

// Event Repository
import { eventRepository as sqliteEventRepo } from './event-repository';
import { supabaseEventRepository } from './supabase-event-repository';

export const eventRepository = getDbType() === 'sqlite' 
  ? sqliteEventRepo 
  : supabaseEventRepository;

// Category Repository
import { categoryRepository as sqliteCategoryRepo } from './category-repository';
import { supabaseCategoryRepository } from './supabase-category-repository';

export const categoryRepository = getDbType() === 'sqlite'
  ? sqliteCategoryRepo
  : supabaseCategoryRepository;

// Participant Repository
import { participantRepository as sqliteParticipantRepo } from './participant-repository';
import { supabaseParticipantRepository } from './supabase-participant-repository';

export const participantRepository = getDbType() === 'sqlite'
  ? sqliteParticipantRepo
  : supabaseParticipantRepository;

// Export types
export type { Event, CreateEventInput, UpdateEventInput, EventWithStats } from './event-repository';
export type { Category, CreateCategoryInput, UpdateCategoryInput, CategoryWithStats } from './category-repository';
export type { Participant, CreateParticipantInput, UpdateParticipantInput } from './participant-repository';
