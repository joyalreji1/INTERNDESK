package com.interndesk.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Object errors;
    private Long timestamp;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.data = data;
        r.timestamp = System.currentTimeMillis();
        return r;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> r = success(data);
        r.message = message;
        return r;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.message = message;
        r.timestamp = System.currentTimeMillis();
        return r;
    }

    public static <T> ApiResponse<T> error(String message, Object errors) {
        ApiResponse<T> r = error(message);
        r.errors = errors;
        return r;
    }

    public ApiResponse<T> withPagination(int page, int size, long totalElements, int totalPages) {
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        return this;
    }
}
