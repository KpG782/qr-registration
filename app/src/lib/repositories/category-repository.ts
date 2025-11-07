import getDb, { generateId } from '../db';

export interface Category {
  id: string;
  event_id: string;
  name: string;
  created_at: number;
}

export interface CreateCategoryInput {
  eventId: string;
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export interface CategoryWithStats extends Category {
  participantCount: number;
}

class CategoryRepository {
  getAllCategories(): CategoryWithStats[] {
    const db = getDb();
    const categories = db.prepare(`
      SELECT 
        c.*,
        COUNT(p.id) as participantCount
      FROM categories c
      LEFT JOIN participants p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all() as CategoryWithStats[];
    
    return categories;
  }

  getCategoriesByEventId(eventId: string): CategoryWithStats[] {
    const db = getDb();
    const categories = db.prepare(`
      SELECT 
        c.*,
        COUNT(p.id) as participantCount
      FROM categories c
      LEFT JOIN participants p ON p.category_id = c.id
      WHERE c.event_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all(eventId) as CategoryWithStats[];
    
    return categories;
  }

  getCategoryById(id: string): CategoryWithStats | null {
    const db = getDb();
    const category = db.prepare(`
      SELECT 
        c.*,
        COUNT(p.id) as participantCount
      FROM categories c
      LEFT JOIN participants p ON p.category_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(id) as CategoryWithStats | undefined;
    
    return category || null;
  }

  createCategory(input: CreateCategoryInput): Category {
    const db = getDb();
    const id = generateId();
    
    db.prepare(`
      INSERT INTO categories (id, event_id, name)
      VALUES (?, ?, ?)
    `).run(id, input.eventId, input.name);
    
    return this.getCategoryById(id) as Category;
  }

  updateCategory(id: string, input: UpdateCategoryInput): Category | null {
    const db = getDb();
    
    if (input.name !== undefined) {
      db.prepare(`
        UPDATE categories
        SET name = ?
        WHERE id = ?
      `).run(input.name, id);
    }
    
    return this.getCategoryById(id);
  }

  deleteCategory(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const categoryRepository = new CategoryRepository();
