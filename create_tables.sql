CREATE TABLE IF NOT EXISTS user (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    salt CHAR(22) NOT NULL,
    hash BINARY(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'product seller', 'user') DEFAULT 'user',
    confirmed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE KEY (username),
    UNIQUE KEY (email)
);
CREATE TABLE IF NOT EXISTS product (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    price DECIMAL(8 , 2 ) NOT NULL,
    date_of_withdrawal DATETIME,
    seller_name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (seller_name)
        REFERENCES user (username)
        ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS cart (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    date_of_insertion DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO user (name, surname, username, salt, hash, email, role, confirmed)
SELECT 'John', 'Doe', 'admin', 'QqjnpsFF-B0i-xzVq_sk0A', UNHEX('c9f67cd0e7e9d34a26b8648419a6808cf0da05ab143ea14fc12597cc9512752a1e4368b1ba65784ab1d0a48497cfb2da62ce7466a816cd7b6e497694e5ec8199'), 'sloukatos@tuc.gr', 'admin', 1;
