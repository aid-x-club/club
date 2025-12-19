import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from './models/Achievement.js';
import Resource from './models/Resource.js';
import Announcement from './models/Announcement.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Achievement.deleteMany({});
        await Resource.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed Achievements
        const achievements = [
            {
                name: 'First Event',
                description: 'Attend your first event',
                icon: '🥉',
                category: 'participation',
                points: 10,
                requirement: { type: 'event_count', value: 1 }
            },
            {
                name: 'Event Enthusiast',
                description: 'Attend 5 events',
                icon: '🎯',
                category: 'participation',
                points: 25,
                requirement: { type: 'event_count', value: 5 }
            },
            {
                name: 'Event Master',
                description: 'Attend 10 events',
                icon: '🏅',
                category: 'participation',
                points: 50,
                requirement: { type: 'event_count', value: 10 }
            },
            {
                name: 'Project Pioneer',
                description: 'Submit your first project',
                icon: '💻',
                category: 'projects',
                points: 15,
                requirement: { type: 'project_count', value: 1 }
            },
            {
                name: 'Project Pro',
                description: 'Submit 5 projects',
                icon: '🚀',
                category: 'projects',
                points: 40,
                requirement: { type: 'project_count', value: 5 }
            },
            {
                name: 'Project Legend',
                description: 'Submit 10 projects',
                icon: '⭐',
                category: 'projects',
                points: 75,
                requirement: { type: 'project_count', value: 10 }
            },
            {
                name: 'Early Bird',
                description: 'Join the club in its first month',
                icon: '🐦',
                category: 'special',
                points: 20,
                requirement: { type: 'special', value: 1 }
            },
            {
                name: 'Active Member',
                description: 'Participate in club activities for 3 months',
                icon: '🔥',
                category: 'participation',
                points: 30,
                requirement: { type: 'special', value: 1 }
            },
            {
                name: 'Team Player',
                description: 'Collaborate on 3 projects',
                icon: '👥',
                category: 'projects',
                points: 35,
                requirement: { type: 'special', value: 1 }
            },
            {
                name: 'Workshop Warrior',
                description: 'Complete 5 workshops',
                icon: '📚',
                category: 'learning',
                points: 45,
                requirement: { type: 'special', value: 1 }
            }
        ];

        await Achievement.insertMany(achievements);
        console.log(`✅ Seeded ${achievements.length} achievements`);

        // Seed Resources
        const resources = [
            {
                title: 'Getting Started with React',
                description: 'Learn the basics of React.js and build your first component',
                category: 'web-dev',
                type: 'tutorial',
                url: 'https://react.dev/learn',
                icon: '📘',
                difficulty: 'beginner',
                tags: ['react', 'javascript', 'frontend']
            },
            {
                title: 'Python for Beginners',
                description: 'Complete Python programming tutorial for beginners',
                category: 'other',
                type: 'video',
                url: 'https://www.python.org/about/gettingstarted/',
                icon: '🎥',
                difficulty: 'beginner',
                tags: ['python', 'programming', 'basics']
            },
            {
                title: 'Git & GitHub Guide',
                description: 'Master version control with Git and GitHub',
                category: 'devops',
                type: 'documentation',
                url: 'https://docs.github.com/en/get-started',
                icon: '💡',
                difficulty: 'beginner',
                tags: ['git', 'github', 'version-control']
            },
            {
                title: 'Machine Learning Crash Course',
                description: 'Google\'s fast-paced introduction to machine learning',
                category: 'ai-ml',
                type: 'course',
                url: 'https://developers.google.com/machine-learning/crash-course',
                icon: '🤖',
                difficulty: 'intermediate',
                tags: ['machine-learning', 'ai', 'tensorflow']
            },
            {
                title: 'Node.js Best Practices',
                description: 'Comprehensive guide to Node.js best practices',
                category: 'web-dev',
                type: 'article',
                url: 'https://github.com/goldbergyoni/nodebestpractices',
                icon: '📗',
                difficulty: 'intermediate',
                tags: ['nodejs', 'backend', 'javascript']
            },
            {
                title: 'React Native Tutorial',
                description: 'Build mobile apps with React Native',
                category: 'mobile-dev',
                type: 'tutorial',
                url: 'https://reactnative.dev/docs/getting-started',
                icon: '📱',
                difficulty: 'intermediate',
                tags: ['react-native', 'mobile', 'ios', 'android']
            },
            {
                title: 'Data Science with Python',
                description: 'Learn data analysis and visualization with Python',
                category: 'data-science',
                type: 'course',
                url: 'https://www.kaggle.com/learn/python',
                icon: '📊',
                difficulty: 'intermediate',
                tags: ['python', 'data-science', 'pandas', 'numpy']
            },
            {
                title: 'Docker for Developers',
                description: 'Containerize your applications with Docker',
                category: 'devops',
                type: 'tutorial',
                url: 'https://docs.docker.com/get-started/',
                icon: '🐳',
                difficulty: 'intermediate',
                tags: ['docker', 'containers', 'devops']
            },
            {
                title: 'Advanced JavaScript Concepts',
                description: 'Deep dive into JavaScript closures, promises, and async/await',
                category: 'web-dev',
                type: 'article',
                url: 'https://javascript.info/',
                icon: '📙',
                difficulty: 'advanced',
                tags: ['javascript', 'advanced', 'async']
            },
            {
                title: 'TensorFlow Tutorials',
                description: 'Official TensorFlow tutorials for machine learning',
                category: 'ai-ml',
                type: 'tutorial',
                url: 'https://www.tensorflow.org/tutorials',
                icon: '🧠',
                difficulty: 'advanced',
                tags: ['tensorflow', 'deep-learning', 'neural-networks']
            }
        ];

        await Resource.insertMany(resources);
        console.log(`✅ Seeded ${resources.length} resources`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
