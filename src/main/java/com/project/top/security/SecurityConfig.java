package com.project.top.security;

import com.project.top.filter.JwtAuthenticationFilter;
import com.project.top.service.util.CustomUserDetailsService;
import com.project.top.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers(
                                        "/api/auth/login", "/api/users/register",
                                        "/", "/favicon.ico",
                                        "/static/**", "/index.html", "/js/**", "/favicon.ico", "/group-members.html",
                                        "/ws/**",
                                        "/topic/**", "/app/**").permitAll()
                                .requestMatchers("/api/chat/rooms").authenticated()
                                .requestMatchers(HttpMethod.GET, "/api/recruitments").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/recruitments/*").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/recruitments").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/api/recruitments/**").authenticated()

                                .requestMatchers(HttpMethod.GET, "/api/study-groups").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/study-groups/*").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/study-groups").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/api/study-groups/**").authenticated()

                                .requestMatchers(HttpMethod.GET, "/api/boards").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/boards/*").permitAll()
                                .anyRequest().authenticated()
                        )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService), UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .logout(logout -> logout.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
