DROP TABLE IF EXISTS visitlist ;
 CREATE TABLE IF NOT EXISTS visitlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
   city VARCHAR(255),
    image VARCHAR(255),
    overview VARCHAR(2000),
    feedback VARCHAR(255)

);











