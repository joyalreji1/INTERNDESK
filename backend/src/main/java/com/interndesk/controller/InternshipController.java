package com.interndesk.controller;

import com.interndesk.dto.ApiResponse;
import com.interndesk.dto.InternshipDto;
import com.interndesk.entity.User;
import com.interndesk.repository.UserRepository;
import com.interndesk.service.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@Tag(name = "Internships", description = "Browse, search, create and manage internship listings")
public class InternshipController {

    private final InternshipService internshipService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Search and filter internships (public)")
    public ResponseEntity<ApiResponse<Page<InternshipDto.InternshipSummary>>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minStipend,
            @RequestParam(required = false) BigDecimal maxStipend,
            @RequestParam(required = false) Boolean isPaid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort) {

        Page<InternshipDto.InternshipSummary> result = internshipService.searchInternships(
            query, category, workMode, location, minStipend, maxStipend, isPaid, page, size, sort);

        return ResponseEntity.ok(ApiResponse.success(result)
            .withPagination(result.getNumber(), result.getSize(),
                            result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get internship details by ID (public)")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new internship listing (company only)")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> create(
            @Valid @RequestBody InternshipDto.CreateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Internship created successfully.", internshipService.create(req, user.getId())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an internship (company owner only)")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody InternshipDto.CreateRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Internship updated.", internshipService.update(id, req, user.getId())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel/delete an internship (company owner only)")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        internshipService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Internship cancelled.", null));
    }
}
