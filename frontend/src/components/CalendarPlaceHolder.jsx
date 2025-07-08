import { useState, useEffect } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isToday
} from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { FaPlus, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const CalendarPlaceholder = ({ groupId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allSchedules, setAllSchedules] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [scheduleDetails, setScheduleDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [myUserId, setMyUserId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const getColor = (index) => {
        const colors = [
            "bg-red-200", "bg-yellow-200", "bg-green-200"
        ];
        return colors[index % colors.length];
    };

    // 전체 일정 요약 불러오기
    const fetchAllSchedules = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/schedules/total/${groupId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("전체 일정 요청 실패");
            }

            const data = await response.json();
            const mapped = {};
            data.forEach((schedule) => {
                const key = schedule.date;
                if (!mapped[key]) mapped[key] = [];
                mapped[key].push(schedule.nickname);
            });
            setAllSchedules(mapped);
        } catch (err) {
            console.error("전체 일정 불러오기 실패:", err);
        }
    };

    // 달력에 일정 리프레쉬 하기
    useEffect(() => {
        fetchAllSchedules();
    }, [currentDate, groupId]);

    // 월 이동 버튼 동작
    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // 날짜 클릭 요청
    const handleDateClick = async (date) => {
        setSelectedDate(date);
        setShowAddForm(false);
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`/api/schedules/detail/${groupId}?date=${format(date, "yyyy-MM-dd")}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("상세 일정 요청 실패");
            }

            const data = await response.json();
            setScheduleDetails(data);
            setShowModal(true);
        } catch (err) {
            console.error("상세 일정 불러오기 실패:", err);
        }
    };

    // 일정 등록
    const handleAddSchedule = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch("/api/schedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId,
                    content: newContent,
                    date: format(selectedDate, "yyyy-MM-dd"),
                })
            });

            if (!response.ok) {
                throw new Error("일정 등록 실패");
            }

            setNewContent("");
            setShowAddForm(false);

            await handleDateClick(selectedDate); //상세 일정 즉각 반영
            await fetchAllSchedules(); // 달력의 사용자 닉네임 즉각 반영
        } catch (err) {
            console.error("일정 등록 실패:", err);
        }
    };

    //내 번호 요청 부분
    useEffect(() => {
        const fetchMyInfo = async () => {
            const token = localStorage.getItem("jwtToken");
            try {
                const res = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyUserId(data.id);
                }
            } catch (err) {
                console.error("내 정보 불러오기 실패", err);
            }
        };
        fetchMyInfo();
    }, []);

    //수정 요청
    const handleUpdateSchedule = async (originalItem, newContent) => {
        try {
            const token = localStorage.getItem("jwtToken");
            const res = await fetch("/api/schedules", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId,
                    writerId: myUserId,
                    content: newContent,
                    date: format(selectedDate, "yyyy-MM-dd")
                })
            });
            if (!res.ok) throw new Error("수정 실패");
            await handleDateClick(selectedDate);
            await fetchAllSchedules();
        } catch (err) {
            console.error("일정 수정 실패:", err);
        }
    };

    //삭제 요청
    const handleDeleteSchedule = async (writerId) => {
        try {
            const token = localStorage.getItem("jwtToken");

            const res = await fetch("/api/schedules", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId,
                    writerId,
                    date: format(selectedDate, "yyyy-MM-dd")
                })
            });

            if (!res.ok) throw new Error("삭제 실패");

            await handleDateClick(selectedDate);  // 상세 리스트 갱신
            await fetchAllSchedules();           // 달력 닉네임 갱신
        } catch (err) {
            console.error("일정 삭제 실패:", err);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow">
            {/* 년도 월 표시 */}
            <div className="flex justify-center items-center mb-4 gap-6">
                <button onClick={handlePrevMonth} className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200">
                    <FiChevronLeft className="text-indigo-800 text-xl" />
                </button>
                <h2 className="text-xl font-bold text-indigo-900">{format(currentDate, "yyyy년 M월")}</h2>
                <button onClick={handleNextMonth} className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200">
                    <FiChevronRight className="text-indigo-800 text-xl" />
                </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center text-sm mb-2 font-semibold">
                {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
                    <div
                        key={day}
                        className={idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-gray-600"}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 칸 */}
            <div className="grid grid-cols-7 gap-2">
                {Array(startOfMonth(currentDate).getDay()).fill(null).map((_, idx) => (
                    <div key={`empty-${idx}`} />
                ))}
                {daysInMonth.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const schedules = allSchedules[dateKey] || [];

                    return (
                        <button
                            key={day.toISOString()}
                            className="h-40 border border-gray-300 rounded-lg text-left p-2 hover:bg-gray-100 text-sm text-gray-700 relative"
                            onClick={() => handleDateClick(day)}
                        >
                            {/* 날짜 */}
                            <div className="absolute top-2 right-2 font-semibold">
                                {isToday(day) ? (
                                    <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                                        {day.getDate()}
                                    </span>
                                ) : (
                                    <span className={
                                        day.getDay() === 0 ? "text-red-500" :
                                            day.getDay() === 6 ? "text-blue-500" : "text-gray-700"
                                    }>
                                        {day.getDate()}
                                    </span>
                                )}
                            </div>

                            {/* 일정 표시 */}
                            <div className="mt-6 flex flex-col space-y-1">
                                {schedules.slice(0, 3).map((name, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-xs font-semibold text-gray-800 ${getColor(idx)} truncate`}
                                        title={name}
                                    >
                                        <span className="truncate max-w-[80%]">{name}</span>
                                        <FaRegCommentDots className="text-gray-600 text-[10px]" />
                                    </div>
                                ))}
                                {schedules.length > 3 && (
                                    <div className="text-[11px] text-gray-500 font-semibold pl-1">+ {schedules.length - 3} more</div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">

                        {/* 날짜와 버튼 */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <FaCalendarAlt className="text-indigo-700 text-lg" />
                                <h3 className="text-lg font-semibold text-indigo-800">
                                    {format(selectedDate, "yyyy년 M월 d일")} 일정
                                </h3>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => setShowAddForm(true)} title="일정 추가">
                                    <FaPlus className="text-indigo-500 hover:text-indigo-700 text-sm" />
                                </button>
                                <button onClick={() => setShowModal(false)} title="닫기">
                                    <FaTimes className="text-gray-500 hover:text-gray-700 text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* 일정 리스트 */}
                        <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
                            {scheduleDetails.length === 0 ? (
                                <div className="text-sm text-gray-400">등록된 일정이 없습니다.</div>
                            ) : (
                                scheduleDetails.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-100 rounded text-sm text-gray-700 px-3 py-2 flex items-start space-x-2"
                                    >
                                        {/* 닉네임 */}
                                        <div className="w-20 font-semibold text-indigo-800 break-words">
                                            {item.nickname}
                                        </div>

                                        {/* 일정 내용 */}
                                        <div className="flex-1 break-words">
                                            {item.content}
                                        </div>

                                        {/* 수정/삭제 버튼 */}
                                        {item.writerId === myUserId && (
                                            <div className="flex flex-row items-center space-x-1 ml-2">
                                                <button
                                                    onClick={() => {
                                                        setEditIndex(idx);
                                                        setEditedContent(item.content);
                                                    }}
                                                    className="p-1 hover:bg-blue-100 rounded"
                                                    title="수정"
                                                >
                                                    <FiEdit2 className="text-blue-600 text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSchedule(item.writerId)}
                                                    className="p-1 hover:bg-red-100 rounded"
                                                    title="삭제"
                                                >
                                                    <FiTrash2 className="text-red-600 text-sm" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 일정 추가 폼 */}
                        {(showAddForm || editIndex !== null) && (
                            <div className="mt-2">
                                <textarea
                                    className="w-full border border-gray-300 rounded p-2 text-sm"
                                    rows={3}
                                    placeholder="일정 내용을 입력하세요..."
                                    value={editIndex !== null ? editedContent : newContent}
                                    onChange={(e) =>
                                        editIndex !== null ? setEditedContent(e.target.value) : setNewContent(e.target.value)
                                    }
                                />
                                <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditIndex(null);
                                        }}
                                        className="text-sm text-gray-500"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (editIndex !== null) {
                                                await handleUpdateSchedule(scheduleDetails[editIndex], editedContent);
                                                setEditIndex(null);
                                            } else {
                                                await handleAddSchedule();
                                            }
                                        }}
                                        className="text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                                    >
                                        {editIndex !== null ? "수정" : "등록"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPlaceholder;
