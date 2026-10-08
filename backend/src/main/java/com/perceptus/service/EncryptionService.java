package com.perceptus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class EncryptionService {

	@Value("${encryption.secret.key}")
	private String secretKey;

	private static final String ALGORITHM = "AES";

	public String encrypt(String rawMessage) throws Exception {
		byte[] keyBytes = secretKey.substring(0, 32).getBytes(StandardCharsets.UTF_8);
		SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);

		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, keySpec);

		byte[] encryptedBytes = cipher.doFinal(rawMessage.getBytes(StandardCharsets.UTF_8));
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

	public String decrypt(String encryptedMessage) throws Exception {
		byte[] keyBytes = secretKey.substring(0, 32).getBytes(StandardCharsets.UTF_8);
		SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);

		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, keySpec);

		byte[] decodedBytes = Base64.getDecoder().decode(encryptedMessage);
		byte[] decryptedBytes = cipher.doFinal(decodedBytes);
		return new String(decryptedBytes, StandardCharsets.UTF_8);
	}
}
