
-- All objects that reference that row (directly or indirectly) will be deleted when this snippet is executed.
-- To preview the rows to be deleted, use Select Row Dependencies
START TRANSACTION;
-- Provide the values of the primary key of the row to delete.
SET @id_to_delete = <{row_id}>;

DELETE FROM products
    USING products
    WHERE products.id = @id_to_delete;
COMMIT;
DROP SCHEMA IF EXISTS ecommerce_db;
CREATE SCHEMA ecommerce_db; 

-- INSERT INTO products (id, item_name, item_description, price, stock, image_url)
-- VALUES (1, 'paco', 'testtt', '24.34', '4', '3e.png');

-- SELECT * FROM products;
	
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255),
  item_description TEXT,
  price DECIMAL(10,2),
  stock INT,
  image_url VARCHAR(255)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  address TEXT
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_date DATETIME,
  total DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO products (id, item_name,  item_description, price, stock, image_url) VALUES
(1, 'Prada', 'testing descriptions', '12.22', '2', 'one.png'),
(2, 'Gucci', 'testing', '34', '8', '2.png');