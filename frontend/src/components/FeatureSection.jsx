function FeatureSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold text-blue-600">프로젝트 모집</h3>
                    <p className="text-gray-600 mt-2">다양한 프로젝트를 모집하고 참여하세요.</p>
                </div>
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold text-blue-600">커뮤니티</h3>
                    <p className="text-gray-600 mt-2">게시판을 통해 자유롭게 소통하세요.</p>
                </div>
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold text-blue-600">쪽지 및 채팅</h3>
                    <p className="text-gray-600 mt-2">실시간 채팅과 쪽지 기능을 제공합니다.</p>
                </div>
            </div>
        </section>
    );
}

export default FeatureSection;