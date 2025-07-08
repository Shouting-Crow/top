import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReplyModal from "../components/ReplyModal";
import { FiSettings } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import {FaArrowLeft} from "react-icons/fa";

const StudyGroup = () => {
    const { studyGroupId } = useParams();
    const [studyGroup, setStudyGroup] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudyGroup();
        increaseView();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const increaseView = async () => {
        const key = `viewed-study-group-${studyGroupId}`;
        if (localStorage.getItem(key)) return;
        try {
            await fetch(`/api/base-posts/${studyGroupId}/view`, { method: "POST" });
            localStorage.setItem(key, "true");
        } catch (err) {
            console.error("조회수 증가 실패", err);
        }
    };

    const fetchStudyGroup = async () => {
        try {
            const response = await fetch(`/api/study-groups/${studyGroupId}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            setStudyGroup(data);
            setIsCreator(localStorage.getItem("nickname") === data.creatorNickname);
        } catch {
            alert("공고 정보를 불러오는 데 실패했습니다.");
            navigate("/study-groups");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 공고를 삭제하시겠습니까?")) return;
        try {
            const token = localStorage.getItem("jwtToken");
            await fetch(`/api/study-groups/${studyGroupId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("삭제되었습니다.");
            navigate("/study-groups");
        } catch {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    const handleClose = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            const res = await fetch(`/api/study-groups/${studyGroupId}/close`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                alert("공고가 마감되었습니다.");
                navigate("/study-groups");
            } else {
                alert("마감 권한이 없거나 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessageClick = (recipient) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        setRecipient(recipient);
        setIsReplyModalOpen(true);
    };

    const sendReplyMessage = async (content) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ receiverName: recipient, content })
            });
            if (res.ok) {
                alert("쪽지가 전송되었습니다.");
                setIsReplyModalOpen(false);
            } else {
                alert("쪽지 전송에 실패했습니다.");
            }
        } catch {
            alert("쪽지 오류 발생");
        }
    };

    const handleApply = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        if (!window.confirm("이 공고에 지원하시겠습니까?")) return;

        const infoResponse = await fetch("/api/user-info/my-info", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!infoResponse.ok) {
            alert("지원 정보가 없습니다. 등록 페이지로 이동합니다.");
            navigate("/application-info/register");
            return;
        }

        const applyResponse = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ recruitmentId: studyGroupId })
        });

        if (applyResponse.ok) {
            alert("지원 완료되었습니다.");
        } else {
            const err = await applyResponse.text();
            alert("지원 실패 : " + err);
        }
    };

    const formatPhoneNumber = (number) => {
        if (!number || number.length !== 11) return number;
        return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    const getDDayColor = (dueDate) => {
        const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) return "bg-red-500";
        if (daysLeft <= 30) return "bg-yellow-400";
        return "bg-gray-500";
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen text-xl">공고 마감 중...</div>;
    }

    if (!studyGroup) {
        return <div className="text-center text-gray-600 mt-10">로딩 중...</div>;
    }

    return (
        <>
            {isReplyModalOpen && (
                <ReplyModal recipient={recipient} onClose={() => setIsReplyModalOpen(false)} onSend={sendReplyMessage} />
            )}
            <div className="flex justify-center px-4 py-20 bg-gray-50 min-h-screen">
                <div className="w-full max-w-4xl space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => navigate(-1)}>
                                <FaArrowLeft className="text-2xl text-gray-600 hover:text-black" />
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">{studyGroup.title}</h1>
                            <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${getDDayColor(studyGroup.dueDate)}`}>
                                D-{Math.max(0, Math.ceil((new Date(studyGroup.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                            </span>
                        </div>

                        {/* 설정 버튼 */}
                        {isCreator && (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-600 hover:text-black">
                                    <FiSettings className="h-6 w-6" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                                        <button onClick={() => navigate(`/study-group/edit/${studyGroupId}`)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">수정하기</button>
                                        <button onClick={handleClose} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">마감하기</button>
                                        <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">삭제하기</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-t border-gray-300 mb-6" />

                    {/* 주요 정보 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-700 mb-8">
                        <div className="flex space-x-2">
                            <span className="text-gray-400">모집 인원</span>
                            <span className="font-semibold">{studyGroup.currentMembers} / {studyGroup.totalMembers}</span>
                        </div>
                        <div className="flex space-x-2">
                            <span className="text-gray-400">마감일</span>
                            <span className="font-semibold">{studyGroup.dueDate}</span>
                        </div>
                        <div className="flex space-x-2">
                            <span className="text-gray-400">스터디 기간</span>
                            <span className="font-semibold">{studyGroup.startDate} ~ {studyGroup.endDate}</span>
                        </div>
                        <div className="flex space-x-2">
                            <span className="text-gray-400">주제</span>
                            <span className="font-semibold">{studyGroup.topic}</span>
                        </div>
                    </div>

                    <hr className="border-t border-gray-200 mb-8" />

                    {/* 설명 */}
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line min-h-[200px]">
                        {studyGroup.description}
                    </div>

                    {/* 하단 */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] text-gray-700 border-t pt-6">
                        {/* 작성자 정보 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center font-medium">✍ <span className="ml-1">{studyGroup.creatorNickname}</span></span>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-500">{new Date(studyGroup.createdDateTime).toISOString().split("T")[0]}</span>
                                {!isCreator && (
                                    <button onClick={() => handleSendMessageClick(studyGroup.creatorNickname)} className="text-blue-600 hover:underline ml-2">쪽지 보내기</button>
                                )}
                            </div>
                            {studyGroup.creatorContact && (
                                <div className="flex items-center text-[15px] mt-1">
                                    <IoIosCall className="h-5 w-5 mr-1 text-green-600" />
                                    {formatPhoneNumber(studyGroup.creatorContact)}
                                </div>
                            )}
                        </div>

                        {/* 조회수 및 지원 */}
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className="flex items-center text-[15px] text-gray-500">
                                <IoMdEye className="h-5 w-5 mr-1" />
                                {studyGroup.views}
                            </span>
                            {!isCreator && (
                                <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleApply}>
                                    지원하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudyGroup;
