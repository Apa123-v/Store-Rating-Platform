const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET ALL USERS (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, address, role FROM users ORDER BY name ASC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// CREATE USER (Admin only)
const createUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: newUser.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET USER BY ID (Admin only)
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT id, name, email, address, role FROM users WHERE id = $1', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// UPDATE PASSWORD (Any logged in user)
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1', [userId]
        );

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// GET STATS (Admin only)
const getStats = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role != 'admin'"
    )
    const stores = await pool.query('SELECT COUNT(*) FROM stores')
    const ratings = await pool.query('SELECT COUNT(*) FROM ratings')

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStores: parseInt(stores.rows[0].count),
      totalRatings: parseInt(ratings.rows[0].count)
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
};

module.exports = { 
  getAllUsers, 
  createUser, 
  getUserById, 
  updatePassword,
  getStats
}