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
import RecruitmentRegister from "./pages/RecruitmentRegister.jsx";
import Recruitment from "./pages/Recruitment.jsx";
import RecruitmentEdit from "./pages/RecruitmentEdit.jsx";
import StudyGroups from "./pages/StudyGroups.jsx";
import StudyGroupRegister from "./pages/StudyGroupRegister.jsx";
import StudyGroup from "./pages/StudyGroup.jsx";
import StudyGroupEdit from "./pages/StudyGroupEdit.jsx";
import MyApplicationList from "./pages/MyApplicationList.jsx";
import MyBasePostList from "./pages/MyBasePostList.jsx";
import ApplicantList from "./pages/ApplicantList.jsx";
import Group from "./pages/Group.jsx";
import GroupMembers from "./pages/GroupMembers.jsx";

const Layout = ({ children }) => {
    const location = useLocation();

    const showHeaderPages = [
        "/",
        "/myinfo",
        "/myinfo/edit",

        "/application-info",
        "/application-info/register",
        "/application-info/edit",

        "/recruitments",
        "/recruitment/register",

        "/study-groups",
        "/study-group/register",

        "/my-applications",

        "/my-posts"
    ];

    const shouldShowHeader = showHeaderPages.includes(location.pathname) ||
        location.pathname.startsWith("/recruitment/") ||
        location.pathname.startsWith("/study-group/") ||
        location.pathname.startsWith("/applicants/") ||
        location.pathname.startsWith("/groups/");

    return (
        <div>
            {shouldShowHeader && <Header />}
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
                    <Route path="/recruitment/register" element={<RecruitmentRegister />}/>
                    <Route path="/recruitment/:recruitmentId" element={<Recruitment />}/>
                    <Route path="/recruitment/edit/:recruitmentId" element={<RecruitmentEdit />}/>

                    <Route path="/study-groups" element={<StudyGroups />}/>
                    <Route path="/study-group/register" element={<StudyGroupRegister />}/>
                    <Route path="/study-group/:studyGroupId" element={<StudyGroup />}/>
                    <Route path="/study-group/edit/:studyGroupId" element={<StudyGroupEdit />}/>

                    <Route path="/my-applications" element={<MyApplicationList />}/>

                    <Route path="/my-posts" element={<MyBasePostList/>}/>

                    <Route path="/applicants/:basePostId" element={<ApplicantList/>}/>

                    <Route path="/groups/:groupId" element={<Group />}/>
                    <Route path="/groups/:groupId/members" element={<GroupMembers />}/>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
