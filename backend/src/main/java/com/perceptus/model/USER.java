package com.perceptus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class USER {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true, nullable = false)
	private String username;
	
	@Column(nullable = false)
	private String password;
	
	public USER() {}
	
	public USER(String username, String password) {
		this.username = username;
		this.password = password;
	}
		
	public Long getId() {return id;}
	public String getUsername() {return username;}
	public String getPassword() {return password;}
	public void setPassword(String password) {this.password = password;}
}	
	




