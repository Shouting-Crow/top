let stompClient = null;
let token = localStorage.getItem("jwtToken") || null; // 저장된 토큰 가져오기
let chatRoomId = null; // 현재 선택한 채팅방 ID

document.addEventListener("DOMContentLoaded", function () {
    if (token) {
        // 토큰이 존재하면 자동 로그인 처리
        document.getElementById("login-container").style.display = "none";
        document.getElementById("group-list-container").style.display = "flex";
        document.getElementById("chat-list-container").style.display = "flex";
        loadGroupList();
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
                document.getElementById("group-list-container").style.display = "flex";

                loadChatRooms();
                loadGroupList();
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

// 그룹 리스트 로드
async function loadGroupList() {
    console.log("그룹 리스트 요청 시작")

    try {
        const response = await fetch(`/api/groups/my-groups`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("✅ 그룹 리스트 응답 수신:", response);

        if (!response.ok) throw new Error("그룹 리스트를 불러오는데 실패했습니다.");

        const groups = await response.json();
        console.log("✅ 받은 그룹 리스트:", groups); // 받은 데이터 출력

        const groupList = document.getElementById("group-list");
        groupList.innerHTML = "";

        groups.forEach(group => {
            const listItem = document.createElement("li");
            listItem.classList.add("group-item");

            const groupName = document.createElement("span");
            groupName.textContent = `${group.name} (${group.type})`;

            const viewMembersButton = document.createElement("button");
            viewMembersButton.textContent = "그룹원 보기";
            viewMembersButton.onclick = () => {
                window.location.href = `group-members.html?groupId=${group.id}`;
            };

            const leaveButton = document.createElement("button");
            leaveButton.classList.add("leave-btn");
            leaveButton.textContent = "탈퇴";
            leaveButton.onclick = () => leaveGroup(group.id, group.name);

            listItem.appendChild(groupName);
            listItem.appendChild(viewMembersButton);
            listItem.appendChild(leaveButton);
            groupList.appendChild(listItem);
        });
    } catch (error) {
        console.error("그룹 리스트 로드 오류 : ", error);
        alert("그룹 리스트를 불러오는 데 문제가 발생했습니다.");
    }
}

// 그룹 탈퇴 요청
async function leaveGroup(groupId, groupName) {
    if (!confirm(`정말로 '${groupName}' 그룹을 탈퇴하시겠습니까?`)) return;

    try {
        const response = await fetch(`/api/groups/${groupId}/leave`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        alert("그룹을 성공적으로 탈퇴했습니다.");
        loadGroupList();
        loadChatRooms();
    } catch (error) {
        console.error("그룹 탈퇴 오류: ", error);
        alert("그룹 탈퇴 중 문제가 발생했습니다.");
    }
}

// 채팅방 입장
function enterChatRoom(id, name) {
    chatRoomId = id;
    document.getElementById("chat-list-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
    document.getElementById("chat-room-title").textContent = name;

    loadChatMessages();
    connectWebSocket();
}

// 웹소켓 연결
function connectWebSocket() {
    if (!token) {
        console("JWT 토큰이 존재하지 않아 WebSocket 연결이 실패.");
        return;
    }

    const socket = new SockJS(`http://localhost:8080/ws/chat?token=${token}`);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
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

    let senderName = chatMessage.senderName === "[시스템]" ? "시스템" : chatMessage.senderName;

    messageElement.textContent = `[${senderName}] ${chatMessage.message}`;
    messageContainer.appendChild(messageElement);

    if (messageContainer.children.length > 100) {
        messageContainer.removeChild(messageContainer.firstChild);
    }

    scrollToBottom();
}

//채팅방 입장 시 저장된 채팅 메시지 불러오기
async function loadChatMessages() {
    if (!chatRoomId) {
        console.error("chatRoomId가 설정되지 않은 상태.");
        return;
    }

    try {
        const response = await fetch(`/api/chat/rooms/${chatRoomId}/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("접근 권한이 없습니다. 해당 채팅방의 맴버가 아닙니다.");
            }
            throw new Error(`서버 응답 오류 : ${response.status}`);
        }

        const messages = await response.json();
        messages.reverse();
        messages.forEach(displayMessage);
        scrollToBottom();
    } catch (error) {
        console.error("이전 메시지를 불러오는 중 오류 발생 : ", error);
    }
}

//채팅방 스크롤을 최하단으로 이동
function scrollToBottom() {
    const messageContainer = document.getElementById("chat-messages");
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
    return Number(payload.sub);
}