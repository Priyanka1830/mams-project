-- 1. Create Bases Table
CREATE TABLE IF NOT EXISTS bases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER')),
    base_id INT REFERENCES bases(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Equipment Catalog Table
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('WEAPON', 'AMMUNITION', 'VEHICLE', 'GEAR')),
    unit_of_measure VARCHAR(20) DEFAULT 'units',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Opening Balances Table
CREATE TABLE IF NOT EXISTS opening_balances (
    id SERIAL PRIMARY KEY,
    base_id INT REFERENCES bases(id) ON DELETE CASCADE,
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(base_id, equipment_id)
);

-- 5. Create Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    base_id INT REFERENCES bases(id) ON DELETE CASCADE,
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Transfers Table
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    from_base_id INT REFERENCES bases(id) ON DELETE CASCADE,
    to_base_id INT REFERENCES bases(id) ON DELETE CASCADE,
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DISPATCHED', 'COMPLETED', 'REJECTED')),
    initiated_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    base_id INT REFERENCES bases(id) ON DELETE CASCADE,
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    assigned_to_personnel VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'RETURNED', 'EXPENDED')),
    assigned_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SEED DEMO DATA
-- ========================================================

-- Insert Bases
INSERT INTO bases (id, name, location) VALUES
(1, 'Fort Alpha', 'Sector 4 - Northern Grid'),
(2, 'Camp Bravo', 'Sector 9 - Southern Ridge')
ON CONFLICT (id) DO NOTHING;

-- Insert Equipment
INSERT INTO equipment (id, name, category, unit_of_measure) VALUES
(1, 'M4A1 Carbine', 'WEAPON', 'units'),
(2, '5.56mm NATO Ammo Box', 'AMMUNITION', 'boxes'),
(3, 'JLTV Armored Vehicle', 'VEHICLE', 'units')
ON CONFLICT (id) DO NOTHING;

-- Insert Opening Balances
INSERT INTO opening_balances (base_id, equipment_id, quantity) VALUES
(1, 1, 150), -- Fort Alpha: 150 M4A1s
(1, 2, 500), -- Fort Alpha: 500 Ammo Boxes
(1, 3, 20),  -- Fort Alpha: 20 JLTVs
(2, 1, 80),  -- Camp Bravo: 80 M4A1s
(2, 2, 250), -- Camp Bravo: 250 Ammo Boxes
(2, 3, 10)   -- Camp Bravo: 10 JLTVs
ON CONFLICT DO NOTHING;

-- Insert Seed Users
INSERT INTO users (username, password_hash, role, base_id) VALUES
('admin.supreme', 'hash_demo_123', 'ADMIN', NULL),
('cmd.alpha', 'hash_demo_123', 'BASE_COMMANDER', 1),
('log.alpha', 'hash_demo_123', 'LOGISTICS_OFFICER', 1),
('cmd.bravo', 'hash_demo_123', 'BASE_COMMANDER', 2)
ON CONFLICT (username) DO NOTHING;
