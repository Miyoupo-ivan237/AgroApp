const { User } = require('./src/models/User');
const { sequelize } = require('./src/config/db');

async function makeAdmin(phone) {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        
        const user = await User.findOne({ where: { phone } });
        if (!user) {
            console.error(`User with phone ${phone} not found.`);
            process.exit(1);
        }
        
        user.role = 'ADMIN';
        user.is_verified = true;
        user.verification_status = 'APPROVED';
        await user.save();
        
        console.log(`Success! User ${user.full_name} (${phone}) is now a Super Admin.`);
        process.exit(0);
    } catch (err) {
        console.error('Error elevating user:', err);
        process.exit(1);
    }
}

const phoneArg = process.argv[2];
if (!phoneArg) {
    console.error('Please provide a phone number: node scripts/makeAdmin.js 6XXXXXXXX');
    process.exit(1);
}

makeAdmin(phoneArg);
