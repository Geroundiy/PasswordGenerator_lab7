package com.example.passwordgenerator.controller;

import com.example.passwordgenerator.dto.PasswordGenerationRequest;
import com.example.passwordgenerator.entity.Password;
import com.example.passwordgenerator.service.PasswordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PasswordControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private PasswordController passwordController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(passwordController).build();
    }

    @Test
    public void testGeneratePassword() throws Exception {
        int length = 8;
        int complexity = 1;
        String owner = "user1";
        String generatedPassword = "password1";

        when(passwordService.generatePassword(length, complexity, owner)).thenReturn(generatedPassword);

        mockMvc.perform(get("/passwords/generate")
                        .param("length", String.valueOf(length))
                        .param("complexity", String.valueOf(complexity))
                        .param("owner", owner)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isOk())
                .andExpect(content().string("Пароль для " + owner + ": " + generatedPassword));

        verify(passwordService).generatePassword(length, complexity, owner);
    }

    @Test
    public void testGeneratePasswordsBulk() throws Exception {
        String requestJson = "[{\"length\":8, \"complexity\":1, \"owner\":\"user1\"}]";
        List<String> generatedPasswords = List.of("password1");

        when(passwordService.generatePasswordsBulk(any(List.class))).thenReturn(generatedPasswords);

        mockMvc.perform(post("/passwords/generate/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("password1"));

        verify(passwordService).generatePasswordsBulk(any(List.class));
    }

    @Test
    public void testUpdateNotFound() throws Exception {
        String requestJson = "{\"id\":999, \"password\":\"password1\", \"owner\":\"user1\"}";

        when(passwordService.update(any(Password.class))).thenThrow(new IllegalArgumentException("Password not found"));

        mockMvc.perform(put("/passwords/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isNotFound());

        verify(passwordService).update(any(Password.class));
    }

    @Test
    public void testGeneratePasswordInvalidLength() throws Exception {
        int length = 2;
        int complexity = 1;
        String owner = "user1";

        when(passwordService.generatePassword(length, complexity, owner))
                .thenThrow(new IllegalArgumentException("Длина пароля должна быть от 4 до 30 символов."));

        mockMvc.perform(get("/passwords/generate")
                        .param("length", String.valueOf(length))
                        .param("complexity", String.valueOf(complexity))
                        .param("owner", owner)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Длина пароля должна быть от 4 до 30 символов."));

        verify(passwordService).generatePassword(length, complexity, owner);
    }

    @Test
    public void testGetPasswordById() throws Exception {
        Long id = 1L;
        Password password = new Password("password1", "user1");
        password.setId(id);

        when(passwordService.findById(id)).thenReturn(Optional.of(password));

        mockMvc.perform(get("/passwords/{id}", id)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.password").value("password1"))
                .andExpect(jsonPath("$.owner").value("user1"));

        verify(passwordService).findById(id);
    }

    @Test
    public void testGetPasswordByIdNotFound() throws Exception {
        Long id = 999L;

        when(passwordService.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/passwords/{id}", id)
                        .characterEncoding("UTF-8"))
                .andExpect(status().isNotFound());

        verify(passwordService).findById(id);
    }
}