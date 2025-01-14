const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

// Signup route
userRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create the new user with plain password (Not recommended for production)
        const newUser = await userModel.create({
            email: email,
            password: password,  // Save plain text password directly
            firstName: firstName,
            lastName: lastName
        });
        console.log(password, "password")
        // Respond with success message
        res.json({
            message: "Signup succeeded",
            userId: newUser._id, // Return the user ID
            password : newUser.password
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Signin route
userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }
        // Check if the password matches (using plain text password comparison)
        if (user.password === password) {  // Note: In a production system, always hash passwords!
            const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
            res.json({ token });
        } else {
            return res.status(403).json({ message: "Incorrect password" });
        }
    } catch (err) {
        console.error("Error during signin:", err);  // Log detailed error
        res.status(500).json({ message: "Server error" });
    }
});

userRouter.get("/profile", async (req, res) => {
    const { email } = req.query;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

// Get user by email
userRouter.post("/getUserByEmail", async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with the firstName
        res.json({ firstName: user.firstName });
    } catch (err) {
        console.error("Error fetching user by email:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// Purchase route
userRouter.post("/purchase", async (req, res) => {
    const { email, courseId } = req.body;
  
    try {
      // Validate email and courseId
      if (!email || !courseId) {
        return res.status(400).json({ message: "Email and Course ID are required" });
      }
  
      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the course exists
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Check if the user has already purchased the course
      const existingPurchase = await purchaseModel.findOne({ userId: user._id, courseId });
      if (existingPurchase) {
        return res.status(400).json({ message: "You have already purchased this course" });
      }
  
      // Create a new purchase record
      const purchase = await purchaseModel.create({
        userId: user._id,
        courseId,
      });
  
      res.json({ message: "Course purchased successfully", purchase });
    } catch (err) {
      console.error("Error processing purchase:", err);
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
