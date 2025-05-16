import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const Board = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [replies, setReplies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loginId, setLoginId] = useState(null);
    const [newReply, setNewReply] = useState("");
    const [loginUser, setLoginUser] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [replyTargetNickname, setReplyTargetNickname] = useState("");
    const replyInputRef = useRef(null);
    const location = useLocation();
    const [fromMyBoards] = useState(() => location.state?.fromMyBoards === true);

    useEffect(() => {
        increaseView();
    }, []);

    useEffect(() => {
        fetchBoardDetail();
        fetchLoginUser();
    }, [page]);

    const increaseView = async () => {
        try {
            await fetch(`/api/boards/${boardId}/view`, {
                method: "POST"
            });
        } catch (error) {
            console.error("조회수 증가 실패", error);
        }
    };

    const fetchBoardDetail = async () => {
        try {
            const response = await fetch(`/api/boards/${boardId}?page=${page - 1}`);
            const data = await response.json();

            setBoard(data.board);
            setReplies(data.replies.content);
            setTotalPages(data.replies.totalPages);
        } catch (error) {
            console.error("게시글 상세 요청 실패 : ", error);
        }
    };

    const fetchLoginUser = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch(`/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setLoginId(data.loginId);
            setLoginUser(data);
        } catch (error) {
            console.error("로그인 사용자 정보 조회 실패 : ", error);
        }
    };

    const handleReplySubmit = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?");
            if (confirmLogin) {
                navigate("/login", {state: {from: location.pathname}});
            }
            return;
        }

        if (!newReply.trim() || !loginUser) return;

        try {
            const response=  await fetch(`/api/replies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardId: boardId,
                    authorId: loginUser.id,
                    content: newReply,
                    parentReplyId: replyTargetId || null
                })
            });

            if (response.ok) {
                setNewReply("");
                setReplyTargetId(null);
                setReplyTargetNickname("");
                fetchBoardDetail();
            } else {
                alert("댓글 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("댓글 등록 오류", error);
        }
    };

    const handleEdit = () => {
        navigate(`/boards/edit/${boardId}`);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`/api/boards/${boardId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                alert("삭제되었습니다.");
                navigate("/boards");
            } else {
                alert("게시글 삭제 실패");
            }
        } catch (error) {
            console.error("게시글 삭제 오류 : ", error);
        }
    };

    const handleEditClick = (reply) => {
        setEditingReplyId(reply.id);
        setEditedContent(reply.content);
    };

    const handleCancelEdit = () => {
        setEditingReplyId(null);
        setEditedContent("");
    };

    const handleUpdateReply = async () => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/replies/${editingReplyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });

            if (response.ok) {
                setEditingReplyId(null);
                setEditedContent("");
                fetchBoardDetail();
            } else {
                alert("댓글 수정 실패");
            }
        } catch (error) {
            console.error("댓글 수정 오류", error);
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("jwtToken");
        try {
            const response = await fetch(`/api/replies/${replyId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                fetchBoardDetail();
            } else {
                alert("댓글 삭제 실패");
            }
        } catch (error) {
            console.error("댓글 삭제 오류", error);
        }
    };

    //대댓글을 위한 댓글 클릭 후 이동
    const handleReplyBoxClick = (replyId, authorNickname) => {
        setReplyTargetId(replyId);
        setReplyTargetNickname(authorNickname);
        setTimeout(() => {
            replyInputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 50);
    };

    if (!board) return <div className="pt-28 text-center">로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto pt-28 px-6">
            <div className="border rounded-md p-4 bg-white shadow-sm mb-6">
                <h2 className="text-3xl font-bold mb-3">
                    [{board.category.name}] {board.title}
                </h2>
            </div>

            <div className="text-sm text-gray-500 mb-1">
                작성자: {board.author.nickname} | 조회수: {board.views} | 작성일: {new Date(board.createdAt).toLocaleString("ko-KR")}
            </div>
            <div className="border rounded-md p-4 bg-white min-h-[500px] whitespace-pre-wrap">
                {board.content}
            </div>

            <br></br>

            {/* 작성자만 수정/삭제 버튼 노출 */}
            {loginId === board.author.loginId && (
                <div className="flex gap-2 mb-6">
                    <button onClick={handleEdit} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">수정하기</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">삭제하기</button>
                </div>
            )}

            <button
                className="mb-8 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => navigate(fromMyBoards ? "/my-boards" : "/boards")}
            >
                돌아가기
            </button>

            {/* 댓글 목록 */}
            <div>
                <h3 className="text-xl font-semibold mb-4">💬 댓글 {board.replyCount}개</h3>
                {replies.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">댓글이 없습니다.</p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {replies
                            .filter((r) => r.parentReplyId === null)
                            .map((parent) => (
                                <div
                                    key={parent.id}
                                    className="border rounded bg-gray-50 p-4"
                                    onClick={() => handleReplyBoxClick(parent.id, parent.authorNickname)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{parent.authorNickname}</span>
                                        {parent.edited && <span className="text-xs text-gray-500">(수정됨)</span>}
                                    </div>

                                    {editingReplyId === parent.id ? (
                                        <>
                                            <textarea
                                                className="w-full border rounded p-2 text-sm mt-2"
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                rows={3}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={handleUpdateReply}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    수정 완료
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-300 px-3 py-1 rounded"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm mt-1">{parent.content}</p>
                                    )}

                                    <div className="flex justify-end gap-4 text-sm mt-2">
                                        {editingReplyId !== parent.id && (
                                            <>
                                                {loginUser && parent.authorId === loginUser.id && (
                                                    <button
                                                        className="text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(parent);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                )}
                                                {loginUser && (parent.authorId === loginUser.id || loginUser.id === board.author.id) && (
                                                    <button
                                                        className="text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteReply(parent.id);
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* 대댓글 렌더링 */}
                                    <div className="mt-3 ml-6 space-y-2">
                                        {replies
                                            .filter((child) => child.parentReplyId === parent.id)
                                            .map((child) => (
                                                <div
                                                    key={child.id}
                                                    className="bg-gray-100 p-3 rounded flex justify-between items-start"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {editingReplyId === child.id ? (
                                                        <div className="w-full">
                                                            <div className="font-medium text-sm mb-1">{child.authorNickname}</div>
                                                            <textarea
                                                                className="w-full border rounded p-2 text-sm resize-none"
                                                                value={editedContent}
                                                                rows={3}
                                                                onChange={(e) => setEditedContent(e.target.value)}
                                                            />
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    onClick={handleUpdateReply}
                                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                                >
                                                                    수정 완료
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="bg-gray-300 px-3 py-1 rounded"
                                                                >
                                                                    취소
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-full">
                                                                <div className="font-medium text-sm">{child.authorNickname}</div>
                                                                <div className="text-sm mt-1 whitespace-pre-wrap">{child.content}</div>
                                                                {child.edited && (
                                                                    <span className="text-xs text-gray-500 inline-block mt-1">(수정됨)</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 ml-auto whitespace-nowrap">
                                                                {loginUser && child.authorId === loginUser.id && (
                                                                    <button
                                                                        className="text-blue-600 text-sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditClick(child);
                                                                        }}
                                                                    >
                                                                        수정
                                                                    </button>
                                                                )}
                                                                {loginUser && (child.authorId === loginUser.id || loginUser.id === board.author.id) && (
                                                                    <button
                                                                        className="text-red-600 text-sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteReply(child.id);
                                                                        }}
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* 페이지네이션 */}
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1 rounded bg-gray-200"
                        disabled={page === 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-3 py-1 rounded bg-gray-200"
                        disabled={page === totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>

            {/* 댓글 작성 창 */}
            <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-semibold mb-2">
                    {replyTargetId ? `"${replyTargetNickname}"님에게 답글 작성 중` : "댓글 작성"}
                </h4>
                <textarea
                    ref={replyInputRef}
                    rows={3}
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplySubmit();
                        }
                    }}
                    className="w-full p-3 border rounded resize-none"
                    placeholder="댓글을 입력하세요. (Shift + Enter 줄바꿈)"
                />
                <div className="flex justify-end items-center mt-2 gap-2">
                    {replyTargetId && (
                        <button
                            onClick={() => {
                                setReplyTargetId(null);
                                setReplyTargetNickname("");
                            }}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            답글 작성 취소
                        </button>
                    )}
                    <button
                        onClick={handleReplySubmit}
                        disabled={!newReply.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Board;