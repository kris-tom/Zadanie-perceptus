package com.perceptus.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.perceptus.model.EncryptedMessage;
import com.perceptus.model.MsgReq;
import com.perceptus.model.User;
import com.perceptus.repository.MsgRepo;
import com.perceptus.repository.UserRepo;
import com.perceptus.service.EncryptionService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/msg")
public class MessageController {

    @Autowired
    private EncryptionService encService;

    @Autowired
    private MsgRepo msgRepo;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/enc")
    public ResponseEntity<String> encrypt(@Valid @RequestBody MsgReq req, Principal principal) {
        try {
            Optional<User> optionalUser = userRepo.findByUsername(principal.getName());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(401).body("Nie znaleziono użytkownika");
            }

            String encrypted = encService.encrypt(req.getContent());
            msgRepo.save(new EncryptedMessage(encrypted, optionalUser.get()));
            
            return ResponseEntity.ok("Zaszyfrowano i zapisano");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Błąd szyfrowania");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<EncryptedMessage>> getAllEncrypted(Principal principal) {
        try {
            Optional<User> optionalUser = userRepo.findByUsername(principal.getName());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(401).build();
            }

            List<EncryptedMessage> messages = msgRepo.findAllByUser(optionalUser.get());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/decode")
    public ResponseEntity<String> decodeSingle(@RequestBody MsgReq req) {
        try {
            String decrypted = encService.decrypt(req.getContent());
            return ResponseEntity.ok(decrypted);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Błąd deszyfrowania");
        }
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(errorMessage);
    }
}