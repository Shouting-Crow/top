import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyInfo from "./pages/MyInfo.jsx";
import MyInfoEdit from "./pages/MyInfoEdit.jsx";
import Header from "./components/Header.jsx";
import MyApplicationInfo from "./pages/MyApplicationInfo.jsx";
import ApplicationRegister from "./pages/ApplicationInfoRegister.jsx";
import ApplicationInfoRegister from "./pages/ApplicationInfoRegister.jsx";
import ApplicationInfoEdit from "./pages/ApplicationInfoEdit.jsx";
import Recruitments from "./pages/Recruitments.jsx";

const Layout = ({ children }) => {
    const location = useLocation();

    const showHeaderPages = ["/", "/myinfo", "/myinfo/edit", "/application-info",
        "/application-info/register", "/application-info/edit", "/recruitments"];

    return (
        <div>
            {showHeaderPages.includes(location.pathname) && <Header />}
            {children}
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                    <Route path="/myinfo" element={<MyInfo />}/>
                    <Route path="/myinfo/edit" element={<MyInfoEdit />}/>
                    <Route path="/application-info" element={<MyApplicationInfo />}/>
                    <Route path="/application-info/register" element={<ApplicationInfoRegister />}/>
                    <Route path="/application-info/edit" element={<ApplicationInfoEdit />}/>
                    <Route path="/recruitments" element={<Recruitments />}/>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
