package com.perceptus.controller;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.perceptus.model.AuthRequest;
import com.perceptus.model.User;
import com.perceptus.repository.UserRepo;
import com.perceptus.service.JwtService;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")

public class AuthController {
	@Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody AuthRequest request) {
    if(userRepo.findByUsername(request.getUsername()).isPresent()) {
    	return ResponseEntity.badRequest().body("Użytkownik już istnieje!");
    }
    User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()));
    userRepo.save(user);
    return ResponseEntity.ok("Zarejestrowano pomyślnie");
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody AuthRequest request) {
        User user = userRepo.findByUsername(request.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Błędny login lub hasło");
        }
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(token); 
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(errorMessage);
    }
}

