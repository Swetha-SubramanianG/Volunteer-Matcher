const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Organization = require("./models/Organization");
const Task = require("./models/Task");
const Application = require("./models/Application");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");

    await User.deleteMany({});
    await Organization.deleteMany({});
    await Task.deleteMany({});
    await Application.deleteMany({});
    console.log("Old data cleared.");

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("test123", salt);

    // Create organizations
    const org1 = await Organization.create({
      name: "Happy Paws Rescue",
      email: "happypaws@example.com",
      passwordHash: hashedPassword,
      approved: true
    });

    const org2 = await Organization.create({
      name: "Community Food Share",
      email: "foodshare@example.com",
      passwordHash: hashedPassword,
      approved: true
    });
    console.log("Organizations created.");

    // Create users
    const user1 = await User.create({
      fullName: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "volunteer"
    });

    const user2 = await User.create({
      fullName: "Sarah Lee",
      email: "sarah@example.com",
      password: hashedPassword,
      role: "volunteer"
    });
    console.log("Users created.");

    // Create tasks
    const task1 = await Task.create({
      title: "Tutoring Session",
      description: "Provide homework help and academic support to middle school students.",
      category: "Youth & Education",
      location: "Community Learning Center",
      organizationName: "Community Food Share",
      volunteersNeeded: 3
    });

    const task2 = await Task.create({
      title: "Park Cleanup",
      description: "Join us for a community park cleanup event at Riverside Park.",
      category: "Environment",
      location: "Riverside Park",
      organizationName: "Community Food Share",
      volunteersNeeded: 10
    });

    const task3 = await Task.create({
      title: "Dog Walking",
      description: "Take rescue dogs for walks and help with socialization training.",
      category: "Animal Welfare",
      location: "West Side",
      organizationName: "Happy Paws Rescue",
      volunteersNeeded: 5
    });

    console.log("Tasks created.");
    console.log("🎉 Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

seed();
