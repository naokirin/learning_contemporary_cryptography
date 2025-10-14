/**
 * AES-128 暗号化アルゴリズムのスクラッチ実装（学習用）
 *
 * 外部の暗号ライブラリを使用せず、AES-128の基本的な仕組みを理解するための実装です。
 * 本番環境での使用は推奨されません。必ず検証済みのライブラリを使用してください。
 *
 * 参考: FIPS 197 - Advanced Encryption Standard (AES)
 * https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf
 */

// =============================================================================
// 1. 定数 (Constants)
// =============================================================================

/**
 * S-Box (Substitution Box) - SubBytesで使用する置換テーブル
 * ガロア体上の逆元計算とアフィン変換により生成されたテーブル
 */
const S_BOX = new Uint8Array([
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]);

/**
 * 逆S-Box - 復号用の逆置換テーブル
 */
const INV_S_BOX = new Uint8Array([
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]);

/**
 * Rcon (Round Constant) - KeyExpansionで使用するラウンド定数
 * 各ラウンドで異なる定数をXORすることで鍵の独立性を高める
 */
const RCON = new Uint8Array([
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
]);

// =============================================================================
// 2. 型定義 (Type Definitions)
// =============================================================================

/** 128ビット(16バイト)のデータブロック */
type Block = Uint8Array;

/** 128ビット(16バイト)の鍵 */
type Key = Uint8Array;

/** 4x4のState行列（AESの内部状態） */
type State = [Uint8Array, Uint8Array, Uint8Array, Uint8Array];

// =============================================================================
// 3. ヘルパー関数 (Helper Functions)
// =============================================================================

/**
 * GF(2^8)におけるバイトの2倍算
 * 既約多項式 0x11B (x^8 + x^4 + x^3 + x + 1) を使用
 *
 * @param b - 入力バイト
 * @returns 2倍算の結果
 */
function gmul2(b: number): number {
  const msb = b & 0x80; // 最上位ビットをチェック
  let result = (b << 1) & 0xff;
  if (msb) {
    result ^= 0x1b; // 既約多項式でXOR
  }
  return result;
}

/**
 * GF(2^8)における乗算
 * ロシア農夫のアルゴリズム（Russian Peasant Multiplication）を使用
 *
 * @param a - 乗数
 * @param b - 被乗数
 * @returns a * b (mod 0x11B)
 */
function gmul(a: number, b: number): number {
  let result = 0;
  let tempA = a;
  let tempB = b;

  for (let i = 0; i < 8; i++) {
    if (tempB & 1) {
      result ^= tempA;
    }
    const msb = tempA & 0x80;
    tempA = (tempA << 1) & 0xff;
    if (msb) {
      tempA ^= 0x1b;
    }
    tempB >>= 1;
  }

  return result;
}

/**
 * 16バイトのブロックを4x4のState行列に変換
 * AESの仕様では列優先（column-major）で配置される
 *
 * @param block - 16バイトのデータ
 * @returns 4x4のState行列
 */
function blockToState(block: Block): State {
  const state: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  // 列優先で配置: state[row][col] = block[row + 4*col]
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      state[row]![col] = block[row + 4 * col]!;
    }
  }

  return state;
}

/**
 * 4x4のState行列を16バイトのブロックに変換
 *
 * @param state - 4x4のState行列
 * @returns 16バイトのデータ
 */
function stateToBlock(state: State): Block {
  const block = new Uint8Array(16);

  // 列優先で配置: block[row + 4*col] = state[row][col]
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      block[row + 4 * col] = state[row]![col]!;
    }
  }

  return block;
}

// =============================================================================
// 4. AESの基本操作 (Core AES Operations)
// =============================================================================

/**
 * SubBytes変換 - S-Boxを使った非線形バイト置換
 * State内の各バイトをS-Boxの値で置き換える
 *
 * @param state - 入力State
 * @returns 変換後のState
 */
function subBytes(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const byte = state[row]![col]!;
      newState[row]![col] = S_BOX[byte]!;
    }
  }

  return newState;
}

/**
 * ShiftRows���換 - 行ごとの循環左シフト
 * - 0行目: シフトなし
 * - 1行目: 1バイト左シフト
 * - 2行目: 2バイト左シフト
 * - 3行目: 3バイト左シフト
 *
 * @param state - 入力State
 * @returns 変換後のState
 */
function shiftRows(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  // 0行目: シフトなし
  newState[0] = new Uint8Array(state[0]!);

  // 1行目: 1バイト左シフト
  for (let col = 0; col < 4; col++) {
    newState[1]![col] = state[1]![(col + 1) % 4]!;
  }

  // 2行目: 2バイト左シフト
  for (let col = 0; col < 4; col++) {
    newState[2]![col] = state[2]![(col + 2) % 4]!;
  }

  // 3行目: 3バイト左シフト
  for (let col = 0; col < 4; col++) {
    newState[3]![col] = state[3]![(col + 3) % 4]!;
  }

  return newState;
}

/**
 * MixColumns変換 - 列の混合
 * GF(2^8)上での多項式乗算により各列のバイトを混合する
 * 固定多項式 c(x) = 0x03*x^3 + 0x01*x^2 + 0x01*x + 0x02 を使用
 *
 * @param state - 入力State
 * @returns 変換後のState
 */
function mixColumns(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  for (let col = 0; col < 4; col++) {
    const s0 = state[0]![col]!;
    const s1 = state[1]![col]!;
    const s2 = state[2]![col]!;
    const s3 = state[3]![col]!;

    // 混合行列との乗算
    // [02 03 01 01]   [s0]
    // [01 02 03 01] x [s1]
    // [01 01 02 03]   [s2]
    // [03 01 01 02]   [s3]
    newState[0]![col] = gmul(0x02, s0) ^ gmul(0x03, s1) ^ s2 ^ s3;
    newState[1]![col] = s0 ^ gmul(0x02, s1) ^ gmul(0x03, s2) ^ s3;
    newState[2]![col] = s0 ^ s1 ^ gmul(0x02, s2) ^ gmul(0x03, s3);
    newState[3]![col] = gmul(0x03, s0) ^ s1 ^ s2 ^ gmul(0x02, s3);
  }

  return newState;
}

/**
 * AddRoundKey変換 - ラウンド鍵との XOR
 * State と ラウンド鍵の各バイトを XOR する
 *
 * @param state - 入力State
 * @param roundKey - 16バイトのラウンド鍵
 * @returns 変換後のState
 */
function addRoundKey(state: State, roundKey: Block): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      newState[row]![col] = state[row]![col]! ^ roundKey[row + 4 * col]!;
    }
  }

  return newState;
}

// =============================================================================
// 5. 鍵スケジュール (Key Expansion)
// =============================================================================

/**
 * RotWord - 4バイトワードの循環左シフト
 * [a0, a1, a2, a3] -> [a1, a2, a3, a0]
 *
 * @param word - 4バイトのワード
 * @returns シフト後のワード
 */
function rotWord(word: Uint8Array): Uint8Array {
  return new Uint8Array([word[1]!, word[2]!, word[3]!, word[0]!]);
}

/**
 * SubWord - ワード内の各バイトをS-Boxで置換
 *
 * @param word - 4バイトのワード
 * @returns 置換後のワード
 */
function subWord(word: Uint8Array): Uint8Array {
  return new Uint8Array([
    S_BOX[word[0]!]!,
    S_BOX[word[1]!]!,
    S_BOX[word[2]!]!,
    S_BOX[word[3]!]!,
  ]);
}

/**
 * KeyExpansion - 鍵展開
 * 128ビット(16バイト)の初期鍵から、11個のラウンド鍵を生成する
 *
 * @param key - 16バイトの初期鍵
 * @returns 11個の16バイトラウンド鍵の配列
 */
function keyExpansion(key: Key): Block[] {
  const Nk = 4; // 初期鍵のワード数（128bit = 4 words）
  const Nr = 10; // ラウンド数
  const totalWords = 4 * (Nr + 1); // 必要な総ワード数: 44

  // ワード配列を初期化
  const words: Uint8Array[] = [];

  // 最初のNk個のワードは初期鍵から
  for (let i = 0; i < Nk; i++) {
    words.push(
      new Uint8Array([key[4 * i]!, key[4 * i + 1]!, key[4 * i + 2]!, key[4 * i + 3]!])
    );
  }

  // 残りのワードを生成
  for (let i = Nk; i < totalWords; i++) {
    let temp = new Uint8Array(words[i - 1]!);

    // 4の倍数のインデックスで特別な処理
    if (i % Nk === 0) {
      temp = rotWord(temp);
      temp = subWord(temp);
      temp[0] = temp[0]! ^ RCON[i / Nk]!;
    }

    // 前のワードとXOR
    const prevWord = words[i - Nk]!;
    words.push(
      new Uint8Array([
        prevWord[0]! ^ temp[0]!,
        prevWord[1]! ^ temp[1]!,
        prevWord[2]! ^ temp[2]!,
        prevWord[3]! ^ temp[3]!,
      ])
    );
  }

  // 4ワードずつまとめて16バイトのラウンド鍵を生成
  const roundKeys: Block[] = [];
  for (let i = 0; i <= Nr; i++) {
    const roundKey = new Uint8Array(16);
    for (let j = 0; j < 4; j++) {
      const word = words[4 * i + j]!;
      roundKey[4 * j] = word[0]!;
      roundKey[4 * j + 1] = word[1]!;
      roundKey[4 * j + 2] = word[2]!;
      roundKey[4 * j + 3] = word[3]!;
    }
    roundKeys.push(roundKey);
  }

  return roundKeys;
}

