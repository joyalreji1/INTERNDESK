package com.interndesk.security;

import com.interndesk.entity.User;
import com.interndesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String cleanEmail = email != null ? email.trim().toLowerCase() : "";
        if ("admin".equals(cleanEmail)) {
            cleanEmail = "admin@interndesk.com";
        } else if ("student".equals(cleanEmail) || "arjun".equals(cleanEmail)) {
            cleanEmail = "arjun.sharma@student.edu";
        } else if ("company".equals(cleanEmail) || "technova".equals(cleanEmail)) {
            cleanEmail = "hr@technova.io";
        }

        User user = userRepository.findByEmail(cleanEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPasswordHash())
            .authorities(authorities)
            .accountExpired(false)
            .accountLocked(user.getAccountStatus() == User.AccountStatus.SUSPENDED)
            .credentialsExpired(false)
            .disabled(user.getAccountStatus() == User.AccountStatus.INACTIVE)
            .build();
    }
}
