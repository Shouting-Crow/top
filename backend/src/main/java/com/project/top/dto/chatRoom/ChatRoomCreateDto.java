package com.project.top.dto.chatRoom;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRoomCreateDto {
    @NotNull(message = "그룹 ID는 필수입니다.")
    private Long groupId;

    @NotNull(message = "생성자 ID는 필수입니다.")
    private Long creatorId;

    @NotBlank(message = "채팅방 이름을 입력해야 합니다.")
    private String chatRoomName;
}
