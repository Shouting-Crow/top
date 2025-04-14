import { useEffect, useState, useCallback } from "react";
import MessageContext from "./MessageContext";

const MessageProvider = ({ children }) => {
    const [unreadMessages, setUnreadMessages] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await fetch("/api/messages/unread-count", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const count = await response.json();
                setUnreadMessages(count);
            }
        } catch (error) {
            console.error("쪽지 수 불러오기 실패:", error);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    return (
        <MessageContext.Provider value={{ unreadMessages, fetchUnreadCount }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;