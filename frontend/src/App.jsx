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
import MyGroups from "./pages/MyGroups.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import ChatProvider from "./context/ChatProvider.jsx";
import MyMessages from "./pages/MyMessages.jsx";
import MessageProvider from "./context/MessageProvider.jsx";
import BoardList from "./pages/BoardList.jsx";
import BoardRegister from "./pages/BoardRegister.jsx";
import Board from "./pages/Board.jsx";
import BoardEdit from "./pages/BoardEdit.jsx";
import FoundLoginIds from "./pages/FoundLoginIds.jsx";
import FindLoginIds from "./pages/FindLoginIds.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

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

        "/my-posts",

        "/my-groups",

        "/messages",

        "/boards"
    ];

    const shouldShowHeader = showHeaderPages.includes(location.pathname) ||
        location.pathname.startsWith("/recruitment/") ||
        location.pathname.startsWith("/study-group/") ||
        location.pathname.startsWith("/applicants/") ||
        location.pathname.startsWith("/groups/") ||
        location.pathname.startsWith("/boards/");

    return (
        <div>
            {shouldShowHeader && <Header />}
            {children}
        </div>
    );
};

function App() {
    return (
        <MessageProvider>
        <ChatProvider>
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

                        <Route path="/my-groups" element={<MyGroups />}/>

                        <Route path="/chat/:chatRoomId" element={<ChatRoom />}/>

                        <Route path="/messages" element={<MyMessages />}/>

                        <Route path="/boards" element={<BoardList />}/>
                        <Route path="/boards/register" element={<BoardRegister />}/>
                        <Route path="/boards/:boardId" element={<Board />}/>
                        <Route path="/boards/edit/:boardId" element={<BoardEdit />}/>

                        <Route path="/find/login-ids" element={<FindLoginIds />}/>
                        <Route path="/find/login-ids-result" element={<FoundLoginIds />}/>

                        <Route path="/find/password" element={<FindPassword />}/>
                        <Route path="/change-password" element={<ChangePassword />}/>
                    </Routes>
                </Layout>
            </Router>
        </ChatProvider>
        </MessageProvider>
    );
}

export default App;
