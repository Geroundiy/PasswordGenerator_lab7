package com.example.passwordgenerator.aspect;

import com.example.passwordgenerator.service.PasswordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;

public class LoggingAspectTest {

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private LoggingAspect loggingAspect;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoggingAspectForGeneratePassword() {
        when(passwordService.generatePassword(8, 2, "testUser")).thenReturn("testPass");
        passwordService.generatePassword(8, 2, "testUser");
        verify(passwordService, times(1)).generatePassword(8, 2, "testUser");
    }
}