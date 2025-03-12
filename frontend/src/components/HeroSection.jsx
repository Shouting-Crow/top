function HeroSection() {
    return (
        <section className="bg-blue-100 text-center py-20">
            <h2 className="text-4xl font-bold text-blue-700">
                프로젝트를 함께할 팀원을 모집하세요!
            </h2>
            <p className="text-gray-700 mt-4">
                다양한 프로젝트와 스터디 그룹을 찾고, 지원할 수 있습니다.
            </p>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                모집 공고 보기
            </button>
        </section>
    );
}

export default HeroSection;