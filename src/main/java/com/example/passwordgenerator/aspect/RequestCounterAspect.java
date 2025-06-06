package com.example.passwordgenerator.aspect;

import com.example.passwordgenerator.counter.RequestCounter;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Aspect
@Component
public class RequestCounterAspect {

    @Before("execution(* com.example.passwordgenerator.service.PasswordService.generatePassword(..)) || " +
            "execution(* com.example.passwordgenerator.service.PasswordService.generatePasswordsBulk(..))")
    public void countPasswordGeneration(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();

        // Фикс: проверять ТОЛЬКО целевые методы
        if ("generatePassword".equals(methodName)) {
            RequestCounter.increment();
        }
        else if ("generatePasswordsBulk".equals(methodName)) {
            Object[] args = joinPoint.getArgs();
            if (args != null && args.length > 0 && args[0] instanceof List<?> requests) {
                requests.stream()
                        .filter(Objects::nonNull)
                        .forEach(r -> RequestCounter.increment());
            }
        }
    }
}