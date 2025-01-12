const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel, userModel } = require("../db");
const mongoose = require("mongoose");
const courseRouter = Router();

// Route for purchasing a course
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    try {
        // Validate that the course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user has already purchased the course
        const existingPurchase = await purchaseModel.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ message: "You have already purchased this course" });
        }

        // Create a new purchase record
        await purchaseModel.create({ userId, courseId });

        res.json({ message: "You have successfully bought the course" });
    } catch (err) {
        console.error("Error purchasing course:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Route for fetching all available courses
courseRouter.get("/preview", async function (req, res) {
    try {
        const courses = await courseModel.find({});
        res.json({ courses });
    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Route for fetching users who purchased a specific course
courseRouter.get("/course-users/:courseId", async function (req, res) {
    const { courseId } = req.params;

    try {
        const purchases = await purchaseModel.find({ courseId });
        if (!purchases.length) {
            return res.status(404).json({ message: "No users found for this course." });
        }

        const userIds = purchases.map((purchase) => purchase.userId);
        const users = await userModel.find({ _id: { $in: userIds } }, "firstName lastName email");

        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = { courseRouter };
