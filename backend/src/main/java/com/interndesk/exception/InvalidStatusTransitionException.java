package com.interndesk.exception;

import com.interndesk.entity.Application;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(Application.ApplicationStatus from, Application.ApplicationStatus to) {
        super("Invalid status transition from " + from + " to " + to);
    }
}
