CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS used (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL,
    words_used      INT NOT NULL,
    created_at      DATE DEFAULT CURRENT_DATE
)