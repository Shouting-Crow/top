import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyBoardList = () => {
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyBoards(page);
    }, [page]);

    const fetchMyBoards = async (pageNum) => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/boards/my?page=${pageNum - 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                    return;
                }
            }

            const data = await response.json();
            setBoards(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("내 게시글 불러오기 실패 : ", error);
        }
    };

    const handleBoardClick = (boardId) => {
        navigate(`/boards/${boardId}`, { state: { fromMyBoards: true } });
    }

    return (
        <div className="max-w-4xl mx-auto pt-28 px-6">
            <h2 className="text-2xl font-bold mb-6">📝 내 게시글</h2>

            {boards.length === 0 ? (
                <p className="text-gray-500 text-center">게시글이 없습니다.</p>
            ) : (
                <div className="space-y-3">
                    {boards.map((board) => (
                        <div
                            key={board.boardId}
                            onClick={() => handleBoardClick(board.boardId)}
                            className="p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        >
                            <div className="flex flex-col w-full">
                                <h3 className="text-lg font-semibold text-blue-700">{board.title}</h3>
                                <p className="text-sm text-gray-500">
                                    작성자: {board.authorNickname} | 조회수: {board.views}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(board.createdAt).toLocaleString("ko-KR")}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8 items-center gap-2">
                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-lg ${
                            page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="px-3 py-1.5 bg-gray-300 rounded-lg font-semibold shadow-sm text-lg"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default MyBoardList;
