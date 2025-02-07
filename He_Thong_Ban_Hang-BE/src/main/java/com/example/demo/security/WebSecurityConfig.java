package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.security.jwt.AuthEntryPointJwt;
import com.example.demo.security.jwt.AuthTokenFilter;
import com.example.demo.security.service.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity // Kích hoạt @PreAuthorize hoặc @PostAuthorize nếu cần
public class WebSecurityConfig {

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors().configurationSource(request -> {
					var corsConfig = new org.springframework.web.cors.CorsConfiguration();
					corsConfig.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
					corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
					corsConfig.setAllowedHeaders(java.util.List.of("*"));
					corsConfig.setAllowCredentials(true);

					return corsConfig;
				}).and().csrf().disable()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(
								"/api/cart/**",
								"/api/user/**",
								"/api/auth/**",
								"/api/order/**",
								"/api/destinations/**",
								"/api/image/**",
								"/api/reviews/**",
								"/api/ticket/**",
								"/api/**",
								"/api/service/**",
								"/swagger-ui.html",
								"/swagger-ui/**",
								"/api/auth/register/**"
						).permitAll()
						.requestMatchers("/**").permitAll()
						.anyRequest().authenticated()
				)
				.exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
				.and()
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
