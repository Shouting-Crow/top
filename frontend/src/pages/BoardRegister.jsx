import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

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
                    navigate("/login", {state: {from: location.pathname}});
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
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-6 pt-24 pb-10">
            <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg">
                {/* 타이틀 */}
                <div className="flex items-center mb-10 gap-2">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">게시글 작성</h2>
                </div>

                <div className="flex items-start gap-10 mb-6">
                    {/* 제목 */}
                    <div className="w-[70%]">
                        <label className="block text-gray-900 font-semibold mb-2">제목</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* 카테고리 */}
                    <div className="w-[130px]">
                        <label className="block text-gray-900 font-semibold mb-2">카테고리</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            className="w-full p-3 border rounded-xl"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 내용 */}
                <div className="mb-8">
                    <label className="block text-gray-900 font-semibold mb-2">내용</label>
                    <textarea
                        className="w-full p-4 border rounded-xl h-64 resize-none"
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
                        onClick={() => navigate("/boards")}
                    >
                        돌아가기
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoardRegister;