package com.project.top.service.login;

import com.project.top.dto.login.LoginDto;
import com.project.top.dto.login.LoginResponseDto;

public interface LoginService {
    LoginResponseDto login(LoginDto loginDto);
}
