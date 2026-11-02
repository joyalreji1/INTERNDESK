package com.interndesk.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

public class DashboardDto {

    @Data
    public static class StudentDashboard {
        private String welcomeMessage;
        private int profileCompletionPercent;
        private long totalApplications;
        private long pendingApplications;
        private long shortlistedApplications;
        private long selectedApplications;
        private long paymentPendingApplications;
        private long enrolledApplications;
        private long rejectedApplications;
        private Map<String, Long> applicationsByStatus;
        private List<InternshipDto.InternshipSummary> recommendedInternships;
        private List<ApplicationDto.ApplicationSummary> recentApplications;
        private long unreadNotifications;
    }

    @Data
    public static class CompanyDashboard {
        private long totalInternships;
        private long totalActiveInternships;
        private long freeInternships;
        private long paidInternships;
        private long totalApplicants;
        private long pendingReviewCount;
        private long shortlistedCount;
        private long selectedCount;
        private long paymentPendingCount;
        private long enrolledCount;
        private java.math.BigDecimal totalCollectedFees;
        private Map<String, Long> applicantsByStatus;
        private List<ApplicationDto.ApplicationResponse> recentApplicants;
        private List<InternshipDto.InternshipSummary> myInternships;
        private long unreadNotifications;
    }

    @Data
    public static class AdminDashboard {
        private long totalStudents;
        private long totalCompanies;
        private long totalInternships;
        private long freeInternships;
        private long paidInternships;
        private long totalApplications;
        private long pendingCompanyVerifications;
        private long activeInternships;
        private java.math.BigDecimal totalPaymentVolume;
        private long pendingRefundsCount;
        private Map<String, Long> internshipsByCategory;
        private List<ChartPoint> monthlyRegistrations;
        private List<ChartPoint> monthlyApplications;
        private long unreadNotifications;
    }

    @Data
    public static class ChartPoint {
        private String label;
        private Long value;

        public ChartPoint(String label, Long value) {
            this.label = label;
            this.value = value;
        }
    }
}
