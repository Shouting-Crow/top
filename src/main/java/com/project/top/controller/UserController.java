package com.project.top.controller;

import com.project.top.dto.user.EmailCheckDto;
import com.project.top.dto.user.UserDto;
import com.project.top.dto.user.UserRegistrationDto;
import com.project.top.dto.user.UserUpdateDto;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegistrationDto dto) {
        try {
            userService.registrationSave(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable("userId") Long userId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        if (!userService.getUserIdFromLoginId(userDetails.getUsername()).equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원 조회는 자신의 정보만 조회할 수 있습니다.");
        }
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
            @Valid @RequestBody UserUpdateDto userUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!userService.getUserIdFromLoginId(userDetails.getUsername()).equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("정보에 접근할 권한이 없습니다.");
        }

        try {
            userService.updateUser(userId, userUpdateDto);
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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            UserDto userDto = userService.getUserByLoginId(userDetails.getUsername());

            return ResponseEntity.ok(userDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestBody EmailCheckDto emailCheckDto) {
        boolean exists = userService.existsByEmail(emailCheckDto.getEmail());

        if (exists) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 이메일로 가입한 이력이 없습니다.");
        }
    }

}
