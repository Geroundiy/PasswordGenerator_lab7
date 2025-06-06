package com.example.passwordgenerator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Отключаем CSRF для упрощения тестирования
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/passwords/**", "/api/**").permitAll() // Разрешаем доступ к эндпоинтам паролей
                        .anyRequest().authenticated() // Остальные запросы требуют аутентификацию (можно убрать для тестов)
                );
        return http.build();
    }
}