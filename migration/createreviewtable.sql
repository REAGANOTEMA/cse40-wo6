CREATE TABLE
IF NOT EXISTS Reviews
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_name VARCHAR
(50) NOT NULL,
    rating INT CHECK
(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    designer_name VARCHAR
(50) DEFAULT 'Reagan Otema'
);
