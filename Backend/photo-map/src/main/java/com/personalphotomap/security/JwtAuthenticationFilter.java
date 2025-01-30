package com.personalphotomap.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    // Lista de URLs que devem ser ignoradas pelo filtro
    private static final List<String> EXCLUDE_URLS = Arrays.asList(
            "/api/auth/register",
            "/api/auth/login",
            "/photomap",
            "/api/other-public-endpoint" // Adicione outras rotas públicas se necessário
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Verifica se é uma requisição OPTIONS e libera
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String requestPath = request.getRequestURI();

        // Verifica se a URL atual está na lista de exclusão
        if (isExcluded(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extração e validação do token JWT
        String token = extractJwtFromRequest(request);
        String email = null; // Substituímos username por email

        if (StringUtils.hasText(token)) {
            try {
                email = jwtUtil.extractUsername(token); // Extraímos o email do token
            } catch (Exception e) {
                logger.error("Erro ao extrair email do token JWT", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token JWT inválido ou expirado");
                return;
            }
        }

        // Autenticação no contexto de segurança
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email); // Alterado para usar email

            // Valida o token usando o email
            if (jwtUtil.validateToken(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Continua o filtro
        filterChain.doFilter(request, response);
    }

    private boolean isExcluded(String path) {
        for (String pattern : EXCLUDE_URLS) {
            if (pathMatcher.match(pattern, path)) {
                return true;
            }
        }
        return false;
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove o prefixo "Bearer "
        }
        return null;
    }
}
