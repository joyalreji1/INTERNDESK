package com.interndesk.service;

import com.interndesk.entity.*;
import com.interndesk.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public Page<Notification> getNotifications(Long userId, int page, int size) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(
            userId, PageRequest.of(page, size));
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public int markAsRead(Long notificationId, Long userId) {
        return notificationRepository.markAsRead(notificationId, userId, LocalDateTime.now());
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsRead(userId, LocalDateTime.now());
    }

    @Transactional
    public void createNotification(User recipient, String title, String message,
                                   Notification.NotificationType type,
                                   Long relatedEntityId, String relatedEntityType) {
        Notification n = Notification.builder()
            .user(recipient)
            .title(title)
            .message(message)
            .notificationType(type)
            .relatedEntityId(relatedEntityId)
            .relatedEntityType(relatedEntityType)
            .isRead(false)
            .build();
        notificationRepository.save(n);
    }

    public Map<String, Object> toMap(Notification n) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", n.getId());
        m.put("title", n.getTitle());
        m.put("message", n.getMessage());
        m.put("type", n.getNotificationType().name());
        m.put("relatedEntityId", n.getRelatedEntityId());
        m.put("relatedEntityType", n.getRelatedEntityType());
        m.put("isRead", n.getIsRead());
        m.put("createdAt", n.getCreatedAt());
        m.put("readAt", n.getReadAt());
        return m;
    }
}
