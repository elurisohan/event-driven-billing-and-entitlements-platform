package com.tracknote;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracknote.exception.JWTExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final Jwtutil jwtutil;

    private final UserDetailsService userDetailsService;

    //FilterChain  to continue the filter pipeline
    //HttpServletRequest is the atual incoming request

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader=request.getHeader("Authorization");
            if (authHeader!=null && authHeader.startsWith("Bearer ")){
                String jwt=authHeader.substring(7);
                String username=jwtutil.extractUsername(jwt);

                if (username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                    UserDetails userDetails =userDetailsService.loadUserByUsername(username);
                    if (jwtutil.authenticateToken(jwt,userDetails)){
                        UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (JWTExpiredException ex) {
            // Handle JWT expiration in filter - set 401 status
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 401);
            errorResponse.put("message", ex.getMessage());
            
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(response.getWriter(), errorResponse);
        }
    }
}
