import React from "react";

const PurchasedCourse = ({ courses }) => {
    return (
        <div>
            <h2>Your Purchased Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map((course) => (
                        <li key={course._id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <p>Price: ${course.price}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't purchased any courses yet.</p>
            )}
        </div>
    );
};

export default PurchasedCourse;