// =============================================================================
// 6. 暗号化・復号のメイン関数 (Main Encrypt/Decrypt Functions)
// =============================================================================

/**
 * AES-128 暗号化
 *
 * @param plainText - 16バイトの平文
 * @param key - 16バイトの鍵
 * @returns 16バイトの暗号文
 */
export function encrypt(plainText: Block, key: Key): Block {
  if (plainText.length !== 16) {
    throw new Error("Plain text must be 16 bytes");
  }
  if (key.length !== 16) {
    throw new Error("Key must be 16 bytes");
  }

  // 鍵展開
  const roundKeys = keyExpansion(key);

  // 初期状態
  let state = blockToState(plainText);

  // Initial Round: AddRoundKey
  state = addRoundKey(state, roundKeys[0]!);

  // Round 1-9: SubBytes -> ShiftRows -> MixColumns -> AddRoundKey
  for (let round = 1; round < 10; round++) {
    state = subBytes(state);
    state = shiftRows(state);
    state = mixColumns(state);
    state = addRoundKey(state, roundKeys[round]!);
  }

  // Final Round (Round 10): SubBytes -> ShiftRows -> AddRoundKey (MixColumnsなし)
  state = subBytes(state);
  state = shiftRows(state);
  state = addRoundKey(state, roundKeys[10]!);

  return stateToBlock(state);
}

/**
 * 逆ShiftRows変換 - 行ごとの循環右シフト
 */
function invShiftRows(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  // 0行目: シフトなし
  newState[0] = new Uint8Array(state[0]!);

  // 1行目: 1バイト右シフト
  for (let col = 0; col < 4; col++) {
    newState[1]![col] = state[1]![(col + 3) % 4]!;
  }

  // 2行目: 2バイト右シフト
  for (let col = 0; col < 4; col++) {
    newState[2]![col] = state[2]![(col + 2) % 4]!;
  }

  // 3行目: 3バイト右シフト
  for (let col = 0; col < 4; col++) {
    newState[3]![col] = state[3]![(col + 1) % 4]!;
  }

  return newState;
}

/**
 * 逆SubBytes変換 - 逆S-Boxを使った置換
 */
function invSubBytes(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const byte = state[row]![col]!;
      newState[row]![col] = INV_S_BOX[byte]!;
    }
  }

  return newState;
}

/**
 * 逆MixColumns変換
 */
function invMixColumns(state: State): State {
  const newState: State = [
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
    new Uint8Array(4),
  ];

  for (let col = 0; col < 4; col++) {
    const s0 = state[0]![col]!;
    const s1 = state[1]![col]!;
    const s2 = state[2]![col]!;
    const s3 = state[3]![col]!;

    // 逆混合行列との乗算
    // [0e 0b 0d 09]   [s0]
    // [09 0e 0b 0d] x [s1]
    // [0d 09 0e 0b]   [s2]
    // [0b 0d 09 0e]   [s3]
    newState[0]![col] =
      gmul(0x0e, s0) ^ gmul(0x0b, s1) ^ gmul(0x0d, s2) ^ gmul(0x09, s3);
    newState[1]![col] =
      gmul(0x09, s0) ^ gmul(0x0e, s1) ^ gmul(0x0b, s2) ^ gmul(0x0d, s3);
    newState[2]![col] =
      gmul(0x0d, s0) ^ gmul(0x09, s1) ^ gmul(0x0e, s2) ^ gmul(0x0b, s3);
    newState[3]![col] =
      gmul(0x0b, s0) ^ gmul(0x0d, s1) ^ gmul(0x09, s2) ^ gmul(0x0e, s3);
  }

  return newState;
}

/**
 * AES-128 復号
 *
 * @param cipherText - 16バイトの暗号文
 * @param key - 16バイトの鍵
 * @returns 16バイトの平文
 */
