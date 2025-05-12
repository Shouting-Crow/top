package com.project.top.service.basePost;

import com.project.top.domain.BasePost;
import com.project.top.dto.basePost.BasePostMyListDto;

import java.util.List;

public interface BasePostService {
    void updateExpired();
    BasePost getBasePostById(Long basePostId);
    List<BasePostMyListDto> getMyBasePosts(Long userId);
}
