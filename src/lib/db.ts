import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'longevity-stack.db');
const IS_VERCEL = !!process.env.VERCEL;

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    if (IS_VERCEL) {
      // Vercel has a read-only filesystem — open DB read-only, skip WAL and schema init
      // Try process.cwd() first, fall back to __dirname-relative path
      const fs = require('fs');
      let dbPath = DB_PATH;
      if (!fs.existsSync(dbPath)) {
        dbPath = path.join(__dirname, '..', '..', 'data', 'longevity-stack.db');
      }
      if (!fs.existsSync(dbPath)) {
        // Last resort: check common Vercel paths
        const altPath = path.join('/var/task', 'data', 'longevity-stack.db');
        if (fs.existsSync(altPath)) dbPath = altPath;
      }
      db = new Database(dbPath, { readonly: true });
      db.pragma('foreign_keys = ON');
    } else {
      const fs = require('fs');
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      db = new Database(DB_PATH);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
      initializeDb(db);
    }
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      affiliate_program TEXT,
      affiliate_id TEXT,
      commission_rate REAL,
      feed_type TEXT,
      ships_direct INTEGER DEFAULT 1,
      trust_score INTEGER DEFAULT 5,
      trust_notes TEXT,
      free_shipping_threshold REAL,
      shipping_base REAL,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      ingredient TEXT NOT NULL,
      ingredient_slug TEXT NOT NULL,
      brand TEXT,
      dose_mg REAL,
      dose_unit TEXT DEFAULT 'mg',
      form TEXT,
      servings_per_container INTEGER,
      category TEXT NOT NULL DEFAULT 'supplement',
      subcategory TEXT,
      description TEXT,
      mechanism TEXT,
      typical_dose TEXT,
      scientific_name TEXT,
      research TEXT DEFAULT '[]',
      interactions TEXT DEFAULT '[]',
      synergies TEXT DEFAULT '[]',
      pathways TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id),
      vendor_id INTEGER REFERENCES vendors(id),
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      url TEXT NOT NULL,
      affiliate_url TEXT,
      in_stock INTEGER DEFAULT 1,
      subscribe_price REAL,
      last_checked TEXT DEFAULT (datetime('now')),
      last_changed TEXT DEFAULT (datetime('now')),
      UNIQUE(product_id, vendor_id)
    );

    CREATE TABLE IF NOT EXISTS stacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      goal TEXT,
      ingredients TEXT NOT NULL DEFAULT '[]',
      dosing_notes TEXT,
      source TEXT,
      source_url TEXT,
      research TEXT DEFAULT '[]',
      is_featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS biomarker_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      biomarker TEXT NOT NULL,
      unit TEXT,
      optimal_low REAL,
      optimal_high REAL,
      concern_low REAL,
      concern_high REAL,
      high_recommendation TEXT,
      low_recommendation TEXT,
      suggested_ingredients TEXT DEFAULT '[]',
      research_notes TEXT,
      disclaimer TEXT DEFAULT 'This is informational, not medical advice. Consult your healthcare provider.'
    );
  `);
}

// Helper types
export interface Vendor {
  id: number;
  name: string;
  slug: string;
  url: string;
  affiliate_program: string | null;
  affiliate_id: string | null;
  commission_rate: number | null;
  feed_type: string | null;
  ships_direct: number;
  trust_score: number;
  trust_notes: string | null;
  free_shipping_threshold: number | null;
  shipping_base: number | null;
  active: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  ingredient: string;
  ingredient_slug: string;
  brand: string | null;
  dose_mg: number | null;
  dose_unit: string;
  form: string | null;
  servings_per_container: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  mechanism: string | null;
  typical_dose: string | null;
  scientific_name: string | null;
  research: string;
  interactions: string;
  synergies: string;
  pathways: string;
}

export interface Price {
  id: number;
  product_id: number;
  vendor_id: number;
  price: number;
  currency: string;
  url: string;
  affiliate_url: string | null;
  in_stock: number;
  subscribe_price: number | null;
  last_checked: string;
}

export interface Stack {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  goal: string | null;
  ingredients: string;
  dosing_notes: string | null;
  source: string | null;
  source_url: string | null;
  research: string;
  is_featured: number;
}

export interface ProductWithPrice extends Product {
  price: number;
  vendor_name: string;
  vendor_slug: string;
  vendor_trust_score: number;
  vendor_trust_notes: string | null;
  vendor_ships_direct: number;
  product_url: string;
  affiliate_url: string | null;
  per_serving_price: number | null;
}
