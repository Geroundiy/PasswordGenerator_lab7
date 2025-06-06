package com.example.passwordgenerator.aspect;

import com.example.passwordgenerator.counter.RequestCounter;
import com.example.passwordgenerator.dto.PasswordGenerationRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RequestCounterAspectTest {

    private RequestCounterAspect aspect;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private Signature signature;

    @BeforeEach
    public void setUp() {
        aspect = new RequestCounterAspect();
        RequestCounter.reset();
    }

    @Test
    public void testSinglePasswordGeneration() {
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("generatePassword");

        aspect.countPasswordGeneration(joinPoint);

        assertEquals(1, RequestCounter.getCount());
    }

    @Test
    public void testBulkPasswordGeneration() {
        List<PasswordGenerationRequest> requests = List.of(
                new PasswordGenerationRequest(8, 2, "user1"),
                new PasswordGenerationRequest(10, 3, "user2")
        );

        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("generatePasswordsBulk");
        when(joinPoint.getArgs()).thenReturn(new Object[]{requests});

        aspect.countPasswordGeneration(joinPoint);

        assertEquals(2, RequestCounter.getCount());
    }

    @Test
    public void testOtherMethodsNotCounted() {
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("create");

        aspect.countPasswordGeneration(joinPoint);

        assertEquals(0, RequestCounter.getCount());
    }
}