import React, { useState } from "react";
import { FiSend, FiX } from "react-icons/fi";

const ReplyModal = ({ recipient, onClose, onSend }) => {
    const [messageContent, setMessageContent] = useState("");

    const handleSendMessage = () => {
        if (!messageContent.trim()) {
            alert("쪽지 내용을 입력하세요.");
            return;
        }
        onSend(messageContent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {/* 타이틀 */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2 text-xl font-bold">
                        <FiSend className="text-gray-700" />
                        <span>쪽지 보내기</span>
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* 받는 사람 */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">
                        받는 사람:
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        readOnly
                        className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                </div>

                {/* 쪽지 내용 */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-1">
                        쪽지 내용:
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border rounded resize-none h-24 text-sm"
                        placeholder="답장할 내용을 입력하세요."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                        onClick={handleSendMessage}
                    >
                        전송하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplyModal;