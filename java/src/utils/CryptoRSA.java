import java.math.BigInteger;
import java.security.*;
import javax.crypto.*;

/** 非对称加密算法 */
public class CryptoRSA {

  public static void main(String[] args) throws Exception {
    // 明文:
    byte[] plainText = "Hello, encrypt use RSA".getBytes("UTF-8");

    // 创建公钥／私钥对:
    CryptoRSA alice = new CryptoRSA("Alice");

    System.out.printf("public key: %s\n\n", alice.publicKeyString);
    System.out.printf("private key: %s\n\n", alice.privateKeyString);

    // 用Alice的公钥加密:
    byte[] cipherText = alice.encrypt(plainText);
    System.out.printf("cipher text: %x\n\n", new BigInteger(1, cipherText));

    // 用Alice的私钥解密:
    byte[] decrypted = alice.decrypt(cipherText);
    System.out.printf("plain text: %s\n\n", new String(decrypted, "UTF-8"));
  }

  public String name;

  // 公钥:
  public PublicKey publicKey;
  public byte[] publicKeyBytes;
  public String publicKeyString;

  // 私钥:
  public PrivateKey privateKey;
  public byte[] privateKeyBytes;
  public String privateKeyString;

  public CryptoRSA() throws GeneralSecurityException {
    this("self");
  }

  public CryptoRSA(String name) throws GeneralSecurityException {
    this.name = name;

    // 生成公钥／私钥对:
    KeyPairGenerator kpGen = KeyPairGenerator.getInstance("RSA");
    kpGen.initialize(1024);
    KeyPair kp = kpGen.generateKeyPair();

    this.publicKey = kp.getPublic();
    this.publicKeyBytes = this.publicKey.getEncoded();
    this.publicKeyString = new BigInteger(1, this.publicKeyBytes).toString(16);

    this.privateKey = kp.getPrivate();
    this.privateKeyBytes = this.privateKey.getEncoded();
    this.privateKeyString =
      new BigInteger(1, this.privateKeyBytes).toString(16);
  }

  // 用公钥加密:
  public byte[] encrypt(byte[] plainText) throws GeneralSecurityException {
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.ENCRYPT_MODE, this.publicKey);
    return cipher.doFinal(plainText);
  }

  // 用私钥解密:
  public byte[] decrypt(byte[] cipherText) throws GeneralSecurityException {
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.DECRYPT_MODE, this.privateKey);
    return cipher.doFinal(cipherText);
  }
}
