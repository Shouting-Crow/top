import { useNavigate } from "react-router-dom";

const ProjectOrStudyClick = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto mt-16">
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    어떤 모집 공고를 찾고 계신가요?
                </h2>
            </div>

            <div className="flex w-full h-56 rounded-xl overflow-hidden border border-gray-300 shadow-md text-white text-2xl font-bold">
                <div
                    className="group flex-1 transition-all duration-500 ease-in-out bg-gray-400 hover:flex-[3] hover:cursor-pointer flex items-center justify-center"
                    onClick={() => navigate("/recruitments")}
                >
                    <span className="group-hover:scale-110 group-hover:tracking-wider transition-all duration-300">PROJECT</span>
                </div>

                <div
                    className="group flex-1 transition-all duration-500 ease-in-out bg-sky-300 hover:flex-[3] hover:cursor-pointer flex items-center justify-center"
                    onClick={() => navigate("/study-groups")}
                >
                    <span className="group-hover:scale-110 group-hover:tracking-wider transition-all duration-300">STUDY GROUP</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectOrStudyClick;
