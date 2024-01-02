import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.*;

/** 数字签名算法 */
public class CryptoSHA1withRSA extends CryptoRSA {

  // public static void main(String[] args) throws GeneralSecurityException {
  //   // 待签名的消息:
  //   byte[] message = "Hello, I am Bob!".getBytes(StandardCharsets.UTF_8);

  //   CryptoSHA1withRSA alice = new CryptoSHA1withRSA("Alice");

  //   // 签名
  //   byte[] signed = alice.sign(message);
  //   System.out.println(
  //     String.format("signature: %x", new BigInteger(1, signed))
  //   );

  //   // 验证
  //   boolean isValid = CryptoSHA1withRSA.verify(
  //     message,
  //     alice.publicKeyBytes,
  //     signed
  //   );
  //   System.out.println(String.format("isValid: %s", isValid));
  // }

  public CryptoSHA1withRSA() throws GeneralSecurityException {}

  public CryptoSHA1withRSA(String name) throws GeneralSecurityException {}

  /** 签名 */
  public byte[] sign(byte[] message) throws GeneralSecurityException {
    // 用私钥签名:
    Signature s = Signature.getInstance("SHA1withRSA");

    s.initSign(this.privateKey);
    s.update(message);

    byte[] signed = s.sign();
    return signed;
  }

  /** 验证 */
  public static boolean verify(
    byte[] message,
    byte[] publicKeyBytes,
    byte[] signed
  ) throws GeneralSecurityException {
    // 从byte[]恢复PublicKey
    KeyFactory kf = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
    PublicKey publicKey = kf.generatePublic(keySpec);

    // 用公钥验证:
    Signature v = Signature.getInstance("SHA1withRSA");

    v.initVerify(publicKey);
    v.update(message);

    boolean valid = v.verify(signed);
    return valid;
  }
}
