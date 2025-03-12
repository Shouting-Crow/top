package com.project.top.service.user;

import com.project.top.dto.user.UserDto;
import com.project.top.dto.user.UserRegistrationDto;
import com.project.top.dto.user.UserUpdateDto;

public interface UserService {
    public void registrationSave(UserRegistrationDto userRegistrationDto);
    public UserDto getUser(Long id);
    public void updateUser(Long id, UserUpdateDto userUpdateDto);
    public void deleteUser(Long id);
    public Long getUserIdFromLoginId(String loginId);
    public UserDto getUserByLoginId(String loginId);
}
