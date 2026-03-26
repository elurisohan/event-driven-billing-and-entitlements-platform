package com.tracknote.config;

import com.tracknote.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
    @EnableWebSecurity
    @RequiredArgsConstructor
    public class SecurityConfig{
// securityFilterChain(HttpSecurity http):
// - HttpSecurity is Spring Security's config object for HTTP security.
// - Methods like csrf(...), sessionManagement(...), authorizeHttpRequests(...), anyRequest().authenticated(),
//   and addFilterBefore(...) are built-in configuration methods on HttpSecurity.
// - Here we:
//   1) Disable CSRF for a stateless REST API.
//   2) Make sessions STATELESS (we use JWT, no server-side session).
//   3) Allow public access to /api/v1/auth/**, /error, /actuator/health.
//   4) Require authentication for any other request.
//   5) Insert our JwtAuthFilter before UsernamePasswordAuthenticationFilter in the filter chain.
// - http.build() converts this configuration into a SecurityFilterChain bean that Spring Security uses at runtime.

        private final JwtAuthFilter jwtAuthFilter;

        //HttpSecurity is just a object to define rules
        //Prefer centralized CORS config (one place) for simplicity and security.

//        Use strict origins (no *) in production.
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
            return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .cors(cors->cors.configurationSource(corsConfigurationSource()))
                    .sessionManagement(sess->sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth->auth.requestMatchers(
                                            "/api/v1/auth/**",
                                            "/api/v1/webhook/stripe",
                                            "/error",
                                            "/actuator/health",
                                            "/plans").permitAll()
                                            .anyRequest().authenticated())
                    .addFilterBefore(jwtAuthFilter,UsernamePasswordAuthenticationFilter.class)
                    .build();
        }

        //You configure a UserDetailsService and PasswordEncoder somewhere in your Spring config.
        //Spring uses these to build the AuthenticationManager behind the scenes.
        //You use this method to expose the built AuthenticationManager:
        //@Bean
        //public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        //    return config.getAuthenticationManager();
        //}
        //You inject that manager into your login controller:
        //
        //authenticationManager.authenticate(
        //    new UsernamePasswordAuthenticationToken(username, password)
        //);
        //This:
        //Calls your UserDetailsService.loadUserByUsername(username)
        //Verifies the password
        //Authenticates the user if valid

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
            return config.getAuthenticationManager();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource(){
            CorsConfiguration configuration=new CorsConfiguration();
            configuration.setAllowedHeaders(List.of("*"));
            configuration.setAllowedMethods(List.of("GET","POST","PATCH","DELETE","PUT","OPTIONS"));
            configuration.setAllowedOrigins(List.of("http://localhost:5173"));
            configuration.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**",configuration);
            return source;
        }
    }

