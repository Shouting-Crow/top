import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <section className="bg-blue-100 text-center py-20 relative">
            <h2 className="text-4xl font-bold text-blue-700">
                프로젝트를 함께할 팀원을 모집하세요!
            </h2>
            <p className="text-gray-700 mt-4">
                다양한 프로젝트와 스터디 그룹을 찾고, 지원할 수 있습니다.
            </p>
            <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setIsModalOpen(true)}
            >
                모집 공고 보기
            </button>

            {/*모달창*/}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 함
                    >
                        <h3 className="text-xl font-semibold mb-4">어떤 모집 공고를 찾으시나요?</h3>
                        <div className="flex gap-4">
                            <button
                                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                onClick={() => navigate("/recruitments")}
                            >
                                프로젝트 모집
                            </button>
                            <button
                                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                onClick={() => navigate("/study-groups")}
                            >
                                스터디 그룹 모집
                            </button>
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                            onClick={() => setIsModalOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default HeroSection;