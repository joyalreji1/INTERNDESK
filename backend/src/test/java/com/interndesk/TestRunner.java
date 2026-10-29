package com.interndesk;

import com.interndesk.service.AuthServiceTest;
import com.interndesk.service.InternshipServiceTest;
import com.interndesk.workflow.ApplicationWorkflowTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class TestRunner {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("  INTERN DESK — AUTOMATED TEST SUITE RUNNER       ");
        System.out.println("=================================================");

        List<Class<?>> testClasses = List.of(
            AuthServiceTest.class,
            InternshipServiceTest.class,
            ApplicationWorkflowTest.class
        );

        int total = 0;
        int passed = 0;
        int failed = 0;

        for (Class<?> clazz : testClasses) {
            System.out.println("\nRunning tests in: " + clazz.getSimpleName());
            Method[] methods = clazz.getDeclaredMethods();
            Method beforeEach = null;
            for (Method m : methods) {
                if (m.isAnnotationPresent(BeforeEach.class)) {
                    beforeEach = m;
                    break;
                }
            }

            for (Method m : methods) {
                if (m.isAnnotationPresent(Test.class)) {
                    total++;
                    try {
                        Object instance = clazz.getDeclaredConstructor().newInstance();
                        // Initialize mocks via MockitoAnnotations
                        org.mockito.MockitoAnnotations.openMocks(instance);

                        if (beforeEach != null) {
                            beforeEach.setAccessible(true);
                            beforeEach.invoke(instance);
                        }

                        m.setAccessible(true);
                        m.invoke(instance);
                        System.out.println("  ✓ [PASS] " + m.getName());
                        passed++;
                    } catch (Exception ex) {
                        System.err.println("  ✗ [FAIL] " + m.getName() + ": " + ex.getCause());
                        if (ex.getCause() != null) {
                            ex.getCause().printStackTrace();
                        }
                        failed++;
                    }
                }
            }
        }

        System.out.println("\n-------------------------------------------------");
        System.out.printf("Test Results: %d passed, %d failed, %d total%n", passed, failed, total);
        System.out.println("-------------------------------------------------");
        if (failed > 0) {
            System.exit(1);
        }
    }
}

