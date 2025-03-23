import React from "react";

const MessageModal = ({ message, onClose, onDelete, onReply }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50">

                {/* 닫기 버튼 */}
                <button className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                        onClick={onClose}>
                    ✖
                </button>

                {/* 보낸 사람 정보 */}
                <h2 className="text-lg font-semibold mb-2">보낸 사람: <span className="font-bold">{message.senderName}</span></h2>

                {/* 쪽지 내용 */}
                <p className="bg-gray-100 p-4 rounded-md text-gray-800">{message.content}</p>

                <div className="flex justify-between mt-4">
                    <button onClick={onReply} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        답장쓰기
                    </button>
                    <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        삭제하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;