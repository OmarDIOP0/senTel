package com.example.backend.Service.notification;

import com.example.backend.model.Notification;
import com.example.backend.request.NotificationRequest;

import java.util.List;

public interface INotificationService {
    Notification creerNotification(NotificationRequest request);
    Notification modifierNotification(NotificationRequest request , Long id);
    Notification getNotification(Long id);
    void supprimerNotification(Long id);
    List<Notification> getNotificationsByClient(Long clientId);
    void markAsRead(Long id);
}
