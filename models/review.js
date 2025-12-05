const db = require("../config/db");

class Review {
  static async addReview(data) {
    const { product_id, user_name, rating, comment } = data;
    const sql = `INSERT INTO Reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)`;
    try {
      const [result] = await db.execute(sql, [
        product_id,
        user_name,
        rating,
        comment,
      ]);
      return result;
    } catch (err) {
      throw new Error("Error adding review: " + err.message);
    }
  }

  static async getReviewsByProduct(product_id) {
    const sql = `SELECT * FROM Reviews WHERE product_id = ? ORDER BY created_at DESC`;
    try {
      const [rows] = await db.execute(sql, [product_id]);
      return rows;
    } catch (err) {
      throw new Error("Error fetching reviews: " + err.message);
    }
  }
}

module.exports = Review;
