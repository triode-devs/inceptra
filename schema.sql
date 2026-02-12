-- registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    college_id TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    year INTEGER NOT NULL,
    college TEXT NOT NULL,
    address TEXT NOT NULL,
    food TEXT NOT NULL,
    registration_type TEXT NOT NULL, -- 'symposium' | 'cultural'
    dept TEXT,
    technical_events TEXT, -- JSON stringified array
    non_technical_events TEXT, -- JSON stringified array
    cultural_events TEXT, -- JSON stringified array
    amount INTEGER NOT NULL,
    payment_screenshot_key TEXT, -- R2 object key
    payment_status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    user_id TEXT, -- Firebase User UID
    paper_title TEXT, -- Paper presentation title
    paper_file TEXT, -- R2 object key for paper file
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- initial settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('offline_payment_enabled', 'false');
