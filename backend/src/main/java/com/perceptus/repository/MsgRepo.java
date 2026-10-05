package com.perceptus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.perceptus.model.EncryptedMessage;
import com.perceptus.model.USER;

import java.util.List;
@Repository
public interface MsgRepo extends JpaRepository<EncryptedMessage, Long> {
List<EncryptedMessage> findAllByUser(USER user);}