CREATE TABLE roles (id SERIAL PRIMARY KEY, name VARCHAR(50) UNIQUE NOT NULL);
CREATE TABLE bases (id SERIAL PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL);
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role_id INT REFERENCES roles(id), base_id INT REFERENCES bases(id));
CREATE TABLE equipment (id SERIAL PRIMARY KEY, sku VARCHAR(50) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, category VARCHAR(50) NOT NULL);
CREATE TABLE asset_stocks (id SERIAL PRIMARY KEY, base_id INT REFERENCES bases(id), equipment_id INT REFERENCES equipment(id), opening_balance INT DEFAULT 0, closing_balance INT DEFAULT 0, assigned_count INT DEFAULT 0, expended_count INT DEFAULT 0);
CREATE TABLE transaction_logs (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), action VARCHAR(50) NOT NULL, details JSONB NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

INSERT INTO roles (name) VALUES ('ADMIN'), ('BASE_COMMANDER'), ('LOGISTICS_OFFICER');
INSERT INTO bases (code, name) VALUES ('FORT_ALPHA', 'Fort Alpha'), ('CAMP_BRAVO', 'Camp Bravo');
INSERT INTO users (username, password_hash, role_id, base_id) VALUES 
('admin.supreme', 'hash123', 1, NULL),
('cmd.alpha', 'hash123', 2, 1),
('log.alpha', 'hash123', 3, 1);