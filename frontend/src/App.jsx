import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Login from "./pages/Login.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
        </Router>
    );
}

export default App;
