package com.example.backend.Service.notification;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Client;
import com.example.backend.model.Configuration;
import com.example.backend.model.Notification;
import com.example.backend.model.enums.Status;
import com.example.backend.repository.ClientRepo;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.NotificationRepo;
import com.example.backend.request.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepo notificationRepo;
    private final ClientRepo clientRepo;
    private final ConfigurationRepo configurationRepo;

    @Override
    public Notification creerNotification(NotificationRequest request) {
        Client client = clientRepo.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        Configuration config = configurationRepo.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException("Configuration not found"));

        Notification notification = new Notification();
        notification.setClient(client);
        notification.setConfiguration(config);
        notification.setLibelle(request.getLibelle());
        notification.setDescription(request.getDescription());
        notification.setStatus(Status.NON_LU);
        notification.setDate(java.time.LocalDateTime.now());

        return notificationRepo.save(notification);
    }

    @Override
    public Notification modifierNotification(NotificationRequest request, Long id) {
        Notification existingNotification = notificationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        existingNotification.setLibelle(request.getLibelle());
        existingNotification.setDescription(request.getDescription());
        existingNotification.setStatus(request.getStatus());

        return notificationRepo.save(existingNotification);
    }

    @Override
    public Notification getNotification(Long id) {
        return notificationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    @Override
    public void supprimerNotification(Long id) {
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notificationRepo.delete(notification);
    }

    @Override
    public List<Notification> getNotificationsByClient(Long clientId) {
        return notificationRepo.findByClientIdOrderByDateDesc(clientId);
    }

    @Override
    public void markAsRead(Long id) {
        notificationRepo.findById(id).ifPresent(notification -> {
            notification.setStatus(Status.LU);
            notificationRepo.save(notification);
        });
    }
}
