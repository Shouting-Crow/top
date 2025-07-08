import {useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReplyModal from "../components/ReplyModal";
import { FiSettings } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import {FaArrowLeft} from "react-icons/fa";

const Recruitment = () => {
    const { recruitmentId } = useParams();
    const [recruitment, setRecruitment] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchRecruitment();
    }, []);

    useEffect(() => {
        increaseView();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const increaseView = async () => {
        const viewedKey = `viewed-recruitment-${recruitmentId}`;

        if (localStorage.getItem(viewedKey)) return;

        try {
            await fetch(`/api/base-posts/${recruitmentId}/view`, {
                method: "POST"
            });
            localStorage.setItem(viewedKey, "true");
        } catch (error) {
            console.error("조회수 증가 실패", error);
        }
    };

    const fetchRecruitment = async () => {
        try {
            const response = await fetch(`/api/recruitments/${recruitmentId}`);
            if (!response.ok) {
                throw new Error("공고를 불러오는 데 실패했습니다.");
            }
            const data = await response.json();
            setRecruitment(data);

            // 현재 로그인한 사용자가 공고 작성자인지 확인
            const loggedInUser = localStorage.getItem("nickname");
            setIsCreator(loggedInUser === data.creatorNickname);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다.", error);
            alert("공고 정보를 불러오는 데 실패했습니다.");
            navigate("/recruitments");
        }
    };

    //쪽지 보내기 버튼 클릭 시 실행
    const handleSendMessageClick = (recipient) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        setRecipient(recipient);
        setIsReplyModalOpen(true);
    };

    //쪽지 전송 요청
    const sendReplyMessage = async (content) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch(`/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverName: recipient,
                    content: content
                })
            });

            if (response.ok) {
                alert("쪽지가 성공적으로 전송되었습니다.");
                setIsReplyModalOpen(false);
            } else {
                alert("쪽지 전송에 실패했습니다.");
            }
        } catch (error) {
            console.error("쪽지 전송 오류 : ", error);
            alert("쪽지 전송 중 오류가 발생했습니다.");
        }
    };

    //공고 삭제 버튼 실행
    const handleDeleteRecruitment = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        const confirmDelete = window.confirm("정말 이 공고를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try{
          const response = await fetch(`/api/recruitments/${recruitmentId}`, {
              method: "DELETE",
              headers: {
                  "Authorization": `Bearer ${token}`
              }
          });

          if (response.ok) {
              alert("공고가 삭제되었습니다.");
              navigate("/recruitments");
          } else if (response.status === 403) {
              alert("공고를 삭제할 권한이 없습니다.");
          } else {
              alert("공고 삭제에 실패했습니다.");
          }
        } catch (error) {
            console.error("공고 삭제 중 오류 발생 : ", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    //마감하기
    const handleCloseRecruitment = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", {state: {from: location.pathname}});
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            const response = await fetch(`/api/recruitments/${recruitmentId}/close`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("공고가 마감되었습니다.");
                setTimeout(() => { // 2초 로딩 후 페이지 이동
                    navigate("/recruitments");
                }, 2000);
            } else if (response.status === 403) {
                alert("공고를 마감할 권한이 없습니다.");
                setIsLoading(false);
            } else {
                alert("공고 마감에 실패했습니다.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("공고 마감 오류:", error);
            alert("서버 오류가 발생했습니다.");
            setIsLoading(false);
        }
    };

    //지원하기 버튼 클릭
    const handleApplyRecruitment = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", {state: {from: location.pathname}});
            return;
        }

        const confirmApply = window.confirm("이 공고에 지원하시겠습니까?");
        if (!confirmApply) return;

        try {
            const infoResponse = await fetch("/api/user-info/my-info", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!infoResponse.ok) {
                alert("지원 정보가 존재하지 않습니다. 지원 정보 등록 페이지로 이동합니다.");
                navigate("/application-info/register");
                return;
            }

            const applyResponse = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ recruitmentId })
            });

            if (applyResponse.ok) {
                alert("지원이 완료되었습니다.");
            } else {
                const errorMessage = await applyResponse.text();
                alert("지원 실패 : " + errorMessage);
            }
        } catch (error) {
            console.error("지원 중 오류 발생 : ", error);
            alert("지원 중 오류가 발생했습니다.");
        }
    };

    const getDDayColor = (dueDate) => {
        const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) return "bg-red-500";
        if (daysLeft <= 30) return "bg-yellow-400";
        return "bg-gray-500";
    };

    const formatPhoneNumber = (number) => {
        if (!number || number.length !== 11) return number;
        return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl font-bold text-gray-700">공고를 마감하는 중...</div>
            </div>
        );
    }

    if (!recruitment) {
        return <div className="text-center text-gray-600">로딩 중...</div>;
    }

    return (
        <>
            {isReplyModalOpen && (
                <ReplyModal
                    recipient={recipient}
                    onClose={() => setIsReplyModalOpen(false)}
                    onSend={sendReplyMessage}
                />
            )}
            <div className="flex justify-center px-4 py-20 bg-gray-50 min-h-screen">
                <div className="w-full max-w-4xl space-y-10">
                    {/* 제목 및 버튼 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => navigate(-1)}>
                                <FaArrowLeft className="text-2xl text-gray-600 hover:text-black" />
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">{recruitment.title}</h1>
                            <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${getDDayColor(recruitment.dueDate)}`}>
                                D-{Math.max(0, Math.ceil((new Date(recruitment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                            </span>
                        </div>

                        {/* 작성자 전용 메뉴 */}
                        {isCreator && (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-600 hover:text-black">
                                    <FiSettings className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => navigate(`/recruitment/edit/${recruitmentId}`)}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            수정하기
                                        </button>
                                        <button
                                            onClick={handleCloseRecruitment}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            마감하기
                                        </button>
                                        <button
                                            onClick={handleDeleteRecruitment}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            삭제하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-t border-gray-300 mb-6" />

                    {/* 핵심 정보 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-700 mb-8">
                        <div className="flex space-x-2">
                            <span className="text-gray-400">모집 인원</span>
                            <span className="font-semibold">{recruitment.currentMembers} / {recruitment.totalMembers}</span>
                        </div>
                        <div className="flex space-x-2">
                            <span className="text-gray-400">마감일</span>
                            <span className="font-semibold">{recruitment.dueDate}</span>
                        </div>
                        <div className="flex space-x-2">
                            <span className="text-gray-400">주제</span>
                            <span className="font-semibold">{recruitment.topic}</span>
                        </div>
                    </div>

                    {/* 기술 태그 */}
                    <div className="mb-6">
                        <div className="text-gray-400 mb-2">기술 태그</div>
                        <div className="flex flex-wrap gap-2">
                            {recruitment.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-200 text-sm text-gray-800 px-3 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-200 mb-8" />

                    {/* 설명 */}
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line min-h-[200px]">
                        {recruitment.description}
                    </div>

                    {/* 하단 */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[15px] text-gray-700 border-t pt-6">
                        {/* 작성자 + 날짜 + 쪽지 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center font-medium">
                                    ✍ <span className="ml-1">{recruitment.creatorNickname}</span>
                                </span>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-500">{new Date(recruitment.createdDateTime).toISOString().split("T")[0]}</span>
                                {!isCreator && (
                                    <button
                                        onClick={() => handleSendMessageClick(recruitment.creatorNickname)}
                                        className="text-blue-600 hover:underline ml-2"
                                    >
                                        쪽지 보내기
                                    </button>
                                )}
                            </div>

                            {/* 연락처 */}
                            {recruitment.creatorContact && (
                                <div className="flex items-center text-[15px] mt-1">
                                    <IoIosCall className="h-5 w-5 mr-1 text-green-600" />
                                    {formatPhoneNumber(recruitment.creatorContact)}
                                </div>
                            )}
                        </div>

                        {/* 조회수 + 지원 */}
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className="flex items-center text-[15px] text-gray-500">
                                <IoMdEye className="h-5 w-5 mr-1" />
                                {recruitment.views}
                            </span>
                            {!isCreator && (
                                <button
                                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                    onClick={handleApplyRecruitment}
                                >
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

export default Recruitment;