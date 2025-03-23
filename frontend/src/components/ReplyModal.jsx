import React, { useState } from "react";

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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">📩 쪽지 보내기</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✖</button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">받는 사람:</label>
                    <input type="text" value={recipient} readOnly className="w-full px-3 py-2 border rounded bg-gray-200 cursor-not-allowed" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">쪽지 내용:</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded resize-none h-24"
                        placeholder="답장할 내용을 입력하세요."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>취소하기</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSendMessage}>전송하기</button>
                </div>
            </div>
        </div>
    );
};

export default ReplyModal;