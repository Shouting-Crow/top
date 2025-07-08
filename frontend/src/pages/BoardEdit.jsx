import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

const BoardEdit = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        fetchBoardDetail();
    }, []);

    const fetchBoardDetail = async () => {
        try {
            const response = await fetch(`/api/boards/${boardId}`);
            const data = await response.json();

            setTitle(data.board.title);
            setContent(data.board.content);
            setCategoryName(data.board.category.name);
        } catch (error) {
            console.error("게시글 정보 불러오기 실패", error);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(`/api/boards/${boardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content
                })
            });

            if (response.ok) {
                alert("게시글이 수정되었습니다.");
                navigate(`/boards/${boardId}`);
            } else {
                alert("게시글 수정 실패");
            }
        } catch (error) {
            console.error("게시글 수정 오류", error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-6 pt-24 pb-10">
            <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg">
                {/* 타이틀 */}
                <div className="flex items-center mb-10 gap-2">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">게시글 수정</h2>
                </div>

                {/* 제목 카테고리 라인 */}
                <div className="grid grid-cols-10 gap-6 mb-6">
                    <div className="col-span-7">
                        <label className="block text-gray-900 font-semibold mb-2">제목</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="col-span-3">
                        <label className="block text-gray-900 font-semibold mb-2">카테고리</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl bg-gray-100"
                            value={categoryName}
                            disabled
                        />
                    </div>
                </div>

                {/* 내용 */}
                <div className="mb-8">
                    <label className="block text-gray-900 font-semibold mb-2">내용</label>
                    <textarea
                        className="w-full p-4 border rounded-xl h-64 resize-none"
                        placeholder="게시글 내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
                        onClick={() => navigate(-1)}
                    >
                        돌아가기
                    </button>
                    <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={handleUpdate}
                    >
                        수정하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoardEdit;