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

// Create test users
const createTestUsers = async () => {
    try {
        await connectDB();

        const testUsers = [
            {
                fullName: 'Test Coordinator',
                email: 'coordinator@test.com',
                studentId: 'COORD001',
                password: 'test123',
                role: 'coordinator',
                year: '4th',
                emailVerified: true,
            },
            {
                fullName: 'Test Student',
                email: 'student@test.com',
                studentId: 'STUDENT001',
                password: 'test123',
                role: 'student',
                year: '2nd',
                emailVerified: true,
            }
        ];

        console.log('\n🔄 Creating test users...\n');

        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`⚠️  User already exists: ${userData.email}`);
                console.log(`   Role: ${existingUser.role}`);
                console.log(`   Student ID: ${existingUser.studentId}\n`);
                continue;
            }

            // Create new user
            const user = await User.create(userData);

            console.log(`✅ Created ${userData.role} account:`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Password: test123`);
            console.log(`   Student ID: ${user.studentId}`);
            console.log(`   Role: ${user.role}\n`);
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Test Accounts Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n👨‍💼 COORDINATOR ACCOUNT:');
        console.log('   Email: coordinator@test.com');
        console.log('   Password: test123');
        console.log('   Role: coordinator');
        console.log('\n👨‍🎓 STUDENT ACCOUNT:');
        console.log('   Email: student@test.com');
        console.log('   Password: test123');
        console.log('   Role: student');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error);
        process.exit(1);
    }
};

// Run the script
createTestUsers();
