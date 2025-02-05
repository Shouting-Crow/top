let stompClient = null;
let token = localStorage.getItem("jwtToken") || null; // 저장된 토큰 가져오기
let chatRoomId = null; // 현재 선택한 채팅방 ID

document.addEventListener("DOMContentLoaded", function () {
    if (token) {
        // 토큰이 존재하면 자동 로그인 처리
        document.getElementById("login-container").style.display = "none";
        document.getElementById("chat-list-container").style.display = "flex";
        loadChatRooms();
    }
});

// 로그인 함수
function login() {
    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                token = data.token;
                localStorage.setItem("jwtToken", token); // JWT 토큰 저장
                document.getElementById("login-container").style.display = "none";
                document.getElementById("chat-list-container").style.display = "flex";
                loadChatRooms();
            } else {
                alert("로그인 실패");
            }
        });
}

// 채팅방 리스트 불러오기
function loadChatRooms() {
    console.log("저장된 토큰 : ", token);
    if (!token) {
        console.error("JWT 토큰이 없음. 로그인이 필요함.")
        return;
    }

    fetch("http://localhost:8080/api/chat/rooms", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {  // 기타 오류 처리
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            return response.text();  // JSON을 파싱하기 전에 응답 확인
        })
        .then(text => {
            if (!text) {
                console.log("서버에서 빈 응답을 받음.");
                return;
            }
            return JSON.parse(text);  // JSON 파싱
        })
        .then(chatRooms => {
            if (!chatRooms) return; // 채팅방 목록이 없으면 처리 중단

            const chatRoomList = document.getElementById("chat-room-list");
            chatRoomList.innerHTML = "";

            chatRooms.forEach(room => {
                const button = document.createElement("button");
                button.className = "chat-room-button";
                button.textContent = room.chatRoomName || "이름 없음";
                button.onclick = () => enterChatRoom(room.chatRoomId, room.chatRoomName);
                chatRoomList.appendChild(button);
            });
        })
        .catch(error => {
            console.error("채팅방 목록 로드 실패:", error);
            alert(error.message);
        });
}

// 채팅방 입장
function enterChatRoom(id, name) {
    chatRoomId = id;
    document.getElementById("chat-list-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
    document.getElementById("chat-room-title").textContent = name;
    connectWebSocket();
}

// 웹소켓 연결
function connectWebSocket() {
    if (!token) {
        console("JWT 토큰이 존재하지 않아 WebSocket 연결이 실패.");
        return;
    }

    const socket = new SockJS(`http://localhost:8080/ws/chat`);
    stompClient = Stomp.over(socket);

    stompClient.connect({ Authorization: `Bearer ${token}`}, function (frame) {
        console.log("웹 소켓 연결 성공:", frame);

        // 특정 채팅방 구독
        stompClient.subscribe(`/topic/chat/${chatRoomId}`, function (message) {
            const chatMessage = JSON.parse(message.body);
            displayMessage(chatMessage);
        });

        // 연결 종료 시 재연결 시도
        stompClient.onclose = function () {
            console.log("WebSocket 연결 종료. 재연결 시도.");
            setTimeout(connectWebSocket, 5000);
        };
    }, function (error) {
        console.error("웹 소켓 연결 실패:", error);
    });
}

// 메시지 전송
function sendMessage() {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value.trim();

    if (message && stompClient) {
        const chatMessage = {
            chatRoomId: chatRoomId,
            senderId: getCurrentUserId(),
            message: message
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = "";
    }
}

// 메시지 출력
function displayMessage(chatMessage) {
    const messageContainer = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.textContent = `[${chatMessage.senderId}] ${chatMessage.message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// 채팅방 리스트로 돌아가기
function backToChatList() {
    document.getElementById("chat-container").style.display = "none";
    document.getElementById("chat-list-container").style.display = "flex";
}

// 로그아웃
function logout() {
    localStorage.removeItem("jwtToken"); // 토큰 삭제
    token = null;
    chatRoomId = null;
    document.getElementById("chat-container").style.display = "none";
    document.getElementById("chat-list-container").style.display = "none";
    document.getElementById("login-container").style.display = "flex";
}

//현재 사용자 번호 가져오기
function getCurrentUserId() {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
}