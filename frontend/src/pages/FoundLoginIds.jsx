import {Link, useLocation, useNavigate} from "react-router-dom";
import logoImage from "../assets/top_logo_ex.jpg";
import React from "react";

const FoundLoginIds = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const loginIds = location.state?.loginIds;

    if (!loginIds) {
        alert("잘못된 접근입니다.");
        navigate("/login");
        return null;
    }

    return (
        <div className="flex flex-col items-center pt-28 p-6 min-h-screen bg-gray-50">
            <div className="flex flex-col items-center mb-6">
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                </Link>
                <h2 className="text-2xl font-bold mt-4">찾은 아이디 목록</h2>
            </div>

            {loginIds.length === 0 ? (
                <p className="text-gray-600">등록된 아이디가 없습니다.</p>
            ) : (
                <div className="w-full max-w-md bg-white border rounded shadow">
                    <table className="w-full table-auto text-center border-collapse">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-sm text-gray-600">번호</th>
                            <th className="border px-4 py-2 text-sm text-gray-600">아이디</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loginIds.map((idObj, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2 font-semibold text-gray-800">{idObj.maskedLoginId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button
                className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate("/login")}
            >
                로그인하러 가기
            </button>
        </div>
    );
};

export default FoundLoginIds;