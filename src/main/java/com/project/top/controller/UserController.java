package com.project.top.controller;

import com.project.top.dto.user.UserDto;
import com.project.top.dto.user.UserRegistrationDto;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDto dto) {
        try {
            userService.registrationSave(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") Long userId) {
        UserDto userDto = userService.getUser(userId);

        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable("userId") Long userId,
            @RequestBody UserDto userDto,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!userDetails.getUsername().equals(userDto.getLoginId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("정보에 접근할 권한이 없습니다.");
        }

        try {
            userService.updateUser(userId, userDto);
            return ResponseEntity.ok("회원 정보가 수정되었습니다."); //수정된 정보를 랜더링 하기 위해 DTO 전달 필요
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") Long userId,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (!userDetails.getUsername().equals(userService.getUser(userId).getLoginId())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("정보에 접근할 권한이 없습니다.");
            }

            userService.deleteUser(userId);
            return ResponseEntity.ok("회원이 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
