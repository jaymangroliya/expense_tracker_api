import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function seedUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const users = [
            { name: 'Alice Johnson', role: 'admin' },
            { name: 'Bob Smith', role: 'employee' },
            { name: 'Catherine Lee', role: 'employee' },
            { name: 'Jeet Patel', role: 'employee' },
            { name: 'Ethan Martinez', role: 'employee' },
        ];

        for (const user of users) {
            const exists = await User.findOne({ name: user.name, role: user.role });
            if (!exists) {
                await User.create({ ...user, password: "12345" });
                console.log(`✅ Created: ${user.name} (${user.role})`);
            } else {
                console.log(`ℹ️ Already Exists: ${user.name}`);
            }
        }

        await mongoose.disconnect();
        console.log('Seeding users finished...');
    } catch (err) {
        console.error('Error seeding users:', err);
        mongoose.disconnect();
    }
}

seedUsers();