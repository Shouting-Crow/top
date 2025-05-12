package com.project.top.verification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class EmailAuthObject {
    private String code;
    private LocalDateTime issuedTime;
}
