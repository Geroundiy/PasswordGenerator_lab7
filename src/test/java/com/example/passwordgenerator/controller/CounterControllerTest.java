package com.example.passwordgenerator.controller;

import com.example.passwordgenerator.service.CounterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class CounterControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CounterService counterService;

    @InjectMocks
    private CounterController counterController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(counterController).build();
    }

    @Test
    public void testGetCount() throws Exception {
        when(counterService.getRequestCount()).thenReturn(42L);

        mockMvc.perform(get("/api/counter")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").value(42));
    }

    @Test
    public void testResetCount() throws Exception {
        doNothing().when(counterService).resetRequestCount();

        mockMvc.perform(post("/api/counter/reset"))
                .andExpect(status().isNoContent());
    }
}