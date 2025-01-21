export const convert =
  (reg: RegExp, offset: number) =>
  (str: string): string => {
    return str.replace(reg, (match) => {
      const unicode = match.charCodeAt(0);
      return String.fromCharCode(unicode + offset);
    });
  };

/* 65248 = 0xfee0 */
export const full2half = convert(
  /[ａ-ｚＡ-Ｚ０-９｀～！＠＃＄％＾＆＊（）＿＋－＝［］；＇＼，．／｛｝：＂｜＜＞？]/g,
  -65248,
);
export const half2full = convert(
  /[a-zA-Z0-9`~!@#$%^&*()_+-=[\];'\\,./{}:"|<>?]/g,
  +65248,
);

export const JP_FULL_MAP: Record<string, string> = {
  ァ: 'ｧ',
  ィ: 'ｨ',
  ゥ: 'ｩ',
  ェ: 'ｪ',
  ォ: 'ｫ',
  ッ: 'ｯ',
  ャ: 'ｬ',
  ュ: 'ｭ',
  ョ: 'ｮ',

  ア: 'ｱ',
  イ: 'ｲ',
  ウ: 'ｳ',
  エ: 'ｴ',
  オ: 'ｵ',
  カ: 'ｶ',
  キ: 'ｷ',
  ク: 'ｸ',
  ケ: 'ｹ',
  コ: 'ｺ',
  サ: 'ｻ',
  シ: 'ｼ',
  ス: 'ｽ',
  セ: 'ｾ',
  ソ: 'ｿ',
  タ: 'ﾀ',
  チ: 'ﾁ',
  ツ: 'ﾂ',
  テ: 'ﾃ',
  ト: 'ﾄ',
  ナ: 'ﾅ',
  ニ: 'ﾆ',
  ヌ: 'ﾇ',
  ネ: 'ﾈ',
  ノ: 'ﾉ',
  ハ: 'ﾊ',
  ヒ: 'ﾋ',
  フ: 'ﾌ',
  ヘ: 'ﾍ',
  ホ: 'ﾎ',
  マ: 'ﾏ',
  ミ: 'ﾐ',
  ム: 'ﾑ',
  メ: 'ﾒ',
  モ: 'ﾓ',
  ヤ: 'ﾔ',
  ユ: 'ﾕ',
  ヨ: 'ﾖ',
  ラ: 'ﾗ',
  リ: 'ﾘ',
  ル: 'ﾙ',
  レ: 'ﾚ',
  ロ: 'ﾛ',
  ワ: 'ﾜ',
  ヲ: 'ｦ',
  ン: 'ﾝ',

  ガ: 'ｶﾞ',
  ギ: 'ｷﾞ',
  グ: 'ｸﾞ',
  ゲ: 'ｹﾞ',
  ゴ: 'ｺﾞ',
  ザ: 'ｻﾞ',
  ジ: 'ｼﾞ',
  ズ: 'ｽﾞ',
  ゼ: 'ｾﾞ',
  ゾ: 'ｿﾞ',
  ダ: 'ﾀﾞ',
  ヂ: 'ﾁﾞ',
  ヅ: 'ﾂﾞ',
  デ: 'ﾃﾞ',
  ド: 'ﾄﾞ',
  バ: 'ﾊﾞ',
  ビ: 'ﾋﾞ',
  ブ: 'ﾌﾞ',
  ベ: 'ﾍﾞ',
  ボ: 'ﾎﾞ',
  パ: 'ﾊﾟ',
  ピ: 'ﾋﾟ',
  プ: 'ﾌﾟ',
  ペ: 'ﾍﾟ',
  ポ: 'ﾎﾟ',
  ヴ: 'ｳﾞ',
  ヷ: 'ﾜﾞ',
  ヺ: 'ｦﾞ',
};
export const JP_FULL_KEYS = Object.keys(JP_FULL_MAP);
export const JP_FULL_REG = new RegExp(`[${JP_FULL_KEYS.join('')}]`, 'g');
export const JPfull2half = (str: string): string => {
  return str.replace(JP_FULL_REG, (match) => {
    if (match in JP_FULL_MAP) {
      return JP_FULL_MAP[match];
    } else {
      return match;
    }
  });
};

export const JP_HALF_MAP = Object.fromEntries(
  Object.entries(JP_FULL_MAP).map(([key, value]) => [value, key]),
);
export const JP_HALF_KEYS = Object.keys(JP_HALF_MAP);
export const JP_HALF_REG = new RegExp(`[${JP_HALF_KEYS.join('')}]`, 'g');
export const JPhalf2full = (str: string): string => {
  return str.replace(JP_HALF_REG, (match) => {
    if (match in JP_HALF_MAP) {
      return JP_HALF_MAP[match];
    } else {
      return match;
    }
  });
};

/* TEST */
// {
//   const text1 =
//     'abc ａｂｃ 123 １２３ `｀~～!！@＠#＃$＄%％^＾&＆*＊(（)）_＿+＋-－=＝[［]］;；\'＇\\＼,，.．/／{｛}｝:："＂|｜<＜>＞?？ 　¥￥「」”‘’ー';
//   console.log(full2half(text1));
//   console.log(half2full(text1));

//   const text2 = 'ｱｲｳｴｵ アイウエオ';
//   console.log(JPfull2half(text2));
//   console.log(JPhalf2full(text2));

//   /* JP full */
//   // for (let index = 12353; index <= 12540; index++) {
//   //   console.log(index, String.fromCharCode(index));
//   // }

//   /* JP half */
//   // for (let index = 65382; index <= 65437; index++) {
//   //   console.log(index, String.fromCharCode(index));
//   // }
// }
/* TEST */
