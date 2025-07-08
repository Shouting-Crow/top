import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { FaRegComment, FaReply } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        increaseView();
    }, []);

    useEffect(() => {
        fetchBoardDetail();
        fetchLoginUser();
    }, [page]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            {/* 타이틀 및 돌아가기 버튼 */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => navigate(fromMyBoards ? "/my-boards" : "/boards")}
                >
                    <FaArrowLeft className="text-xl" />
                </div>

                {/* 드롭다운 메뉴 */}
                {loginId === board.author.loginId && (
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-600 hover:text-black">
                            <FiSettings className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                                <button
                                    onClick={handleEdit}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    수정하기
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    삭제하기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 제목 */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                [{board.category.name}] {board.title}
            </h2>

            {/* 작성 정보 (1/3씩 grid로 배치) */}
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700">작성자</span>
                    <span>{board.author.nickname}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700">작성일</span>
                    <span>{new Date(board.createdAt).toLocaleString("ko-KR")}</span>
                </div>
                <div className="flex items-center gap-1">
                    <IoMdEye />
                    <span>{board.views}</span>
                </div>
            </div>

            {/* 본문 */}
            <div className="border rounded-md p-6 bg-white min-h-[500px] whitespace-pre-wrap shadow-sm mb-6">
                {board.content}
            </div>

            {/* 댓글 목록 */}
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaRegComment className="text-blue-600" />
                    댓글 {board.replyCount}개
                </h3>

                {replies.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">댓글이 없습니다.</p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {/* 부모 댓글 */}
                        {replies.filter((r) => r.parentReplyId === null).map((parent) => (
                            <div key={parent.id} className="border rounded px-4 py-3 flex flex-col hover:bg-gray-50">
                                {editingReplyId === parent.id ? (
                                    <>
                                        <textarea
                                          className="w-full border rounded p-2 text-sm resize-none"
                                          value={editedContent}
                                          onChange={(e) => setEditedContent(e.target.value)}
                                          rows={3}
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={handleUpdateReply} className="bg-green-500 text-white px-3 py-1 rounded">
                                                수정 완료
                                            </button>
                                            <button onClick={handleCancelEdit} className="bg-gray-300 px-3 py-1 rounded">
                                                취소
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-wrap items-start justify-between w-full gap-y-1" onClick={() => handleReplyBoxClick(parent.id, parent.authorNickname)}>
                                        <div className="flex items-start gap-2 flex-1 flex-wrap">
                                            <span className="min-w-[70px] text-sm text-gray-600 break-keep">{parent.authorNickname}</span>
                                            <span className="text-sm text-gray-800 break-words">{parent.content}</span>
                                        </div>
                                        <div className="flex items-center gap-2 whitespace-nowrap text-xs ml-2">
                                        <span className="text-gray-500">
                                            {formatDistanceToNow(new Date(parent.createdAt), { addSuffix: true, locale: ko })}
                                            {parent.edited && <span className="ml-1">(수정됨)</span>}
                                        </span>
                                            {loginUser && (
                                                <>
                                                    {loginUser.id === parent.authorId && (
                                                        <button className="text-blue-600" onClick={(e) => { e.stopPropagation(); handleEditClick(parent); }}>
                                                            수정
                                                        </button>
                                                    )}
                                                    {(loginUser.id === parent.authorId || loginUser.id === board.author.id) && (
                                                        <button className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteReply(parent.id); }}>
                                                            삭제
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 대댓글 */}
                                {replies.filter((child) => child.parentReplyId === parent.id).map((child) => (
                                    <div key={child.id} className="bg-gray-100 rounded px-4 py-2 mt-2 ml-6">
                                        {editingReplyId === child.id ? (
                                            <>
                                                <textarea
                                                  className="w-full border rounded p-2 text-sm resize-none"
                                                  value={editedContent}
                                                  onChange={(e) => setEditedContent(e.target.value)}
                                                  rows={3}
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleUpdateReply} className="bg-green-500 text-white px-3 py-1 rounded">
                                                        수정 완료
                                                    </button>
                                                    <button onClick={handleCancelEdit} className="bg-gray-300 px-3 py-1 rounded">
                                                        취소
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-wrap items-start justify-between w-full gap-y-1" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-start gap-2 flex-1 flex-wrap">
                                                    <FaReply className="text-gray-500 mt-[2px]" />
                                                    <span className="min-w-[70px] text-sm text-gray-600 break-keep">{child.authorNickname}</span>
                                                    <span className="text-sm text-gray-800 break-words">{child.content}</span>
                                                </div>
                                                <div className="flex items-center gap-2 whitespace-nowrap text-xs ml-2">
                                                <span className="text-gray-500">
                                                    {formatDistanceToNow(new Date(child.createdAt), { addSuffix: true, locale: ko })}
                                                    {child.edited && <span className="ml-1">(수정됨)</span>}
                                                </span>
                                                    {loginUser && (
                                                        <>
                                                            {loginUser.id === child.authorId && (
                                                                <button className="text-blue-600" onClick={(e) => { e.stopPropagation(); handleEditClick(child); }}>
                                                                    수정
                                                                </button>
                                                            )}
                                                            {(loginUser.id === child.authorId || loginUser.id === board.author.id) && (
                                                                <button className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteReply(child.id); }}>
                                                                    삭제
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* 페이지네이션 */}
                <div className="flex justify-center items-center mt-6 gap-2">
                    {/* 이전 버튼 */}
                    <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                    >
                        &lt;
                    </button>

                    {/* 페이지 번호 (5개씩 표현) */}
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
                                            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                    {/* 다음 버튼 */}
                    <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                    >
                        &gt;
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