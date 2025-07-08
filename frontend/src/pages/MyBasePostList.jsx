import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { FaArrowLeft, FaRegClipboard } from "react-icons/fa";

const MyBasePostList = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPosts = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/base-posts/my-posts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    alert("내 공고 정보를 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };

        fetchMyPosts();
    }, []);

    const handlePostClick = (post) => {
        if (!post.inactive) {
            const path = post.postType === "RECRUITMENT"
                ? `/recruitment/${post.basePostId}`
                : `/study-group/${post.basePostId}`;
            navigate(path);
        }
    };

    const handleCreateGroup = async () => {
        const token = localStorage.getItem("jwtToken");
        const groupType = selectedPost.postType === "RECRUITMENT" ? "PROJECT" : "STUDY_GROUP";

        const payload = {
            basePostId: selectedPost.basePostId,
            name: groupName,
            description: groupDescription,
            type: groupType,
        };

        try {
            const response = await fetch("/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();

                const goToGroup = window.confirm("그룹이 생성되었습니다. 그룹 페이지로 이동하시겠습니까?");
                if (goToGroup) {
                    navigate(`/groups/${data.id}`);
                }

                setShowModal(false);
                setPosts((prev) =>
                    prev.filter((p) => p.basePostId !== selectedPost.basePostId)
                );
            } else {
                const err = await response.text();
                alert("그룹 생성 실패: " + err);
            }
        } catch (error) {
            console.error("그룹 생성 중 오류:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };




    const handleDeletePost = async (postId) => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/base-posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("공고가 삭제되었습니다.");
                setPosts((prev) => prev.filter((p) => p.basePostId !== postId));
            } else {
                const err = await response.text();
                alert("삭제 실패: " + err);
            }
        } catch (error) {
            console.error("삭제 중 오류:", error);
        }
    };

    return (
        <>
            {showModal && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                        >
                            <HiX />
                        </button>

                        {/* 타이틀 */}
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            그룹 생성
                        </h3>

                        {/* 입력 필드 */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">그룹 이름</label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="예: TOP 프로젝트 팀"
                                    className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">그룹 설명</label>
                                <textarea
                                    rows="3"
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                    placeholder="그룹에 대한 간단한 소개를 입력해 주세요"
                                    className="w-full border rounded-lg px-4 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* 생성 버튼 */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleCreateGroup}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex flex-col items-center min-h-screen bg-gray-100 pt-24">
                <div className="w-full max-w-6xl flex justify-start items-center gap-2 mb-8 px-4">
                    <button onClick={() => navigate("/")} className="text-gray-700 hover:text-gray-900">
                        <FaArrowLeft size={20} />
                    </button>
                    <FaRegClipboard className="text-blue-600 mt-0.5" size={20} />
                    <h2 className="text-2xl font-bold">내 공고 리스트</h2>
                </div>

                {posts.length === 0 ? (
                    <div className="flex justify-center items-center flex-1 w-full">
                        <p className="text-gray-500 text-lg">등록된 공고가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-7xl w-full px-4">
                        {posts.map((post) => {
                        const daysLeft = Math.max(
                            0,
                            Math.ceil((new Date(post.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                        );

                        return (
                            <div
                                key={post.basePostId}
                                className={`relative p-6 rounded-2xl shadow-md transition-all w-full h-full min-h-[220px] flex flex-col justify-between
                                    ${post.inactive
                                        ? "bg-gray-300 opacity-70"
                                        : "bg-white hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                                    }`}
                                onClick={() => handlePostClick(post)}
                            >
                                {/* 제목 */}
                                <h3 className="text-base font-semibold text-gray-900 mb-2 break-words line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* 주제 */}
                                {post.topic && (
                                    <p className="text-sm text-gray-700 mb-3">{post.topic}</p>
                                )}

                                {/* 모집 인원 */}
                                <p className="text-sm text-gray-700 mb-4 font-medium">
                                    모집 인원: {post.currentMembers} / {post.totalMembers}
                                </p>

                                {/* 하단 정보 */}
                                <div className="flex justify-between items-end mt-auto">
                                    <span className="text-xs text-gray-500">
                                        마감일 | {post.dueDate}
                                    </span>

                                    <div className="text-right space-y-1">
                                        <span className="text-xs font-semibold text-blue-600 block">
                                            {post.postType === "RECRUITMENT" ? "프로젝트" : "스터디"}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded
                                            ${daysLeft <= 7
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-600"}`}>
                                            D-{daysLeft}
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            지원자 {post.applicantCount}명
                                        </span>
                                    </div>
                                </div>

                                {/* 마감된 공고 버튼 */}
                                {post.inactive && (
                                    <div
                                        className="absolute inset-0 flex flex-col justify-center items-center gap-2
                                            bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-all duration-300"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPost(post);
                                                setShowModal(true);
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                                        >
                                            그룹 생성
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePost(post.basePostId);
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                                        >
                                            공고 삭제
                                        </button>
                                    </div>
                                )}

                                {/* 마감되지 않은 공고 버튼 */}
                                {!post.inactive && (
                                    <div
                                        className="absolute inset-0 flex flex-col justify-center items-center gap-2
                                        bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-all duration-300"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePostClick(post);
                                            }}
                                            className="w-32 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                                        >
                                            공고 보기
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/applicants/${post.basePostId}`);
                                            }}
                                            className="w-32 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded shadow"
                                        >
                                            지원자 보기
                                        </button>
                                    </div>
                                )}


                            </div>
                        );
                    })}
                </div>
                )}
            </div>
        </>
    );
};

export default MyBasePostList;
