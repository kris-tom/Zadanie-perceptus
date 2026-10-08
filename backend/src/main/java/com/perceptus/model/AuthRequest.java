package com.perceptus.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequest {

	@NotBlank(message = "Login nie może być pusty")
	private String username;

	@NotBlank(message = "Hasło nie może być puste")
	@Size(min = 4, message = "Hasło musi mieć min 4 znaki")
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
