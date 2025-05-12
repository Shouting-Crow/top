package com.project.top.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MaskedLoginIdDto {
    private String maskedLoginId;

    public MaskedLoginIdDto(String userId) {
        this.maskedLoginId = maskUserId(userId);
    }

    private String maskUserId(String userId) {
        if (userId == null || userId.isEmpty()) return "";

        if (userId.length() <= 4) {
            return userId.charAt(0) + "***";
        }

        return userId.subSequence(0, userId.length() - 4) + "****";
    }
}
