import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReplyModal from "../components/ReplyModal";

const StudyGroup = () => {
    const { studyGroupId } = useParams();
    const [studyGroup, setStudyGroup] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); //모달 상태
    const [recipient, setRecipient] = useState(""); //쪽지 수신자 설정

    useEffect(() => {
        fetchStudyGroup();
    }, []);

    const fetchStudyGroup = async () => {
        try {
            const response = await fetch(`/api/study-groups/${studyGroupId}`);
            if (!response.ok) {
                throw new Error("공고를 불러오는 데 실패했습니다.");
            }
            const data = await response.json();
            setStudyGroup(data);

            // 현재 로그인한 사용자가 공고 작성자인지 확인
            const loggedInUser = localStorage.getItem("nickname");
            setIsCreator(loggedInUser === data.creatorNickname);
        } catch (error) {
            console.error("데이터를 불러오지 못했습니다.", error);
            alert("공고 정보를 불러오는 데 실패했습니다.");
            navigate("/study-groups");
        }
    };

    //쪽지 보내기 버튼 클릭 시 실행
    const handleSendMessageClick = (recipient) => {
        setRecipient(recipient);
        setIsReplyModalOpen(true);
    };

    //쪽지 전송 요청
    const sendReplyMessage = async (content) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8080/api/messages`, {
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
    const handleDeleteStudyGroup = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        const confirmDelete = window.confirm("정말 이 공고를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try{
            const response = await fetch(`http://localhost:8080/api/study-groups/${studyGroupId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("공고가 삭제되었습니다.");
                navigate("/study-groups");
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

    const handleCloseStudyGroup = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login", {state: {from: location.pathname}});
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            const response = await fetch(`/api/study-groups/${studyGroupId}/close`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("공고가 마감되었습니다.");
                setTimeout(() => { // 2초 로딩 후 페이지 이동
                    navigate("/study-groups");
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
                body: JSON.stringify({ recruitmentId: studyGroupId})
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl font-bold text-gray-700">공고를 마감하는 중...</div>
            </div>
        );
    }

    if (!studyGroup) {
        return <div className="text-center text-gray-600">로딩 중...</div>;
    }

    return (
        <>
            {/*쪽지 쓰기 모달*/}
            {isReplyModalOpen && (
                <ReplyModal
                    recipient={recipient}
                    onClose={() => setIsReplyModalOpen(false)}
                    onSend={sendReplyMessage}
                />
            )}
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-14">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    {/* 공고 제목 */}
                    <div className="bg-green-300 text-center text-xl font-bold p-4 rounded-md mb-6">
                        {studyGroup.title}
                    </div>

                    {/* 등록일 & 작성자 */}
                    <div className="flex justify-between items-center text-gray-700 text-md mb-4">
                        {/* 등록일 블록 */}
                        <div className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold flex items-center">
                            📅 등록일: {new Date(studyGroup.createdDateTime).toLocaleString()}
                        </div>

                        {/* 작성자 정보 및 쪽지 보내기 버튼 */}
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">✍ 작성자: {studyGroup.creatorNickname}</span>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                onClick={() => handleSendMessageClick(studyGroup.creatorNickname)}
                            >
                                쪽지 보내기
                            </button>
                        </div>
                    </div>

                    {/* 🆕 스터디 주제 (추가) */}
                    <div className="bg-blue-100 p-3 rounded-md text-lg font-semibold text-blue-900 mb-4 text-center">
                        📚 스터디 주제: {studyGroup.topic}
                    </div>

                    {/* 공고 설명 */}
                    <div className="bg-gray-100 p-4 rounded-md mb-6 text-lg text-gray-800 min-h-[200px]">
                        {studyGroup.description}
                    </div>

                    {/* 🆕 스터디 기간 (추가) */}
                    <div className="bg-yellow-100 p-3 rounded-md text-lg font-semibold text-yellow-900 mb-4 text-center">
                        ⏳ 스터디 기간: {studyGroup.startDate} ~ {studyGroup.endDate}
                    </div>

                    {/* 모집 현황 & 마감일 */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-md text-lg font-semibold">
                            D-{Math.max(0, Math.ceil((new Date(studyGroup.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                        </span>
                            <span className="text-lg font-semibold text-gray-900">
                            {studyGroup.currentMembers} / {studyGroup.totalMembers}
                        </span>
                        </div>

                        {isCreator && (
                            <button
                                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow-md hover:bg-yellow-500"
                                onClick={handleCloseStudyGroup}
                            >
                                마감하기
                            </button>
                        )}
                    </div>

                    {/* 작성자 연락처 */}
                    <div className="bg-gray-200 p-3 rounded-md text-gray-800 text-center mb-6">
                        {studyGroup.creatorContact}
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex justify-between">
                        <button
                            className="bg-blue-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-600"
                            onClick={() => navigate("/study-groups")}
                        >
                            돌아가기
                        </button>
                        {!isCreator && (
                            <button
                                className="bg-green-400 text-white px-5 py-2 rounded-md shadow-md hover:bg-green-500"
                                onClick={handleApplyRecruitment}
                            >
                                지원하기
                            </button>
                        )}
                    </div>

                    {/* 수정 & 삭제 버튼 (작성자만 보이도록 설정) */}
                    {isCreator && (
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-yellow-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-yellow-600"
                                onClick={() => navigate(`/study-group/edit/${studyGroupId}`)}
                            >
                                수정하기
                            </button>
                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-red-600"
                                onClick={() => handleDeleteStudyGroup()}
                            >
                                삭제하기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudyGroup;