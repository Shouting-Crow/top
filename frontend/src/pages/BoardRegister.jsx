import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardRegister = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState(1);
    const [authorId, setAuthorId] = useState(null);
    const navigate = useNavigate();

    const categories = [
        { id: 1, name: "일반글" },
        { id: 2, name: "모집글" },
        { id: 3, name: "공지글" },
        { id: 4, name: "상담글" },
        { id: 5, name: "판매글" }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAuthorId(data.id);
                } else {
                    alert("로그인 후 이용가능한 서비스입니다.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("사용자 정보 조회 실패 : ", error);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch("/api/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    authorId,
                    categoryId,
                }),
            });

            if (response.ok) {
                alert("게시글이 등록되었습니다.");
                navigate("/boards");
            } else {
                const error = await response.text();
                alert("게시글 등록 실패 : " + error);
            }
        } catch (error) {
            console.error("게시글 등록 오류",  error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-28 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6">📌 게시글 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        maxLength={100}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-40 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">카테고리</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/boards")}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        돌아가기
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        등록하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardRegister;