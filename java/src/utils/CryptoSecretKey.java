import java.math.BigInteger;
import java.security.*;
import java.security.spec.*;
import javax.crypto.KeyAgreement;

/** 密钥交换算法 */
class CryptoSecretKey {

  // public static void main(String[] args) throws Exception {
  //   // Bob和Alice:
  //   CryptoSecretKey bob = new CryptoSecretKey("Bob");
  //   CryptoSecretKey alice = new CryptoSecretKey("Alice");

  //   // 双方交换各自的PublicKey:
  //   // Bob根据Alice的PublicKey生成自己的本地密钥:
  //   bob.generateSecretKey(alice.publicKeyBytes);
  //   // Alice根据Bob的PublicKey生成自己的本地密钥:
  //   alice.generateSecretKey(bob.publicKeyBytes);

  //   // 检查双方的本地密钥是否相同:
  //   bob.printKeys();
  //   alice.printKeys();
  //   // 双方的SecretKey相同，后续通信将使用SecretKey作为密钥进行AES加解密...
  // }

  public String name;

  public PublicKey publicKey;
  public byte[] publicKeyBytes;
  public String publicKeyString;

  private PrivateKey privateKey;
  private byte[] privateKeyBytes;
  private String privateKeyString;

  private byte[] secretKeyBytes;
  private String secretKeyString;

  public CryptoSecretKey() throws GeneralSecurityException {
    this("self");
  }

  public CryptoSecretKey(String name) throws GeneralSecurityException {
    this.name = name;
    this.generateKeyPair();
  }

  // 生成本地KeyPair:
  public void generateKeyPair() throws GeneralSecurityException {
    KeyPairGenerator kpGen = KeyPairGenerator.getInstance("DH");
    kpGen.initialize(512);
    KeyPair kp = kpGen.generateKeyPair();

    this.publicKey = kp.getPublic();
    this.publicKeyBytes = this.publicKey.getEncoded();
    this.publicKeyString = new BigInteger(1, this.publicKeyBytes).toString(16);

    this.privateKey = kp.getPrivate();
    this.privateKeyBytes = this.privateKey.getEncoded();
    this.privateKeyString =
      new BigInteger(1, this.privateKeyBytes).toString(16);
  }

  // 根据来自他人的PublicKey生成自己的本地密钥
  public void generateSecretKey(byte[] receivedPubKeyBytes)
    throws GeneralSecurityException {
    // 从byte[]恢复PublicKey:
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(receivedPubKeyBytes);
    KeyFactory kf = KeyFactory.getInstance("DH");
    PublicKey receivedPublicKey = kf.generatePublic(keySpec);
    // 生成本地密钥:
    KeyAgreement keyAgreement = KeyAgreement.getInstance("DH");
    keyAgreement.init(this.privateKey); // 自己的PrivateKey
    keyAgreement.doPhase(receivedPublicKey, true); // 对方的PublicKey

    // 生成SecretKey密钥:
    this.secretKeyBytes = keyAgreement.generateSecret();
    this.secretKeyString = new BigInteger(1, this.secretKeyBytes).toString(16);
  }

  public void printKeys() {
    System.out.printf("Name: %s\n", this.name);
    System.out.printf("Private key: %s\n", this.privateKeyString);
    System.out.printf("Public key: %s\n", this.publicKeyString);
    System.out.printf("Secret key: %s\n", this.secretKeyString);
  }
}
