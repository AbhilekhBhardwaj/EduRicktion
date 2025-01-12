const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

// Purchase route
userRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const { courseId } = req.body;

    try {
        // Check if the course exists
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
        const purchase = new purchaseModel({
            userId,
            courseId,
        });

        await purchase.save();

        res.json({ message: "Course purchased successfully", purchase });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Purchases route - get all courses purchased by the user
userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    try {
        const purchases = await purchaseModel.find({ userId });

        let purchasedCourseIds = purchases.map(purchase => purchase.courseId);

        const coursesData = await courseModel.find({
            _id: { $in: purchasedCourseIds }
        });

        res.json({
            purchases,
            coursesData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = { userRouter };
