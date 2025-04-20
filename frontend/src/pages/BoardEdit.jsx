import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        <div className="max-w-4xl mx-auto pt-28 px-6">
            <h2 className="text-2xl font-bold mb-6">게시글 수정</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <input
                    type="text"
                    value={categoryName}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border rounded resize-none"
                />
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                    돌아가기
                </button>
                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    수정 완료
                </button>
            </div>
        </div>
    );
};

export default BoardEdit;