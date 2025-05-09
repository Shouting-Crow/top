package com.project.top.service.user;

import com.project.top.dto.user.PasswordChangeDto;

public interface PasswordChangeService {
    void changePassword(PasswordChangeDto dto);
}
