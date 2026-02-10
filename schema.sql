-- registrations table
CREATE TABLE registrations (
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
