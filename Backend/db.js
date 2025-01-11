const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config()
console.log(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to:", mongoose.connection.db.databaseName);
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});


const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}

// async function seedDatabase() {
//     try {
//         await mongoose.connect(process.env.MONGO_URL, {
//             serverSelectionTimeoutMS: 15000,
//         });
//         console.log("Connected to MongoDB!");

//         // Add a user
//         const user = await userModel.create({
//             email: "user@example.com",
//             password: "password123",
//             firstName: "John",
//             lastName: "Doe",
//         });
//         console.log("User created:", user);

//         // Add an admin
//         const admin = await adminModel.create({
//             email: "admin@example.com",
//             password: "adminpassword",
//             firstName: "Admin",
//             lastName: "User",
//         });
//         console.log("Admin created:", admin);

//         // Add a course
//         const course = await courseModel.create({
//             title: "React Basics",
//             description: "Learn the basics of React.js",
//             price: 99,
//             imageUrl: "https://example.com/react-course.jpg",
//             creatorId: admin._id,
//         });
//         console.log("Course created:", course);

//         // Add a purchase
//         const purchase = await purchaseModel.create({
//             userId: user._id,
//             courseId: course._id,
//         });
//         console.log("Purchase created:", purchase);
//     } catch (err) {
//         console.error("Error seeding database:", err);
//     } finally {
//         mongoose.connection.close();
//         console.log("Connection closed.");
//     }
// }

// seedDatabase();