package com.project.top.controller;

import com.project.top.domain.Schedule;
import com.project.top.domain.User;
import com.project.top.dto.schedule.*;
import com.project.top.service.schedule.ScheduleService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ScheduleCreateDto scheduleCreateDto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            scheduleCreateDto.setWriterId(userId);

            Long resultId = scheduleService.createSchedule(scheduleCreateDto);

            return ResponseEntity.ok(resultId);
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/detail/{groupId}")
    public ResponseEntity<?> getSchedulesOnDetail(@PathVariable Long groupId,
                                                  @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<ScheduleDetailDto> schedules = scheduleService.getSchedulesOnDetail(groupId, date);

            return ResponseEntity.ok(schedules);
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/total/{groupId}")
    public ResponseEntity<?> getSchedules(@PathVariable Long groupId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<SchedulesDto> schedules = scheduleService.getSchedules(groupId);

            return ResponseEntity.ok(schedules);
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateSchedule(@RequestBody ScheduleUpdateDto scheduleUpdateDto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long writerId = userService.getUserIdFromLoginId(userDetails.getUsername());

            if (!Objects.equals(scheduleUpdateDto.getWriterId(), writerId)) {
                return ResponseEntity.badRequest().body("일정 등록자가 아닙니다.");
            }

            scheduleService.updateSchedule(scheduleUpdateDto);

            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteSchedule(@RequestBody ScheduleDeleteDto scheduleDeleteDto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            if (!Objects.equals(scheduleDeleteDto.getWriterId(), userId)) {
                return ResponseEntity.badRequest().body("일정 등록자가 아닙니다.");
            }

            scheduleService.deleteSchedule(scheduleDeleteDto);

            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
