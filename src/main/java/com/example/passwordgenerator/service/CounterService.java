package com.example.passwordgenerator.service;

import com.example.passwordgenerator.counter.RequestCounter;
import org.springframework.stereotype.Service;

@Service
public class CounterService {
    public long getRequestCount() {
        return RequestCounter.getCount();
    }

    public void resetRequestCount() {
        RequestCounter.reset();
    }
}