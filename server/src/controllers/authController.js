const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { full_name, phone: phone_raw, password, role } = req.body;
        
        // Normalize phone number (keep digits only) to support international numbers
        let phone = String(phone_raw).replace(/\D/g, '');

        console.log('[DEBUG] Registering user:', { full_name, phone, role });

        // Check user exists
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            console.log('[DEBUG] Phone number already registered:', phone);
            return res.status(400).json({ error: 'This phone number is already registered. Please Login instead.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            full_name,
            phone,
            password_hash,
            role: role || 'BUYER'
        });

        console.log('[DEBUG] User registered successfully:', newUser.id);
        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
        console.error('[DEBUG] Registration error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone: phone_raw, password } = req.body;
        
        // Normalize phone number (keep digits only)
        let phone = String(phone_raw).replace(/\D/g, '');

        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.full_name }, 
            process.env.JWT_SECRET || 'agroconnect_super_secret', 
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Logged in',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { phone: phone_raw, new_password } = req.body;
        if (!new_password || new_password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }
        
        // Normalize phone number (keep digits only)
        let phone = String(phone_raw).replace(/\D/g, '');

        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ error: 'User not found with this phone number.' });

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
