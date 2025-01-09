package com.project.top.service;

import com.project.top.dto.UserDto;
import com.project.top.dto.UserRegistrationDto;

public interface UserService {
    public void registrationSave(UserRegistrationDto userRegistrationDto);
    public UserDto getUser(Long id);
    public void updateUser(Long id, UserDto userDto);
    public void deleteUser(Long id);
    public Long getUserIdFromLoginId(String loginId);
}
