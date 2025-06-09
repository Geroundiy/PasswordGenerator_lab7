package com.example.passwordgenerator.service;

import com.example.passwordgenerator.counter.RequestCounter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CounterServiceTest {

    private CounterService counterService;

    @BeforeEach
    public void setUp() {
        counterService = new CounterService();
        RequestCounter.reset();
    }

    @Test
    public void testGetRequestCount() {
        RequestCounter.increment();
        RequestCounter.increment();
        long count = counterService.getRequestCount();
        assertEquals(2, count, "Счетчик должен быть равен 2");
    }

    @Test
    public void testResetRequestCount() {
        RequestCounter.increment();
        counterService.resetRequestCount();
        long count = counterService.getRequestCount();
        assertEquals(0, count, "Счетчик должен быть сброшен до 0");
    }
}