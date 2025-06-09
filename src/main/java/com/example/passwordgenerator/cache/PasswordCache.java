package com.example.passwordgenerator.cache;

import com.example.passwordgenerator.entity.Password;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class PasswordCache {
    private final Map<String, List<Password>> passwordsCache = new HashMap<>();
    private final Map<Long, Password> passwordByIdCache = new HashMap<>();
    private final Map<String, List<Password>> passwordsByTagCache = new HashMap<>();
    private final Map<String, String> generatedPasswordsCache = new HashMap<>();
    private final Map<String, List<String>> bulkPasswordsCache = new HashMap<>();

    public Optional<List<Password>> getAllPasswords() {
        return Optional.ofNullable(passwordsCache.get("all"));
    }

    public void putAllPasswords(List<Password> passwords) {
        passwordsCache.put("all", passwords);
    }

    public Optional<Password> getPasswordById(Long id) {
        return Optional.ofNullable(passwordByIdCache.get(id));
    }

    public void putPasswordById(Long id, Password password) {
        passwordByIdCache.put(id, password);
    }

    public Optional<List<Password>> getPasswordsByTag(String tagName) {
        return Optional.ofNullable(passwordsByTagCache.get(tagName));
    }

    public void putPasswordsByTag(String tagName, List<Password> passwords) {
        passwordsByTagCache.put(tagName, passwords);
    }

    public Optional<String> getGeneratedPassword(String key) {
        return Optional.ofNullable(generatedPasswordsCache.get(key));
    }

    public void putGeneratedPassword(String key, String password) {
        generatedPasswordsCache.put(key, password);
    }

    public Optional<List<String>> getBulkPasswords(String key) {
        return Optional.ofNullable(bulkPasswordsCache.get(key));
    }

    public void putBulkPasswords(String key, List<String> passwords) {
        bulkPasswordsCache.put(key, passwords);
    }

    public void clearDatabaseCache() {
        passwordsCache.clear();
        passwordByIdCache.clear();
        passwordsByTagCache.clear();
    }

    public void clearGeneratedCache() {
        generatedPasswordsCache.clear();
        bulkPasswordsCache.clear();
    }
}