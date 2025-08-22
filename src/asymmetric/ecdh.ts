/**
 * 楕円曲線Diffie-Hellman鍵共有（ECDH）の実装
 * 
 * この実装は教育目的であり、実用には検証済みライブラリの使用を推奨します。
 */

import { randomBytes } from 'crypto';

/**
 * 楕円曲線上の点を表すインターフェース
 */
export interface ECPoint {
  x: bigint;
  y: bigint;
}

/**
 * 楕円曲線パラメータ
 */
export interface ECCurve {
  p: bigint;  // 有限体の位数
  a: bigint;  // 曲線パラメータa
  b: bigint;  // 曲線パラメータb
  G: ECPoint; // 生成元
  n: bigint;  // 生成元の位数
}

/**
 * secp256k1曲線のパラメータ（Bitcoinで使用）
 */
export const SECP256K1: ECCurve = {
  p: BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'),
  a: BigInt(0),
  b: BigInt(7),
  G: {
    x: BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
    y: BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8')
  },
  n: BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
};

/**
 * 楕円曲線暗号クラス
 */
export class EllipticCurveCrypto {
  private curve: ECCurve;

  constructor(curve: ECCurve = SECP256K1) {
    this.curve = curve;
  }

  /**
   * 有限体での逆元を計算
   */
  private modInverse(a: bigint, m: bigint): bigint {
    let [old_r, r] = [a, m];
    let [old_s, s] = [BigInt(1), BigInt(0)];
    let [old_t, t] = [BigInt(0), BigInt(1)];

    while (r !== BigInt(0)) {
      const quotient = old_r / r;
      [old_r, r] = [r, old_r - quotient * r];
      [old_s, s] = [s, old_s - quotient * s];
      [old_t, t] = [t, old_t - quotient * t];
    }

    return (old_s % m + m) % m;
  }

  /**
   * 楕円曲線上の点の加法
   */
  private pointAdd(P: ECPoint | null, Q: ECPoint | null): ECPoint | null {
    if (P === null) return Q;
    if (Q === null) return P;

    const { p, a } = this.curve;

    // P = -Q の場合（無限遠点）
    if (P.x === Q.x && P.y === (-Q.y + p) % p) {
      return null;
    }

    let lambda: bigint;

    if (P.x === Q.x && P.y === Q.y) {
      // 倍点計算
      const numerator = (BigInt(3) * P.x * P.x + a) % p;
      const denominator = (BigInt(2) * P.y) % p;
      lambda = (numerator * this.modInverse(denominator, p)) % p;
    } else {
      // 点の加法
      const numerator = (Q.y - P.y + p) % p;
      const denominator = (Q.x - P.x + p) % p;
      lambda = (numerator * this.modInverse(denominator, p)) % p;
    }

    const x3 = (lambda * lambda - P.x - Q.x + p) % p;
    const y3 = (lambda * (P.x - x3) - P.y + p) % p;

    return { x: x3, y: y3 };
  }

  /**
   * 楕円曲線上の点のスカラー倍算（double-and-add法）
   */
  private scalarMultiply(k: bigint, P: ECPoint | null): ECPoint | null {
    if (P === null) return null;

    let result: ECPoint | null = null;
    let current = P;

    for (let i = 0; i < k.toString(2).length; i++) {
      if (k & (BigInt(1) << BigInt(i))) {
        result = this.pointAdd(result, current);
      }
      current = this.pointAdd(current, current)!;
    }

    return result;
  }

  /**
   * 秘密鍵を生成
   */
  generatePrivateKey(): bigint {
    const bytes = randomBytes(32);
    let privateKey = BigInt('0x' + bytes.toString('hex'));

    // 範囲チェック
    while (privateKey >= this.curve.n || privateKey === BigInt(0)) {
      const bytes = randomBytes(32);
      privateKey = BigInt('0x' + bytes.toString('hex'));
    }

    return privateKey;
  }

  /**
   * 公開鍵を生成
   */
  generatePublicKey(privateKey: bigint): ECPoint {
    return this.scalarMultiply(privateKey, this.curve.G)!;
  }

  /**
   * ECDH鍵共有
   */
  computeSharedSecret(privateKey: bigint, publicKey: ECPoint): ECPoint | null {
    return this.scalarMultiply(privateKey, publicKey);
  }

  /**
   * 点の圧縮形式に変換
   */
  compressPoint(point: ECPoint): string {
    const prefix = point.y % BigInt(2) === BigInt(0) ? '02' : '03';
    const xHex = point.x.toString(16).padStart(64, '0');
    return prefix + xHex;
  }

