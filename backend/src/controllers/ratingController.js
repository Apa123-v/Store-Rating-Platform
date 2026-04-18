const pool = require('../config/db');

// SUBMIT RATING
const submitRating = async (req, res) => {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    try {
        const existing = await pool.query(
            'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
            [user_id, store_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'You already rated this store. Use update instead.' });
        }

        const newRating = await pool.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
            [user_id, store_id, rating]
        );

        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: newRating.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// UPDATE RATING
const updateRating = async (req, res) => {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3 RETURNING *',
            [rating, user_id, store_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.json({
            message: 'Rating updated successfully',
            rating: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET STORE RATINGS (Store Owner)
const getStoreRatings = async (req, res) => {
    const { storeId } = req.params;

    try {
        const result = await pool.query(`
            SELECT u.name, u.email, r.rating, r.created_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC
        `, [storeId]);

        const avgResult = await pool.query(
            'SELECT ROUND(AVG(rating), 1) as average FROM ratings WHERE store_id = $1',
            [storeId]
        );

        res.json({
            ratings: result.rows,
            average: avgResult.rows[0].average
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { submitRating, updateRating, getStoreRatings };