export function decrypt(cipherText: Block, key: Key): Block {
  if (cipherText.length !== 16) {
    throw new Error("Cipher text must be 16 bytes");
  }
  if (key.length !== 16) {
    throw new Error("Key must be 16 bytes");
  }

  // 鍵展開
  const roundKeys = keyExpansion(key);

  // 初期状態
  let state = blockToState(cipherText);

  // Initial Round: AddRoundKey
  state = addRoundKey(state, roundKeys[10]!);

  // Round 9-1: InvShiftRows -> InvSubBytes -> AddRoundKey -> InvMixColumns
  for (let round = 9; round >= 1; round--) {
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(state, roundKeys[round]!);
    state = invMixColumns(state);
  }

  // Final Round (Round 0): InvShiftRows -> InvSubBytes -> AddRoundKey
  state = invShiftRows(state);
  state = invSubBytes(state);
  state = addRoundKey(state, roundKeys[0]!);

  return stateToBlock(state);
}

// =============================================================================
// 7. ユーティリティ関数 (Utility Functions)
// =============================================================================

/**
 * バイト配列を16進数文字列に変換
 */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 16進数文字列をバイト配列に変換
 */
function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have even length");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// =============================================================================
// 8. テストコード (Test Code)
// =============================================================================

/**
 * FIPS 197 Appendix B のテストベクターを使った動作確認
 */
function runTests(): void {
  console.log("=".repeat(80));
  console.log("AES-128 スクラッチ実装のテスト");
  console.log("=".repeat(80));
  console.log();

  // FIPS 197 Appendix B のテストベクター
  const testKey = new Uint8Array([
    0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c,
  ]);

  const testPlainText = new Uint8Array([
    0x32, 0x43, 0xf6, 0xa8, 0x88, 0x5a, 0x30, 0x8d, 0x31, 0x31, 0x98, 0xa2, 0xe0, 0x37, 0x07, 0x34,
  ]);

  const expectedCipherText = new Uint8Array([
    0x39, 0x25, 0x84, 0x1d, 0x02, 0xdc, 0x09, 0xfb, 0xdc, 0x11, 0x85, 0x97, 0x19, 0x6a, 0x0b, 0x32,
  ]);

  console.log("【テスト1: 暗号化】");
  console.log(`平文:       ${toHex(testPlainText)}`);
  console.log(`鍵:         ${toHex(testKey)}`);
  console.log();

  const cipherText = encrypt(testPlainText, testKey);
  console.log(`暗号文:     ${toHex(cipherText)}`);
  console.log(`期待値:     ${toHex(expectedCipherText)}`);

  const encryptSuccess = toHex(cipherText) === toHex(expectedCipherText);
  console.log(`結果:       ${encryptSuccess ? "✓ 成功" : "✗ 失敗"}`);
  console.log();

  console.log("【テスト2: 復号】");
  console.log(`暗号文:     ${toHex(cipherText)}`);
  console.log(`鍵:         ${toHex(testKey)}`);
  console.log();

  const decryptedText = decrypt(cipherText, testKey);
  console.log(`復号結果:   ${toHex(decryptedText)}`);
  console.log(`期待値:     ${toHex(testPlainText)}`);

  const decryptSuccess = toHex(decryptedText) === toHex(testPlainText);
  console.log(`結果:       ${decryptSuccess ? "✓ 成功" : "✗ 失敗"}`);
  console.log();

  console.log("【テスト3: カスタムデータ】");
  const customKey = fromHex("000102030405060708090a0b0c0d0e0f");
  const customPlainText = fromHex("00112233445566778899aabbccddeeff");

  console.log(`平文:       ${toHex(customPlainText)}`);
  console.log(`鍵:         ${toHex(customKey)}`);

  const customCipher = encrypt(customPlainText, customKey);
  console.log(`暗号文:     ${toHex(customCipher)}`);

  const customDecrypt = decrypt(customCipher, customKey);
  console.log(`復号結果:   ${toHex(customDecrypt)}`);

  const customSuccess = toHex(customDecrypt) === toHex(customPlainText);
  console.log(`結果:       ${customSuccess ? "✓ 成功" : "✗ 失敗"}`);
  console.log();

  console.log("=".repeat(80));
  const allSuccess = encryptSuccess && decryptSuccess && customSuccess;
  console.log(
    `総合結果: ${allSuccess ? "✓ すべてのテストに成功しました" : "✗ 一部のテストが失敗しました"}`
  );
  console.log("=".repeat(80));
}

// スクリプトとして実行された場合にテストを実行
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}