  /**
   * 圧縮形式から点を復元
   */
  decompressPoint(compressed: string): ECPoint | null {
    if (compressed.length !== 66) {
      throw new Error('Invalid compressed point length');
    }

    const prefix = compressed.slice(0, 2);
    const xHex = compressed.slice(2);
    const x = BigInt('0x' + xHex);

    // y座標を計算
    const ySquared = (x * x * x + this.curve.a * x + this.curve.b) % this.curve.p;

    // 平方剰余を計算（Tonelli-Shanks法の簡易版）
    let y = this.modSqrt(ySquared, this.curve.p);

    if (y === null) {
      throw new Error('Invalid compressed point');
    }

    // プレフィックスに基づいてy座標を調整
    if ((y % BigInt(2) === BigInt(0)) !== (prefix === '02')) {
      y = (-y + this.curve.p) % this.curve.p;
    }

    return { x, y };
  }

  /**
   * 平方剰余を計算（簡易実装）
   */
  private modSqrt(a: bigint, p: bigint): bigint | null {
    if (a === BigInt(0)) return BigInt(0);
    if (p === BigInt(2)) return a;

    // オイラーの判定
    const legendre = this.modPow(a, (p - BigInt(1)) / BigInt(2), p);
    if (legendre !== BigInt(1)) return null;

    // 簡単なケース: p ≡ 3 (mod 4)
    if (p % BigInt(4) === BigInt(3)) {
      return this.modPow(a, (p + BigInt(1)) / BigInt(4), p);
    }

    // 一般的なケース（簡易実装）
    for (let x = BigInt(2); x < p; x++) {
      const xSquared = (x * x) % p;
      if (xSquared === a) {
        return x;
      }
    }

    return null;
  }

  /**
   * モジュラー累乗
   */
  private modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    let result = BigInt(1);
    base = base % modulus;

    while (exponent > BigInt(0)) {
      if (exponent % BigInt(2) === BigInt(1)) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> BigInt(1);
      base = (base * base) % modulus;
    }

    return result;
  }

  /**
   * 点が曲線上にあるかチェック
   */
  validatePoint(point: ECPoint): boolean {
    const { p, a, b } = this.curve;
    const { x, y } = point;

    // 座標の範囲チェック
    if (x < BigInt(0) || x >= p || y < BigInt(0) || y >= p) {
      return false;
    }

    // 曲線方程式のチェック
    const left = (y * y) % p;
    const right = (x * x * x + a * x + b) % p;

    return left === right;
  }
}

/**
 * ECDH鍵共有の使用例
 */
export function ecdhExample(): void {
  const ecc = new EllipticCurveCrypto();

  // Aliceの鍵ペア生成
  const alicePrivateKey = ecc.generatePrivateKey();
  const alicePublicKey = ecc.generatePublicKey(alicePrivateKey);

  // Bobの鍵ペア生成
  const bobPrivateKey = ecc.generatePrivateKey();
  const bobPublicKey = ecc.generatePublicKey(bobPrivateKey);

  // 共有鍵の計算
  const aliceSharedSecret = ecc.computeSharedSecret(alicePrivateKey, bobPublicKey);
  const bobSharedSecret = ecc.computeSharedSecret(bobPrivateKey, alicePublicKey);

  console.log('ECDH鍵共有の例:');
  console.log('Aliceの秘密鍵:', alicePrivateKey.toString(16));
  console.log('Aliceの公開鍵:', alicePublicKey);
  console.log('Bobの秘密鍵:', bobPrivateKey.toString(16));
  console.log('Bobの公開鍵:', bobPublicKey);
  console.log('Aliceの共有鍵:', aliceSharedSecret);
  console.log('Bobの共有鍵:', bobSharedSecret);
  console.log('共有鍵が一致:', aliceSharedSecret?.x === bobSharedSecret?.x);

  // 点の圧縮・復元の例
  const compressed = ecc.compressPoint(alicePublicKey);
  const decompressed = ecc.decompressPoint(compressed);

  console.log('圧縮形式:', compressed);
  console.log('復元された点:', decompressed);
  console.log('復元が成功:', alicePublicKey.x === decompressed?.x && alicePublicKey.y === decompressed?.y);
}

/**
 * 定数時間での等価性チェック
 */
export function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

/**
 * 機密データの安全な消去
 */
export function secureClear(data: Uint8Array): void {
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }
}
