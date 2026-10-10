import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.js';
import User from '../models/User.js';

dotenv.config();

const tasks = [
  {
    title: "Sort Donations",
    description: "Help organize and sort incoming food donations for weekend distribution.",
    date: new Date('2025-03-15'),
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    location: "Downtown Community Center",
    address: "123 Main Street, Downtown",
    spots: { total: 8, filled: 5 },
    priority: "high",
    requirements: [
      "Ability to stand for extended periods",
      "Comfortable lifting up to 15 pounds",
      "Team player with positive attitude"
    ],
    whatToBring: [
      "Comfortable clothing",
      "Closed-toe shoes",
      "Water bottle"
    ],
    contact: "tasks@communityfoodshare.org",
    phone: "(555) 123-4567",
    category: "Food & Hunger"
  },
  {
    title: "Park Cleanup",
    description: "Join us for a community park cleanup event at Riverside Park.",
    date: new Date('2025-03-16'),
    time: "8:00 AM - 11:00 AM",
    duration: "3 hours",
    location: "Riverside Park",
    address: "456 Park Avenue",
    spots: { total: 15, filled: 12 },
    priority: "medium",
    requirements: [
      "Ability to work outdoors",
      "Comfortable with physical activity"
    ],
    whatToBring: [
      "Work gloves",
      "Water bottle",
      "Sun protection"
    ],
    contact: "volunteer@greencity.org",
    phone: "(555) 234-5678",
    category: "Environment"
  },
  {
    title: "Dog Walking",
    description: "Take rescue dogs for walks and help with socialization training.",
    date: new Date('2025-03-17'),
    time: "2:00 PM - 4:00 PM",
    duration: "2 hours",
    location: "Happy Paws Rescue",
    address: "789 Animal Way",
    spots: { total: 6, filled: 3 },
    priority: "low",
    requirements: [
      "Love for animals",
      "Ability to walk for extended periods"
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Water bottle"
    ],
    contact: "volunteer@happypaws.org",
    phone: "(555) 345-6789",
    category: "Animal Welfare"
  },
  {
    title: "Tutoring Session",
    description: "Provide homework help and academic support to middle school students.",
    date: new Date('2025-03-18'),
    time: "4:00 PM - 6:00 PM",
    duration: "2 hours",
    location: "Community Learning Center",
    address: "321 Education Street",
    spots: { total: 10, filled: 6 },
    priority: "medium",
    requirements: [
      "Patience and good communication skills",
      "Subject knowledge in math or English"
    ],
    whatToBring: [
      "Notebook",
      "Pen"
    ],
    contact: "volunteer@bigbrothers.org",
    phone: "(555) 456-7890",
    category: "Youth & Education"
  }
];

const seedTasks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volunteer-matcher');
    console.log('MongoDB Connected');

    // Find or create a test organization
    let organization = await User.findOne({ role: 'organization', email: 'org@test.com' });
    
    if (!organization) {
      // Create a test organization user
      organization = await User.create({
        fullName: 'Community Food Share',
        email: 'org@test.com',
        password: 'password123',
        role: 'organization'
      });
      console.log('Created test organization');
    }

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Create tasks with organization reference
    const createdTasks = await Task.insertMany(
      tasks.map(task => ({
        ...task,
        organization: organization._id,
        organizationName: organization.fullName
      }))
    );

    console.log(`Created ${createdTasks.length} tasks`);
    console.log('Tasks seeded successfully!');
    
    // Display created task IDs
    createdTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} - ID: ${task._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

seedTasks();

