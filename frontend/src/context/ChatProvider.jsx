import { useCallback, useState, useEffect } from "react";
import ChatContext from "./ChatContext";

const ChatProvider = ({ children }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [chatsCount, setChatsCount] = useState(0);

    const refreshChatRoomStates = useCallback(async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch("/api/chat/rooms", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setChatRooms(data);

                const totalUnreadChats = data.reduce(
                    (acc, room) => acc + room.unreadMessageCount,
                    0
                );
                setChatsCount(totalUnreadChats);
            } else {
                console.error("채팅방 리스트 불러오기 실패");
            }
        } catch (error) {
            console.error("채팅방 새로고침 실패", error);
        }
    }, []);

    // 페이지 진입 시 자동 새로고침
    useEffect(() => {
        refreshChatRoomStates();
    }, []);

    return (
        <ChatContext.Provider
            value={{
                chatRooms,
                chatsCount,
                refreshChatRoomStates
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;