package com.example.backend.controller;

import com.example.backend.Service.notification.NotificationService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Notification;
import com.example.backend.request.NotificationRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse> getNotifications() {
        try {
            List<Notification> notification = notificationService.getNotifications();
            return ResponseEntity.ok(new ApiResponse(true, "Liste des notifications trouvées", notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    @PostMapping
    public ResponseEntity<ApiResponse> createNotification(@RequestBody NotificationRequest request) {
        try {
            Notification notification = notificationService.creerNotification(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(
                    true, "Notification créée avec succès", notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateNotification(@RequestBody NotificationRequest request, @PathVariable Long id) {
        try {
            Notification notification = notificationService.modifierNotification(request, id);
            return ResponseEntity.ok(new ApiResponse(true, "Notification mise à jour", notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getNotification(@PathVariable Long id) {
        try {
            Notification notification = notificationService.getNotification(id);
            return ResponseEntity.ok(new ApiResponse(true, "Notification trouvée", notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.supprimerNotification(id);
            return ResponseEntity.ok(new ApiResponse(true, "Notification supprimée", id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    @GetMapping("/client/{id}")
    public ResponseEntity<ApiResponse> getNotificationByClient(@PathVariable Long id) {
        try {
            List<Notification> notification = notificationService.getNotificationsByClient(id);
            return ResponseEntity.ok(new ApiResponse(true, "Liste des notifications :", notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    @GetMapping("/read/{id}")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse(true, "Notification lu ",null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}
