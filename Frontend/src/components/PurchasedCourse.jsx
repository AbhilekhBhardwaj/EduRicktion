import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchasedCourse = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view your purchased courses.");
      return;
    }

    axios
      .get("/api/user/purchases", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPurchasedCourses(response.data.coursesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching purchased courses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="purchased-courses-container">
      <h1>Your Purchased Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : purchasedCourses.length > 0 ? (
        purchasedCourses.map((course) => (
          <div key={course._id} className="course-card">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="course-image"
            />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Price: ${course.price}</p>
          </div>
        ))
      ) : (
        <p>You haven't purchased any courses yet.</p>
      )}
    </div>
  );
};

export default PurchasedCourse;
