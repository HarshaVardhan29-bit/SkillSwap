import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Session from "./models/Session.js";

dotenv.config();

const randomNames = [
  "Alex Chen", "Maya Patel", "Jordan Smith", "Priya Kumar", "Chris Johnson",
  "Sophia Martinez", "Ryan Lee", "Emma Wilson", "Arjun Reddy", "Olivia Brown",
  "Ethan Davis", "Ava Garcia", "Noah Rodriguez", "Isabella Taylor", "Liam Anderson",
  "Mia Thomas", "Lucas Jackson", "Amelia White", "Mason Harris", "Charlotte Martin"
];

const sessions = [
  {
    title: "Master React Hooks in 60 Minutes",
    category: "Tech",
    description: "Deep dive into useState, useEffect, useContext, and custom hooks. Perfect for intermediate developers.",
    durationMinutes: 60,
    preferredTime: "Weekday evenings"
  },
  {
    title: "UI/UX Design Fundamentals",
    category: "Design",
    description: "Learn the principles of great design: color theory, typography, spacing, and user psychology.",
    durationMinutes: 90,
    preferredTime: "Weekend mornings"
  },
  {
    title: "Public Speaking & Presentation Skills",
    category: "Soft Skills",
    description: "Overcome stage fright and deliver compelling presentations that captivate your audience.",
    durationMinutes: 45,
    preferredTime: "Flexible"
  },
  {
    title: "Python for Data Science Beginners",
    category: "Tech",
    description: "Introduction to pandas, numpy, and matplotlib. Build your first data analysis project.",
    durationMinutes: 120,
    preferredTime: "Weekends"
  },
  {
    title: "Digital Illustration with Procreate",
    category: "Art",
    description: "Create stunning digital art on iPad. Learn brushes, layers, and professional techniques.",
    durationMinutes: 90,
    preferredTime: "Afternoons"
  },
  {
    title: "Spanish Conversation Practice",
    category: "Languages",
    description: "Improve your conversational Spanish through real-world scenarios and cultural insights.",
    durationMinutes: 60,
    preferredTime: "Evenings"
  },
  {
    title: "Node.js & Express API Development",
    category: "Tech",
    description: "Build RESTful APIs from scratch. Learn routing, middleware, authentication, and best practices.",
    durationMinutes: 90,
    preferredTime: "Weekday evenings"
  },
  {
    title: "Time Management & Productivity Hacks",
    category: "Soft Skills",
    description: "Master your schedule with proven techniques: Pomodoro, time blocking, and priority matrices.",
    durationMinutes: 45,
    preferredTime: "Lunch hours"
  },
  {
    title: "Watercolor Painting Basics",
    category: "Art",
    description: "Learn wet-on-wet, dry brush techniques, and color mixing. All skill levels welcome!",
    durationMinutes: 75,
    preferredTime: "Weekend afternoons"
  },
  {
    title: "Japanese for Anime Fans",
    category: "Languages",
    description: "Learn Japanese through your favorite anime. Understand common phrases and cultural context.",
    durationMinutes: 60,
    preferredTime: "Evenings"
  },
  {
    title: "Docker & Kubernetes Essentials",
    category: "Tech",
    description: "Containerize your apps and deploy to production. Hands-on with real-world examples.",
    durationMinutes: 120,
    preferredTime: "Weekends"
  },
  {
    title: "Leadership & Team Management",
    category: "Soft Skills",
    description: "Develop leadership skills: delegation, conflict resolution, and motivating your team.",
    durationMinutes: 60,
    preferredTime: "Mornings"
  },
  {
    title: "Figma for Web Designers",
    category: "Design",
    description: "Master Figma's tools: components, auto-layout, prototyping, and design systems.",
    durationMinutes: 90,
    preferredTime: "Flexible"
  },
  {
    title: "Guitar Basics for Beginners",
    category: "Art",
    description: "Learn chords, strumming patterns, and play your first songs. No experience needed!",
    durationMinutes: 60,
    preferredTime: "Evenings"
  },
  {
    title: "French Pronunciation Masterclass",
    category: "Languages",
    description: "Perfect your French accent. Focus on difficult sounds and natural rhythm.",
    durationMinutes: 45,
    preferredTime: "Mornings"
  },
  {
    title: "Machine Learning with TensorFlow",
    category: "Tech",
    description: "Build neural networks and train ML models. Prerequisites: Python basics.",
    durationMinutes: 120,
    preferredTime: "Weekends"
  },
  {
    title: "Negotiation Skills for Career Growth",
    category: "Soft Skills",
    description: "Learn to negotiate salary, contracts, and deals with confidence and strategy.",
    durationMinutes: 60,
    preferredTime: "Lunch hours"
  },
  {
    title: "Mobile App Design Patterns",
    category: "Design",
    description: "iOS and Android design guidelines, navigation patterns, and mobile-first thinking.",
    durationMinutes: 75,
    preferredTime: "Afternoons"
  },
  {
    title: "Photography Composition & Lighting",
    category: "Art",
    description: "Take better photos with your phone or camera. Learn the rule of thirds and lighting tricks.",
    durationMinutes: 90,
    preferredTime: "Weekend mornings"
  },
  {
    title: "German Grammar Simplified",
    category: "Languages",
    description: "Tackle German cases, articles, and verb conjugations with easy-to-remember methods.",
    durationMinutes: 60,
    preferredTime: "Evenings"
  }
];

const seedSessions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Create random users if needed
    let users = await User.find();
    
    if (users.length < randomNames.length) {
      console.log("Creating random mentor users...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      const usersToCreate = randomNames.map(name => ({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@skillswap.com`,
        password: hashedPassword,
        bio: `Passionate mentor helping others learn and grow.`,
        skills: []
      }));

      await User.insertMany(usersToCreate);
      users = await User.find();
      console.log(`Created ${usersToCreate.length} mentor users`);
    }

    // Clear existing sessions
    await Session.deleteMany({});
    console.log("Cleared existing sessions");

    // Create sessions with random mentors
    const sessionsToCreate = sessions.map(session => ({
      ...session,
      mentor: users[Math.floor(Math.random() * users.length)]._id,
      isActive: true
    }));

    await Session.insertMany(sessionsToCreate);
    console.log(`✅ Successfully added ${sessionsToCreate.length} sessions!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding sessions:", error);
    process.exit(1);
  }
};

seedSessions();
