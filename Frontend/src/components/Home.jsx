import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const HomePage = () => {
  const [courses, setCourses] = useState([]); // State to hold course data
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch courses and student data from the backend
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/course/preview"); // API to fetch courses
        const coursesData = response.data.courses;

        // Fetch student counts for each course
        const coursesWithStudents = await Promise.all(
          coursesData.map(async (course) => {
            const studentResponse = await axios.get(
              `http://localhost:3000/api/v1/course/course-users/${course._id}`
            );
            return {
              ...course,
              students: studentResponse.data.users.length, // Count of users who purchased the course
            };
          })
        );

        setCourses(coursesWithStudents);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">
      <header>
        <nav>
          <div className="logo">EduRicktion</div>
          <ul className="nav-links">
            <li><a href="#courses">Courses</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/login" className="navbar-link">Login</Link></li>
            <li><Link to="/signup" className="navbar-link">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Master New Skills</h1>
          <p>Join our platform and learn from industry experts</p>
        </section>

        <section id="courses" className="featured-courses">
          <h2>Featured Courses</h2>
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="course-card"
                  onMouseEnter={() => setHoveredCourse(course._id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <h3>{course.title}</h3>
                  <p className="price">{course.price}</p>
                  <p className="students">
                    {hoveredCourse === course._id
                      ? `${course.students} students`
                      : "Hover for details"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="cta-section">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students and start your learning journey today!</p>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 EduRicktion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
