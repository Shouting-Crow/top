import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) return;

            try {
                const response = await fetch("/api/applications/my-list", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    alert("지원 내역을 불러오지 못했습니다.");
                }
            } catch (error) {
                console.error("에러 발생:", error);
                alert("서버 오류가 발생했습니다.");
            }
        };

        fetchApplications();
    }, []);

    const statusToText = (status) => {
        switch (status) {
            case "PENDING": return "대기";
            case "APPROVED": return "승인";
            case "REJECTED": return "거부";
            default: return "";
        }
    };

    const handleTitleClick = (application) => {
        if (!application.inactive) {
            const path = application.postType === "RECRUITMENT"
                ? `/recruitment/${application.basePostId}`
                : `/study-group/${application.basePostId}`;
            navigate(path);
        }
    };

    return (
        <div className="min-h-screen bg-gray-300 flex flex-col items-center p-10 pt-24">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">내 지원 현황</h2>

                <table className="w-full text-center border-collapse">
                    <thead>
                    <tr className="bg-gray-300">
                        <th className="border px-4 py-2">타입</th>
                        <th className="border px-4 py-2">공고 제목</th>
                        <th className="border px-4 py-2">지원일</th>
                        <th className="border px-4 py-2">승인여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((app, idx) => (
                        <tr
                            key={idx}
                            className={`${app.status === "REJECTED" ? "bg-red-200" : app.inactive ? "bg-gray-200" : ""}`}
                        >
                            <td className="border px-4 py-2">{app.postType === "RECRUITMENT" ? "프로젝트" : "스터디그룹"}</td>
                            <td
                                className={`border px-4 py-2 text-blue-700 hover:underline ${app.inactive ? "cursor-not-allowed text-gray-500" : "cursor-pointer"}`}
                                onClick={() => handleTitleClick(app)}
                            >
                                {app.recruitmentTitle}
                            </td>
                            <td className="border px-4 py-2">{new Date(app.applyDateTime).toLocaleDateString().slice(2)}</td>
                            <td className="border px-4 py-2 font-semibold">{statusToText(app.status)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyApplicationList;
