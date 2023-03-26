/* 

恺撒密码: 明文中的所有字母都在字母表上向左（或向右）按照一个固定数目进行偏移后被替换成密文

加密
cipher('', 3)

解密
decipher(cipher('', 3), 3)

*/


const NUMBER_LETTERS = 26;
const NO_ROTATION = 0;
const LETTER = {
  a: 65,
  z: 90,
  A: 97,
  Z: 122,
};

function isOutLowerCharacterCipher(text, position, shift) {
  return (
    text.charCodeAt(position) >= LETTER.a &&
    text.charCodeAt(position) <= LETTER.z &&
    text.charCodeAt(position) + shift > LETTER.z
  );
}
function isOutUpperCharacterCipher(text, position, shift) {
  return (
    text.charCodeAt(position) >= LETTER.A &&
    text.charCodeAt(position) <= LETTER.Z &&
    text.charCodeAt(position) + shift > LETTER.Z
  );
}

function isOutLowerCharacterDecipher(text, position, shift) {
  return (
    text.charCodeAt(position) >= LETTER.a &&
    text.charCodeAt(position) <= LETTER.z &&
    text.charCodeAt(position) - shift < LETTER.a
  );
}

function isOutUpperCharacterDecipher(text, position, shift) {
  return (
    text.charCodeAt(position) >= LETTER.A &&
    text.charCodeAt(position) <= LETTER.Z &&
    text.charCodeAt(position) - shift < LETTER.A
  );
}

export function cipher(text, shift) {
  let cipher = '';
  shift = shift % NUMBER_LETTERS;
  for (let position = 0; position < text.length; position++) {
    const isOutAlphabet =
      isOutLowerCharacterCipher(text, position, shift) ||
      isOutUpperCharacterCipher(text, position, shift);
    const rotation = isOutAlphabet ? NUMBER_LETTERS : NO_ROTATION;
    const character = text.charCodeAt(position) + shift - rotation;

    cipher = cipher.concat(String.fromCharCode(character));
  }
  return cipher.toString();
}

export function decipher(text, shift) {
  let cipher = '';

  shift = shift % NUMBER_LETTERS;
  for (let position = 0; position < text.length; position++) {
    const isOutAlphabet =
      isOutLowerCharacterDecipher(text, position, shift) ||
      isOutUpperCharacterDecipher(text, position, shift);
    const rotation = isOutAlphabet ? NUMBER_LETTERS : NO_ROTATION;
    const character = text.charCodeAt(position) - shift + rotation;
    cipher = cipher.concat(String.fromCharCode(character));
  }
  return cipher.toString();
}
