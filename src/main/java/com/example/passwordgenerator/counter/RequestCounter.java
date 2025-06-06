package com.example.passwordgenerator.counter;

import java.util.concurrent.atomic.AtomicLong;

public class RequestCounter {
    private static final AtomicLong counter = new AtomicLong(0);

    public static synchronized long increment() {
        return counter.incrementAndGet();
    }

    public static synchronized long getCount() {
        return counter.get();
    }

    public static synchronized void reset() {
        counter.set(0);
    }
}