import java.security.*;
import java.util.Base64;
import java.util.Base64.*;
import javax.crypto.*;
import javax.crypto.spec.*;

/** AES/CBC/PKCS5Padding加密模式 */
public class Crypto {

  // public static void main(String[] args) throws Exception {
  //   // 明文:
  //   String message = "Hello, world!";
  //   System.out.println("Message: " + message);

  //   // 256位密钥 = 32 bytes Key:
  //   String keyString = "1234567890abcdef1234567890abcdef";

  //   // 加密:
  //   String encrypted = encrypt(keyString, message);
  //   System.out.println("Encrypted: " + encrypted);

  //   // 解密:
  //   String decrypted = decrypt(keyString, encrypted);
  //   System.out.println("Decrypted: " + decrypted);
  // }

  // 加密:
  public static String encrypt(String keyString, String message)
    throws Exception {
    // 256位密钥 = 32 bytes Key:
    byte[] key = keyString.getBytes("UTF-8");

    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
    // CBC模式需要生成一个16 bytes的initialization vector:
    SecureRandom sr = SecureRandom.getInstanceStrong();
    byte[] iv = sr.generateSeed(16);
    IvParameterSpec ivps = new IvParameterSpec(iv);
    cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivps);

    byte[] plaintext = message.getBytes("UTF-8");
    byte[] data = cipher.doFinal(plaintext);

    // IV不需要保密，把IV和密文一起返回:
    byte[] ciphertext = join(iv, data);

    // 编码
    Encoder encoder = Base64.getEncoder();
    String base64 = encoder.encodeToString(ciphertext);
    return base64;
  }

  // 解密:
  public static String decrypt(String keyString, String base64)
    throws Exception {
    // 256位密钥 = 32 bytes Key:
    byte[] key = keyString.getBytes("UTF-8");

    // 解码
    Decoder decoder = Base64.getDecoder();
    byte[] ciphertext = decoder.decode(base64);

    // 把input分割成IV和密文:
    byte[] iv = new byte[16];
    byte[] data = new byte[ciphertext.length - 16];
    System.arraycopy(ciphertext, 0, iv, 0, 16);
    System.arraycopy(ciphertext, 16, data, 0, data.length);

    // 解密:
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
    IvParameterSpec ivps = new IvParameterSpec(iv);
    cipher.init(Cipher.DECRYPT_MODE, keySpec, ivps);

    byte[] plaintext = cipher.doFinal(data);

    String decrypted = new String(plaintext, "UTF-8");
    return decrypted;
  }

  public static byte[] join(byte[] bs1, byte[] bs2) {
    byte[] r = new byte[bs1.length + bs2.length];
    System.arraycopy(bs1, 0, r, 0, bs1.length);
    System.arraycopy(bs2, 0, r, bs1.length, bs2.length);
    return r;
  }
}
