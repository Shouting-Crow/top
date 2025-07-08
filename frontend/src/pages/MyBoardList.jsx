import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegEye, FaRegComments, FaRegClipboard } from "react-icons/fa";

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
    };

    return (
        <div className="max-w-4xl mx-auto pt-28 px-6">
            {/* 타이틀 */}
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate("/")} className="text-gray-700 hover:text-gray-900">
                    <FaArrowLeft size={20} />
                </button>
                <FaRegClipboard className="text-blue-600" size={20} />
                <h2 className="text-2xl font-bold">내 게시글</h2>
            </div>

            {/* 게시글 리스트 또는 없음 표시 */}
            {boards.length === 0 ? (
                <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50 text-gray-500">
                    게시글이 없습니다.
                </div>
            ) : (
                <div className="space-y-3 min-h-64">
                    {boards.map((board) => (
                        <div
                            key={board.boardId}
                            onClick={() => handleBoardClick(board.boardId)}
                            className="p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        >
                            <div className="flex flex-col w-full">
                                <h3 className="text-lg font-semibold text-blue-700 truncate">{board.title}</h3>
                            </div>

                            <div className="flex items-center gap-3 whitespace-nowrap ml-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FaRegEye /> {board.views}
                            </span>
                                <span>{new Date(board.createdAt).toLocaleString("ko-KR")}</span>
                                <span className="bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
                                    {board.replyCount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center mt-8 gap-2">
                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    &lt;
                </button>

                {Array.from({ length: totalPages })
                    .slice(Math.floor((page - 1) / 5) * 5, Math.min(Math.floor((page - 1) / 5) * 5 + 5, totalPages))
                    .map((_, i) => {
                        const pageNum = Math.floor((page - 1) / 5) * 5 + i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center ${
                                    page === pageNum
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800 border border-gray-300"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default MyBoardList;
