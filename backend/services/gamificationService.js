import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
import { v4 as uuidv4 } from "uuid";

// Points system
const POINTS = {
  HOST_SESSION: 20,
  ATTEND_SESSION: 10,
  HIGH_RATING_BONUS: 15, // For 4+ rating
  MILESTONE_BONUS: 50, // For completing 5 sessions
};

// Badge definitions
const BADGES = {
  RISING_MENTOR: "Rising Mentor",
  KNOWLEDGE_SHARER: "Knowledge Sharer", 
  TOP_CONTRIBUTOR: "Top Contributor",
  CAMPUS_MENTOR: "Campus Mentor",
  ACTIVE_LEARNER: "Active Learner",
};

export const awardPoints = async (userId, pointType, additionalData = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let pointsToAdd = 0;
    let updateFields = {};

    switch (pointType) {
      case 'HOST_SESSION':
        pointsToAdd = POINTS.HOST_SESSION;
        updateFields.sessionsHosted = user.sessionsHosted + 1;
        break;
      case 'ATTEND_SESSION':
        pointsToAdd = POINTS.ATTEND_SESSION;
        updateFields.sessionsAttended = user.sessionsAttended + 1;
        break;
      case 'HIGH_RATING':
        pointsToAdd = POINTS.HIGH_RATING_BONUS;
        break;
      case 'MILESTONE':
        pointsToAdd = POINTS.MILESTONE_BONUS;
        break;
    }

    // Update user points
    updateFields.points = user.points + pointsToAdd;

    await User.findByIdAndUpdate(userId, updateFields);

    // Check for new badges
    await checkAndAwardBadges(userId);

    // Check for certificate eligibility
    await checkCertificateEligibility(userId, pointType, additionalData);

    return pointsToAdd;
  } catch (error) {
    console.error("Error awarding points:", error);
  }
};

export const updateRating = async (userId, newRating) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const totalRatings = user.totalRatings + 1;
    const currentTotal = user.averageRating * user.totalRatings;
    const newAverage = (currentTotal + newRating) / totalRatings;

    await User.findByIdAndUpdate(userId, {
      averageRating: Math.round(newAverage * 10) / 10, // Round to 1 decimal
      totalRatings: totalRatings
    });

    // Award bonus points for high rating
    if (newRating >= 4) {
      await awardPoints(userId, 'HIGH_RATING');
    }

    // Check for rating-based badges
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const newBadges = [];

    // Rising Mentor - 3 sessions hosted
    if (user.sessionsHosted >= 3 && !user.badges.includes(BADGES.RISING_MENTOR)) {
      newBadges.push(BADGES.RISING_MENTOR);
    }

    // Knowledge Sharer - 10 sessions hosted
    if (user.sessionsHosted >= 10 && !user.badges.includes(BADGES.KNOWLEDGE_SHARER)) {
      newBadges.push(BADGES.KNOWLEDGE_SHARER);
    }

    // Top Contributor - 200+ points
    if (user.points >= 200 && !user.badges.includes(BADGES.TOP_CONTRIBUTOR)) {
      newBadges.push(BADGES.TOP_CONTRIBUTOR);
    }

    // Campus Mentor - 4.5+ average rating with at least 5 ratings
    if (user.averageRating >= 4.5 && user.totalRatings >= 5 && !user.badges.includes(BADGES.CAMPUS_MENTOR)) {
      newBadges.push(BADGES.CAMPUS_MENTOR);
    }

    // Active Learner - 5 sessions attended
    if (user.sessionsAttended >= 5 && !user.badges.includes(BADGES.ACTIVE_LEARNER)) {
      newBadges.push(BADGES.ACTIVE_LEARNER);
    }

    if (newBadges.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { badges: { $each: newBadges } }
      });
    }

    return newBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
  }
};

export const checkCertificateEligibility = async (userId, eventType, additionalData) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const certificates = [];

    // Certificate for hosting a session
    if (eventType === 'HOST_SESSION' && additionalData.sessionId) {
      certificates.push({
        type: "session_hosted",
        title: "Session Mentor Certificate",
        description: `Successfully hosted a learning session on ${additionalData.skillName}`,
        skillName: additionalData.skillName,
        sessionId: additionalData.sessionId
      });
    }

    // Certificate for completing 3 sessions as student
    if (user.sessionsAttended === 3) {
      certificates.push({
        type: "milestone_achievement",
        title: "Active Learner Certificate",
        description: "Completed 3 learning sessions as an engaged student",
        skillName: "Continuous Learning"
      });
    }

    // Certificate for mentoring milestone
    if (user.sessionsHosted === 5) {
      certificates.push({
        type: "milestone_achievement", 
        title: "Peer Mentor Certificate",
        description: "Successfully mentored students in 5 learning sessions",
        skillName: "Peer Mentoring"
      });
    }

    // Generate certificates
    for (const certData of certificates) {
      await generateCertificate(userId, certData);
    }

  } catch (error) {
    console.error("Error checking certificate eligibility:", error);
  }
};

export const generateCertificate = async (userId, certificateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const certificateId = `CERT-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    const certificate = await Certificate.create({
      userId,
      certificateId,
      type: certificateData.type,
      title: certificateData.title,
      description: certificateData.description,
      skillName: certificateData.skillName,
      sessionId: certificateData.sessionId || null,
    });

    return certificate;
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
};