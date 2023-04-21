/** Common config for bookstore. */


let DB_URI = `postgresql://`;

// process.env.NODE_ENV === "test";

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/bookstoredb_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/bookstoredb`;
}


module.exports = { DB_URI };