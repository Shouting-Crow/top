package com.project.top.service.basePost;

import com.project.top.domain.BasePost;
import com.project.top.dto.basePost.BasePostMyListDto;
import com.project.top.repository.BasePostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BasePostServiceImpl implements BasePostService {

    private final BasePostRepository basePostRepository;

    @Override
    @Transactional
    public void updateExpired() {
        LocalDate now = LocalDate.now();
        List<BasePost> expiredPosts = basePostRepository.findByDueDateBeforeAndIsInactiveFalse(now);

        for (BasePost basePost : expiredPosts) {
            log.info("마감 공고된 BasePost ID : {}", basePost.getId());
            basePost.setInactive(true);
        }
    }

    @Override
    public BasePost getBasePostById(Long basePostId) {
        return basePostRepository.findById(basePostId)
                .orElseThrow(() -> new IllegalArgumentException("해당 모집 공고를 찾을 수 없습니다."));
    }

    @Override
    public List<BasePostMyListDto> getMyBasePosts(Long userId) {
        List<BasePost> basePosts = basePostRepository.findByCreatorIdAndHasGroupIsFalseOrderByCreatedDateTimeDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("등록한 모집 공고를 찾을 수 없습니다."));

        return basePosts.stream()
                .map(BasePostMyListDto::basePostMyListFromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void increaseView(Long basePostId) {
        BasePost basePost = basePostRepository.findById(basePostId)
                .orElseThrow(() -> new IllegalArgumentException("해당 공고를 찾을 수 없습니다."));

        basePost.incrementViews();
        basePostRepository.save(basePost);
    }

    @Override
    @Transactional
    public void deleteBasePost(Long basePostId, Long userId) {
        BasePost basePost = basePostRepository.findById(basePostId)
                .orElseThrow(() -> new EntityNotFoundException("공고를 찾을 수 없습니다."));

        if (!basePost.getCreator().getId().equals(userId)) {
            throw new SecurityException("공고를 삭제할 권한이 없습니다.");
        }

        basePostRepository.delete(basePost);
    }
}
