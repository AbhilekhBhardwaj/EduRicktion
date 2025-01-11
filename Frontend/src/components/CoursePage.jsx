import React, { useEffect, useState } from "react";
import axios from "axios";
import PurchasedCourse from "./PurchasedCourse";

const CoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCourses();
        fetchPurchasedCourses();
    }, []);

    // Fetch all available courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/course/preview");
            setCourses(response.data.courses);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching courses");
        }
    };

    // Fetch all courses purchased by the user
    const fetchPurchasedCourses = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://localhost:3000/api/v1/user/purchases", {
                headers: { token },
            });
            setPurchasedCourses(response.data.coursesData);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching purchased courses");
        }
    };

    // Handle course purchase
    const handlePurchase = async (courseId) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/purchase",
                { courseId },
                { headers: { token } }
            );

            // Add the purchased course to the state
            const purchasedCourse = response.data.purchase.courseId;
            const purchasedCourseDetails = courses.find((course) => course._id === purchasedCourse);

            if (purchasedCourseDetails) {
                setPurchasedCourses((prev) => [...prev, purchasedCourseDetails]);
            }

            alert(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Error purchasing course");
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Available Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map((course) => (
                        <li key={course._id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <p>Price: ${course.price}</p>
                            <button onClick={() => handlePurchase(course._id)}>Buy Now</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses available.</p>
            )}

            {/* Render PurchasedCourse component */}
            <PurchasedCourse courses={purchasedCourses} />
        </div>
    );
};

export default CoursePage;
