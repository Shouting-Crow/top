import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

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
        <div className="max-w-4xl mx-auto px-6">

            {/* 상단 배너 */}
            <div className="w-full max-h-[280px] overflow-hidden mb-8 bg-white flex justify-center mx-auto mt-9 mb-8">
                <img
                    src="/banner/boards_banner.png"
                    alt="Top Boards 배너"
                    className="h-auto w-full object-contain"
                />
            </div>

            {/* 검색기능 */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

                <div className="flex flex-wrap items-center gap-2">
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
                        className="w-64 border p-2 rounded"
                    />

                    <button
                        onClick={() => handleSearch(1)}
                        className="p-2 rounded hover:bg-gray-200"
                    >
                        <FiSearch className="text-xl text-gray-700" />
                    </button>
                </div>

                <button
                    className="bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-md hover:bg-gray-300"
                    onClick={() => {
                        const token = localStorage.getItem("jwtToken");
                        if (!token) {
                            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?");
                            if (confirmLogin) {
                                navigate("/login", { state: { from: location.pathname } });
                            }
                        } else {
                            navigate("/boards/register");
                        }
                    }}
                >
                    게시글 작성
                </button>
            </div>

            {/* 카테고리 필터 */}
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

            {/*게시글 리스트*/}
            <div className="min-h-[250px]">
                {boards.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        게시글이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {boards.map((board) => (
                            <div
                                key={board.boardId}
                                onClick={() => navigate(`/boards/${board.boardId}`)}
                                className="p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                            >
                                {/* 작성자 */}
                                <div className="w-28 text-sm text-gray-700 font-medium truncate">
                                    {board.authorNickname}
                                </div>

                                {/* 제목 */}
                                <div className="flex-1 text-blue-700 font-semibold text-base px-4 truncate">
                                    {board.title}
                                </div>

                                {/* 조회수, 날짜, 댓글 */}
                                <div className="flex items-center gap-4 whitespace-nowrap">
                                    {/* 조회수 */}
                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                        <FiEye className="text-base" />
                                        <span>{board.views}</span>
                                    </div>

                                    {/* 작성일 */}
                                    <span className="text-sm text-gray-400">
                                        {new Date(board.createdAt).toLocaleString("ko-KR")}
                                    </span>

                                    {/* 댓글 수 */}
                                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {board.replyCount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8 items-center gap-1">
                <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-md hover:bg-gray-300 disabled:opacity-40"
                >
                    <FiChevronLeft className="text-xl" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold ${
                            page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-md hover:bg-gray-300 disabled:opacity-40"
                >
                    <FiChevronRight className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default BoardList;
