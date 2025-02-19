package com.project.top.service.basePost;

import com.project.top.domain.BasePost;

public interface BasePostService {
    void updateExpired();
    BasePost getBasePostById(Long basePostId);
}
