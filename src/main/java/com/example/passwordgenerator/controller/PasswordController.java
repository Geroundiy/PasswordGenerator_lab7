package com.example.passwordgenerator.controller;

import com.example.passwordgenerator.dto.PasswordGenerationRequest;
import com.example.passwordgenerator.entity.Password;
import com.example.passwordgenerator.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passwords")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @GetMapping(value = "/generate", produces = "text/plain;charset=UTF-8")
    public ResponseEntity<String> generatePassword(
            @RequestParam int length,
            @RequestParam int complexity,
            @RequestParam String owner) {
        try {
            String password = passwordService.generatePassword(length, complexity, owner);
            String response = "Пароль для " + owner + ": " + password;
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/generate/bulk")
    public ResponseEntity<List<String>> generatePasswordsBulk(
            @RequestBody List<PasswordGenerationRequest> requests) {
        try {
            List<String> passwords = passwordService.generatePasswordsBulk(requests);
            return ResponseEntity.ok(passwords);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Password> updatePassword(@RequestBody Password password) {
        try {
            Password updated = passwordService.update(password);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Password>> getAllPasswords() {
        List<Password> passwords = passwordService.findAll();
        return ResponseEntity.ok(passwords); // Убедимся, что возвращается чистый список
    }

    @GetMapping("/{id}")
    public ResponseEntity<Password> getPasswordById(@PathVariable Long id) {
        return passwordService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassword(@PathVariable Long id) {
        passwordService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}