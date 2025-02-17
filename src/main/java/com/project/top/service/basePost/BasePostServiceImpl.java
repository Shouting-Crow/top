package com.project.top.service.basePost;

import com.project.top.domain.BasePost;
import com.project.top.repository.BasePostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BasePostServiceImpl implements BasePostService {

    private final BasePostRepository basePostRepository;

    @Override
    @Transactional
    public void updateExpired() {
        LocalDateTime now = LocalDateTime.now();
        List<BasePost> expiredPosts = basePostRepository.findByDueDateBeforeAndIsInactiveFalse(now);

        for (BasePost basePost : expiredPosts) {
            log.info("마감 공고된 BasePost ID : {}", basePost.getId());
            basePost.setInactive(true);
        }
    }
}
