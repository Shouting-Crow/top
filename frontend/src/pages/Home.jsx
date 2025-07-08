import Header from "../components/Header";
import Footer from "../components/Footer";
import MainBanner from "../components/MainBanner.jsx";
import ProjectOrStudyClick from "../components/ProjectOrStudyClick.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { CiFaceSmile } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

function Home() {
    const [popularProjects, setPopularProjects] = useState([]);
    const [popularStudyGroups, setPopularStudyGroups] = useState([]);
    const [popularBoards, setPopularBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPopularProjects();
        fetchPopularStudyGroups();
        fetchPopularBoards();
    }, []);

    const fetchPopularProjects = async () => {
        try {
            const res = await fetch(`/api/recruitments/popular`);
            if (res.ok) {
                const data = await res.json();
                setPopularProjects(data);
            } else {
                console.error("인기 프로젝트 공고 응답 오류");
            }
        } catch (error) {
            console.error("인기 프로젝트 공고 요청 서버 오류", error);
        }
    };

    const fetchPopularStudyGroups = async () => {
        try {
            const res = await fetch(`/api/study-groups/popular`);
            if (res.ok) {
                const data = await res.json();
                setPopularStudyGroups(data);
            } else {
                console.error("인기 스터디그룹 공고 응답 오류");
            }
        } catch (error) {
            console.error("인기 스터디그룹 공고 요청 서버 오류", error);
        }
    };

    const fetchPopularBoards = async () => {
        try {
            const res = await fetch(`/api/boards/popular`);
            if (res.ok) {
                const data = await res.json();
                setPopularBoards(data);
            } else {
                console.error("인기 게시글 응답 오류");
            }
        }  catch (error) {
            console.error("인기 게시글 요청 서버 오류", error);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full pt-[72px] pb-24">
                <MainBanner />
                <ProjectOrStudyClick />

                {/* 인기 프로젝트 공고 */}
                <section className="max-w-7xl mx-auto mt-16 px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">인기 프로젝트 모집 공고</h2>
                    {popularProjects.length > 0 ? (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
                            {popularProjects.map((post) => {
                                const dueDate = new Date(post.dueDate);
                                const today = new Date();
                                const dDay = Math.max(0, Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)));

                                return (
                                    <div
                                        key={post.id}
                                        className={`p-6 rounded-2xl shadow-md transition-all w-full h-full min-h-[220px] flex flex-col justify-between ${
                                            post.inactive
                                                ? "bg-gray-300 cursor-not-allowed opacity-70"
                                                : "bg-white hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                                        }`}
                                        onClick={() => navigate(`/recruitment/${post.id}`)}
                                    >
                                        {/* 닉네임 */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                            <CiFaceSmile className="h-4 w-4"/>
                                            <span className="font-medium">{post.creatorNickname}</span>
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-base font-semibold text-gray-900 mb-2 break-words line-clamp-2">{post.title}</h3>

                                        {/* 주제 */}
                                        <p className="text-sm text-gray-700 mb-3">{post.topic}</p>

                                        {/* 기술 태그 */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                                                >
                                                  #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-end mt-auto">
                                            {/* 마감일 */}
                                            <span className="text-xs text-gray-500">
                                                마감일 | {post.dueDate}
                                            </span>

                                            <div className="text-right">
                                                {/* 조회수 */}
                                                <div className="text-xs text-gray-500 flex items-center justify-end mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {post.views}
                                                </div>

                                                {/* D-Day */}
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                                        dDay <= 7 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                  D-{dDay}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-2">아직 인기 공고가 없습니다.</p>
                    )}
                </section>

                {/* 인기 스터디 그룹 공고 */}
                <section className="max-w-7xl mx-auto mt-16 px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">인기 스터디 그룹 모집 공고</h2>
                    {popularStudyGroups.length > 0 ? (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
                            {popularStudyGroups.map((study) => {
                                const dueDate = new Date(study.dueDate);
                                const today = new Date();
                                const dDay = Math.max(0, Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)));

                                return (
                                    <div
                                        key={study.id}
                                        className={`p-6 rounded-2xl shadow-md transition-all w-full h-full min-h-[220px] flex flex-col justify-between ${
                                            study.inactive
                                                ? "bg-gray-300 cursor-not-allowed opacity-70"
                                                : "bg-white hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                                        }`}
                                        onClick={() => navigate(`/study-group/${study.id}`)}
                                    >
                                        {/* 닉네임 */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                            <CiFaceSmile className="h-4 w-4"/>
                                            <span className="font-medium">{study.creatorNickname}</span>
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-base font-semibold text-gray-900 mb-2 break-words line-clamp-2">{study.title}</h3>

                                        {/* 주제 */}
                                        <p className="text-sm text-gray-700 mb-3">{study.topic}</p>

                                        {/* 스터디 기간 */}
                                        <div className="text-xs text-gray-600 mb-4">
                                            ⏳ {study.startDate} ~ {study.endDate}
                                        </div>

                                        <div className="flex justify-between items-end mt-auto">
                                            <span className="text-xs text-gray-500">
                                                마감일 | {study.dueDate}
                                            </span>

                                            <div className="text-right">
                                                {/* 조회수 */}
                                                <div className="text-xs text-gray-500 flex items-center justify-end mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {study.views}
                                                </div>

                                                {/* D-Day */}
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                                        dDay <= 7 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    D-{dDay}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-2">아직 인기 스터디 공고가 없습니다.</p>
                    )}
                </section>

                {/* 인기 게시글 */}
                <section className="max-w-7xl mx-auto mt-20 px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">인기 게시글</h2>
                        <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                            onClick={() => navigate("/boards")}
                        >
                            게시판 &rsaquo;
                        </button>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {popularBoards.filter(board => board.views > 0).map((board) => (
                            <li
                                key={board.boardId}
                                className="py-3 px-2 cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => navigate(`/boards/${board.boardId}`)}
                            >
                                <div className="flex justify-between items-center">
                                    {/* 작성자 */}
                                    <span className="text-sm text-gray-500 min-w-[90px]">{board.authorNickname}</span>

                                    {/* 제목 */}
                                    <span className="text-base font-semibold text-gray-900 flex-1 truncate px-4">{board.title}</span>

                                    <div className="flex items-center gap-4 min-w-[230px] justify-end text-sm text-gray-500">
                                        {/* 작성 시간 */}
                                        <span>{formatDistanceToNow(new Date(board.createdAt), { addSuffix: true, locale: ko })}</span>

                                        {/* 조회수 */}
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {board.views}
                                        </div>

                                        {/* 댓글 수 */}
                                        <span className="bg-gray-300 text-gray-800 text-xs font-bold px-2 py-1 rounded-full min-w-[28px] text-center">
                                            {board.replyCount}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;