package com.example.passwordgenerator.counter;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;

public class RequestCounterTest {

    @Test
    public void testIncrement() {
        RequestCounter.reset();
        long count = RequestCounter.increment();
        assertEquals(1, count, "Счетчик должен увеличиться до 1");
        count = RequestCounter.increment();
        assertEquals(2, count, "Счетчик должен увеличиться до 2");
    }

    @Test
    public void testGetCount() {
        RequestCounter.reset();
        RequestCounter.increment();
        RequestCounter.increment();
        assertEquals(2, RequestCounter.getCount(), "Счетчик должен быть равен 2");
    }

    @Test
    public void testReset() {
        RequestCounter.increment();
        RequestCounter.increment();
        RequestCounter.reset();
        assertEquals(0, RequestCounter.getCount(), "Счетчик должен быть сброшен до 0");
    }

    @Test
    public void testConcurrentIncrement() throws InterruptedException {
        RequestCounter.reset();
        int threadCount = 100;
        CountDownLatch latch = new CountDownLatch(threadCount);
        ExecutorService executor = Executors.newFixedThreadPool(10);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                RequestCounter.increment();
                latch.countDown();
            });
        }

        latch.await();
        executor.shutdown();
        assertEquals(threadCount, RequestCounter.getCount(), "Счетчик должен быть равен количеству потоков");
    }
}