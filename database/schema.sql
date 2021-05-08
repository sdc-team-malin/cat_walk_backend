
CREATE TABLE photos (
  id INT PRIMARY KEY,
  review_id INT,
  url VARCHAR,
);


CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  rating VARCHAR,
  date VARCHAR,
  summary VARCHAR,
  body VARCHAR,
  recommend VARCHAR,
  reported VARCHAR,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness INT
);
id,product_id, name

CREATE TABLE characteristics (
  id INT PRIMARY KEY,
  product_id INT,
  name VARCHAR
  );
id,characteristic_id,review_id,value

CREATE TABLE char_reviews (
  id INT PRIMARY KEY,
  characteristic_id INT,
  review_id INT,
  value INT
  );
/Users/codygonzalez/Desktop/Hack Reactor/sdc/csv/characteristic_reviews.csv
COPY char_reviews FROM 'csv/characteristic_reviews.csv' WITH (FORMAT csv);