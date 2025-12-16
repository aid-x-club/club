import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    studentId: String,
    password: String,
    role: String,
    profileImage: String,
    year: String,
    emailVerified: Boolean,
    createdAt: Date,
    lastLogin: Date,
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aidx-club', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Update user to admin
const updateToAdmin = async () => {
    try {
        await connectDB();

        // Find and update the user
        const user = await User.findOneAndUpdate(
            { email: 'shubhamvasantgundu@gmail.com' },
            {
                role: 'admin',
                emailVerified: true,
            },
            { new: true }
        );

        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }

        console.log('✅ User updated to admin successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', user.email);
        console.log('🆔 Student ID:', user.studentId);
        console.log('👤 Name:', user.fullName);
        console.log('🔑 Role:', user.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🎉 You can now login with:');
        console.log('   Email: shubhamvasantgundu@gmail.com');
        console.log('   Password: (your existing password)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        process.exit(1);
    }
};

// Run the script
updateToAdmin();
