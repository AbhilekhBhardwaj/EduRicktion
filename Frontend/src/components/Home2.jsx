import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Home2 = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const history = useHistory();

  // Get the logged-in user from localStorage or use a context if applicable
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user data
      axios
        .get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => console.error("Failed to fetch user profile", err));
    }
  }, []);

  useEffect(() => {
    axios
      .get("/api/courses/preview")
      .then((response) => {
        setCourses(response.data.courses);
      })
      .catch((err) => console.error("Error fetching courses", err));
  }, []);

  const handlePurchase = (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/signin"); // Redirect to login page if the user is not logged in
      return;
    }

    axios
      .post(
        "/api/user/purchase",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        alert("Course purchased successfully");
      })
      .catch((err) => {
        alert(err.response.data.message || "Error purchasing course");
      });
  };

  return (
    <div className="home-container">
      <h1>Available Courses</h1>
      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="course-image"
              />
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              <button onClick={() => handlePurchase(course._id)}>
                Buy this Course
              </button>
            </div>
          ))
        ) : (
          <p>Loading courses...</p>
        )}
      </div>
    </div>
  );
};

export default Home2;
