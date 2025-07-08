package com.project.top.service.user;

import com.project.top.dto.user.UserDto;
import com.project.top.dto.user.UserRegistrationDto;
import com.project.top.dto.user.UserUpdateDto;

public interface UserService {
    void registrationSave(UserRegistrationDto userRegistrationDto);
    UserDto getUser(Long id);
    void updateUser(Long id, UserUpdateDto userUpdateDto);
    void deleteUser(Long id);
    Long getUserIdFromLoginId(String loginId);
    UserDto getUserByLoginId(String loginId);
    boolean existsByEmail(String email);
    void validateLoginIdAndEmail(String loginId, String email);
    boolean isNicknameDuplicate(String nickname);
    boolean isLoginIdDuplicate(String loginId);

}
