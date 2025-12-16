import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'coordinator', 'admin'],
        default: 'student',
    },
    profileImage: String,
    year: String,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: Date,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
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

// Create admin user
const createAdminUser = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'shubhamvasantgundu@gmail.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Student ID:', existingAdmin.studentId);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            fullName: 'Shubham Gundu',
            email: 'shubhamvasantgundu@gmail.com',
            studentId: 'ADMIN001',
            password: 'shubsss.dev', // Will be hashed by pre-save hook
            role: 'admin',
            year: 'Admin',
            emailVerified: true,
            profileImage: '/images/s/club_logo.png',
            createdAt: new Date(),
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', adminUser.email);
        console.log('🆔 Student ID:', adminUser.studentId);
        console.log('👤 Name:', adminUser.fullName);
        console.log('🔑 Role:', adminUser.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🎉 You can now login with:');
        console.log('   Email: shubhamvasantgundu@gmail.com');
        console.log('   Password: shubsss.dev');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

// Run the script
createAdminUser();
