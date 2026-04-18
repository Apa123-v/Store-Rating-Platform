const pool = require('../config/db');

// GET ALL STORES
const getAllStores = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.id, s.name, s.email, s.address,
                ROUND(AVG(r.rating), 1) as average_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// CREATE STORE (Admin only)
const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        const newStore = await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, owner_id]
        );

        res.status(201).json({
            message: 'Store created successfully',
            store: newStore.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getAllStores, createStore };