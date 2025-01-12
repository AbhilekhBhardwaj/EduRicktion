import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home2 from "./components/Home2";
import PurchasedCourses from "./components/PurchasedCourse"; // Import PurchasedCourses

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home2" element={<Home2 />} />
                <Route path="/purchased-courses" element={<PurchasedCourses />} />
            </Routes>
        </Router>
    );
}

export default App;
