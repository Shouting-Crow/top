import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyBasePostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPosts = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/base-posts/my-posts", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    alert("내 공고 정보를 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("에러 발생:", error);
                alert("서버 오류가 발생했습니다.");
            }
        };

        fetchMyPosts();
    }, []);

    const handlePostViewClick = (post) => {
        if (!post.inactive) {
            const path = post.postType === "RECRUITMENT"
                ? `/recruitment/${post.basePostId}`
                : `/study-group/${post.basePostId}`;
            navigate(path);
        }
    };

    const handlePostEditClick = (post) => {
        if (!post.inactive) {
            const path = post.postType === "RECRUITMENT"
                ? `/recruitment/edit/${post.basePostId}`
                : `/study-group/edit/${post.basePostId}`;
            navigate(path);
        }
    }

    const handleClosePostClick = async (post) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const confirmClose = window.confirm(`"${post.title}" 공고를 마감하시겠습니까?`);
        if (!confirmClose) return;

        const path = post.postType === "RECRUITMENT"
            ? `/api/recruitments/${post.basePostId}/close`
            : `/api/study-groups/${post.basePostId}/close`;

        try {
            const response = await fetch(path, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("공고가 마감되었습니다.");

                setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                        p.basePostId === post.basePostId ? { ...p, inactive: true } : p
                    )
                );
            } else if (response.status === 401) {
                alert("공고를 마감할 권한이 없습니다.");
            } else {
                alert("공고 마감에 실패했습니다.");
            }
        } catch (error) {
            console.error("공고 마감 요청 오류 : ", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100 p-6 pt-20">
            <div className="w-full h-12"></div>
            <h2 className="text-2xl font-bold mb-6">내 공고 리스트</h2>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 max-w-7xl w-full">
                {posts.map((post) => (
                    <div key={post.basePostId} className="relative group overflow-hidden rounded-lg shadow-lg transition-all w-full">
                        <div
                            className={`p-6 transition-all w-full h-full ${
                                post.inactive
                                    ? "bg-gray-400 cursor-not-allowed opacity-80"
                                    : "bg-white group-hover:opacity-30 cursor-pointer"
                            }`}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 break-words">
                                {post.title}
                            </h3>

                            {post.postType === "STUDY_GROUP" && (
                                <p className="text-md font-semibold text-blue-600 mb-4">{post.topic}</p>
                            )}

                            <div className="text-md bg-gray-200 p-3 rounded-md space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-semibold">등록일:</span>{" "}
                                    {new Date(post.createdAt).toISOString().split("T")[0]}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">
                                  {post.currentMembers} / {post.totalMembers} 모집
                                </span>
                                <span
                                    className={`text-lg font-bold px-4 py-2 rounded-md ${
                                        post.inactive ? "bg-gray-700 text-white" : "bg-red-500 text-white"
                                    }`}
                                >
                                  {post.inactive
                                      ? "종료"
                                      : `D-${Math.max(
                                          0,
                                          Math.ceil(
                                              (new Date(post.dueDate) - new Date()) /
                                              (1000 * 60 * 60 * 24)
                                          )
                                      )}`}
                                </span>
                            </div>
                        </div>

                        {/* 이동 버튼 */}
                        {!post.inactive && (
                            <>
                                {/* 왼쪽 버튼 */}
                                <div className="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center pl-4 space-y-3 transform -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        className="flex items-center justify-center bg-pink-400 text-white font-semibold px-4 py-2 rounded-md shadow-md w-40"
                                        onClick={(e) => {
                                            handlePostViewClick(post);
                                        }}
                                    >
                                        공고 보기
                                    </button>
                                    <button
                                        className="flex items-center justify-center bg-purple-400 text-white font-semibold px-4 py-2 rounded-md shadow-md w-40"
                                        onClick={() => navigate(`/applicants/${post.basePostId}`)}
                                    >
                                        지원자 보기
                                    </button>
                                </div>

                                {/* 오른쪽 버튼 */}
                                <div className="absolute top-0 right-0 h-full w-1/2 flex flex-col justify-center pr-4 items-end space-y-3 transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        className="flex items-center justify-center bg-green-500 text-white font-semibold px-4 py-2 rounded-md shadow-md w-40"
                                        onClick={(e) => {
                                            handlePostEditClick(post);
                                        }}
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        className="flex items-center justify-center bg-cyan-400 text-white font-semibold px-4 py-2 rounded-md shadow-md w-40"
                                        onClick={(e) => {
                                            handleClosePostClick(post);
                                        }}
                                    >
                                        마감하기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBasePostList;