package com.project.top.batch;

import com.project.top.service.basePost.BasePostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SystemBatch {

    private final BasePostService basePostService;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expireBasePosts() {
        log.info("기간이 마감된 프로젝트 및 스터디 그룹 모집 공고를 자동 처리합니다.");
        basePostService.updateExpired();
    }
}
