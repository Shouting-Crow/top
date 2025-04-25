import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = () => {
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("all");
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchBoards(page);
    }, [page]);

    const fetchBoards = async (pageNum) => {
        try {
            const response = await fetch(`/api/boards?page=${pageNum - 1}`);
            const data = await response.json();
            setBoards(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("게시글 불러오기 실패 : ", error);
        }
    };

    const handleSearch = async (pageNum) => {
        const params = new URLSearchParams({
            searchType,
            keyword,
            category: selectedCategory,
            page: pageNum - 1
        });

        try {
            const response = await fetch(`/api/boards/search?${params.toString()}`);
            const data = await response.json();

            setBoards(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number + 1);
        } catch (error) {
            console.error("게시글 검색 실패 : ", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-28 px-6">
            <h2 className="text-2xl font-bold mb-6">📚 게시판</h2>

            <div className="flex justify-end mb-6">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => {
                        const token = localStorage.getItem("jwtToken");
                        if (!token) {
                            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?");
                            if (confirmLogin) {
                                navigate("/login", {state: {from: location.pathname}});
                            }
                        } else {
                            navigate("/boards/register");
                        }
                    }}
                >
                    게시글 작성
                </button>
            </div>

            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                </select>

                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
                    className="flex-1 border p-2 rounded"
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleSearch(1)}
                >
                    검색
                </button>
            </div>

            {/* 카테고리 버튼 */}
            <div className="flex gap-2 mb-6">
                {["all", "공지글", "일반글", "상담글", "모집글", "판매글"].map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${
                            selectedCategory === cat
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => {
                            setSelectedCategory(selectedCategory === cat ? "all" : cat);
                            setPage(1);
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {boards.length === 0 ? (
                <p className="text-gray-500 text-center">게시글이 없습니다.</p>
            ) : (
                <div className="space-y-3">
                    {boards.map((board) => (
                        <div
                            key={board.boardId}
                            onClick={() => navigate(`/boards/${board.boardId}`)}
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

export default BoardList;