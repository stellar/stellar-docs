/**
 * StrKey examples for ALL supported types in js-stellar-base:
 *   G: ed25519PublicKey
 *   S: ed25519SecretSeed
 *   M: med25519PublicKey (muxed account, 32-byte ed25519 + 8-byte ID)
 *   T: preAuthTx (32-byte hash)
 *   X: sha256Hash (32-byte hash)
 *   P: signedPayload (32-byte ed25519 + 4-byte len + payload[4..64])
 *   C: contract (32-byte)
 *   L: liquidityPool (32-byte)
 *   B: claimableBalance (1-byte discriminant + 32-byte hash)
 *
 * Run:
 *   npm i stellar-base
 *   node strkey-examples.mjs
 */

import crypto from 'node:crypto';
import { StrKey, Keypair } from 'stellar-base';

function rb(n) {
  return crypto.randomBytes(n);
}

function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function roundTrip(label, encodeFn, decodeFn, isValidFn, raw) {
  const enc = encodeFn(raw);
  const ok = isValidFn(enc);
  const dec = decodeFn(enc);

  console.log(`\n== ${label} ==`);
  console.log(`encoded: ${enc}`);
  console.log(`isValid: ${ok}`);
  console.log(`rawLen : ${raw.length}`);
  console.log(`decLen : ${dec.length}`);
  console.log(`match  : ${Buffer.compare(Buffer.from(raw), Buffer.from(dec)) === 0}`);
}

/* ---------------------------
 * G / S via Keypair
 * -------------------------- */
{
  const kp = Keypair.random();

  // G: ed25519 public key (32 bytes)
  const rawPub = kp.rawPublicKey(); // Buffer(32)
  roundTrip(
    'G (ed25519PublicKey)',
    StrKey.encodeEd25519PublicKey,
    StrKey.decodeEd25519PublicKey,
    StrKey.isValidEd25519PublicKey,
    rawPub
  );

  // S: ed25519 secret seed (32 bytes)
  const rawSeed = kp.rawSecretKey(); // Buffer(32)
  roundTrip(
    'S (ed25519SecretSeed)',
    StrKey.encodeEd25519SecretSeed,
    StrKey.decodeEd25519SecretSeed,
    StrKey.isValidEd25519SecretSeed,
    rawSeed
  );

  // (Bonus) Show the familiar string forms too
  console.log('\nKeypair string forms:');
  console.log(`G...: ${kp.publicKey()}`);
  console.log(`S...: ${kp.secret()}`);
}

/* ---------------------------
 * M: med25519PublicKey
 *  - 32 bytes ed25519 + 8 bytes ID
 * -------------------------- */
{
  const rawM = Buffer.concat([rb(32), rb(8)]); // 40 bytes
  roundTrip(
    'M (med25519PublicKey)',
    StrKey.encodeMed25519PublicKey,
    StrKey.decodeMed25519PublicKey,
    StrKey.isValidMed25519PublicKey,
    rawM
  );
}

/* ---------------------------
 * T: preAuthTx (32 bytes)
 * -------------------------- */
{
  const rawT = rb(32);
  // Note: js-stellar-base doesn’t expose isValidPreAuthTx in the snippet you pasted,
  // so we just encode/decode and then validate by decoding.
  const enc = StrKey.encodePreAuthTx(rawT);
  const dec = StrKey.decodePreAuthTx(enc);

  console.log('\n== T (preAuthTx) ==');
  console.log(`encoded: ${enc}`);
  console.log(`rawLen : ${rawT.length}`);
  console.log(`decLen : ${dec.length}`);
  console.log(`match  : ${Buffer.compare(rawT, dec) === 0}`);
}

/* ---------------------------
 * X: sha256Hash (32 bytes)
 * -------------------------- */
{
  const rawX = rb(32);
  const enc = StrKey.encodeSha256Hash(rawX);
  const dec = StrKey.decodeSha256Hash(enc);

  console.log('\n== X (sha256Hash) ==');
  console.log(`encoded: ${enc}`);
  console.log(`rawLen : ${rawX.length}`);
  console.log(`decLen : ${dec.length}`);
  console.log(`match  : ${Buffer.compare(rawX, dec) === 0}`);
}

/* ---------------------------
 * P: signedPayload
 *  - 32 bytes signer + 4 bytes payload length + payload (4..64 bytes)
 * -------------------------- */
{
  const signer = rb(32);
  const payload = rb(32); // choose any length 4..64
  const rawP = Buffer.concat([signer, u32be(payload.length), payload]);

  roundTrip(
    'P (signedPayload)',
    StrKey.encodeSignedPayload,
    StrKey.decodeSignedPayload,
    StrKey.isValidSignedPayload,
    rawP
  );
}

/* ---------------------------
 * C: contract (32 bytes)
 * -------------------------- */
{
  const rawC = rb(32);
  roundTrip(
    'C (contract)',
    StrKey.encodeContract,
    StrKey.decodeContract,
    StrKey.isValidContract,
    rawC
  );
}

/* ---------------------------
 * L: liquidityPool (32 bytes)
 * -------------------------- */
{
  const rawL = rb(32);
  roundTrip(
    'L (liquidityPool)',
    StrKey.encodeLiquidityPool,
    StrKey.decodeLiquidityPool,
    StrKey.isValidLiquidityPool,
    rawL
  );
}

/* ---------------------------
 * B: claimableBalance
 *  - 1 byte discriminant + 32 bytes hash
 *  - discriminant is usually 0 for the V0 type
 * -------------------------- */
{
  const discriminant = Buffer.from([0x00]);
  const cbHash = rb(32);
  const rawB = Buffer.concat([discriminant, cbHash]); // 33 bytes

  roundTrip(
    'B (claimableBalance)',
    StrKey.encodeClaimableBalance,
    StrKey.decodeClaimableBalance,
    StrKey.isValidClaimableBalance,
    rawB
  );
}

/* ---------------------------
 * Introspection helpers (from your snippet)
 * -------------------------- */
{
  const examples = [
    Keypair.random().publicKey(),                 // G...
    Keypair.random().secret(),                    // S...
    StrKey.encodeContract(rb(32)),                // C...
    StrKey.encodeLiquidityPool(rb(32)),           // L...
    StrKey.encodeClaimableBalance(Buffer.concat([Buffer.from([0]), rb(32)])) // B...
  ];

  console.log('\n== getVersionByteForPrefix examples ==');
  for (const s of examples) {
    const vb = StrKey.getVersionByteForPrefix(s);
    console.log(`${s.slice(0, 1)}... -> versionByte: ${vb}`);
  }
}
