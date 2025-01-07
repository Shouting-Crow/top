package com.project.top.service;

import com.project.top.dto.LoginDto;
import com.project.top.dto.LoginResponseDto;

public interface LoginService {
    LoginResponseDto login(LoginDto loginDto);
}
