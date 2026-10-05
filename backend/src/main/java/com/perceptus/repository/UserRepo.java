package com.perceptus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.perceptus.model.USER;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<USER, Long>{
	Optional<USER> findByUsername(String username);
}
