let token = localStorage.getItem("jwtToken") || null;
const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get("groupId");

document.addEventListener("DOMContentLoaded", function () {

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "index.html";
        return;
    }

    if (!groupId) {
        alert("잘못된 접근입니다.");
        window.location.href = "index.html";
        return;
    }

    // 그룹원 목록 불러오기
    loadGroupMembers(groupId);
});

// 그룹원 리스트 API 호출
async function loadGroupMembers(groupId) {
    try {
        const response = await fetch(`/api/group/${groupId}/members`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("접근 권한이 없습니다.");
            }
            throw new Error("그룹원 목록을 불러오는 데 실패했습니다.");
        }

        const members = await response.json();
        displayGroupMembers(members);
    } catch (error) {
        console.error("그룹원 목록 로드 오류:", error);
        alert(error.message);
    }
}

// 그룹원 리스트 UI 출력
function displayGroupMembers(members) {
    const membersList = document.getElementById("group-members-list");
    membersList.innerHTML = "";

    members.forEach(member => {
        const listItem = document.createElement("li");
        listItem.classList.add("member-item");

        listItem.innerHTML = `
            <span>${member.nickname}</span>
            ${member.role === "ADMIN" ? "<span class='admin-badge'>관리자</span>" : ""}
            ${member.role !== "ADMIN" ? `<button class="kick-btn" onclick="removeMember(${member.userId})">추방</button>` : ""}
        `;

        membersList.appendChild(listItem);
    });
}

// 초대 모달 표시
function showInviteModal() {
    document.getElementById("invite-modal").style.display = "block";
}

// 초대 모달 닫기
function closeInviteModal() {
    document.getElementById("invite-modal").style.display = "none";
}

// 그룹원 초대 요청
async function inviteMember() {
    const nickname = document.getElementById("invite-nickname").value.trim();
    if (!nickname) {
        alert("닉네임을 입력하세요.");
        return;
    }

    try {
        const response = await fetch(`/api/groups/${groupId}/invite`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nickname: nickname })
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("그룹 관리자만 초대할 수 있습니다.");
            }
            throw new Error("초대 실패: " + await response.text());
        }

        alert("초대가 완료되었습니다.");
        closeInviteModal();

        const membersList = document.getElementById("group-members-list");
        const listItem = document.createElement("li");
        listItem.classList.add("member-item");

        listItem.innerHTML = `
            <span>${nickname}</span>
            <span class="member-badge">초대됨</span>
        `;

        membersList.appendChild(listItem);

    } catch (error) {
        console.error("초대 실패:", error);
        alert(error.message);
    }
}

// 그룹원 추방 요청
async function removeMember(memberId) {
    if (!confirm("정말로 이 사용자를 추방하시겠습니까?")) return;

    try {
        const response = await fetch(`/api/groups/${groupId}/remove/${memberId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("그룹 관리자만 멤버를 추방할 수 있습니다.");
            }
            throw new Error("멤버 추방 실패: " + await response.text());
        }

        alert("사용자가 그룹에서 추방되었습니다.");

        const memberElement = document.querySelector(`li[data-user-id="${memberId}"]`);
        if (memberElement) {
            memberElement.remove();
        }

        window.location.href = "index.html";

    } catch (error) {
        console.error("멤버 추방 실패:", error);
        alert(error.message);
    }
}

// 뒤로가기 버튼
function goBack() {
    window.location.href = "index.html";
}
