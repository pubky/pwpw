import { Keypair, PubkyClient, PublicKey } from "@synonymdev/pubky";
import { Buffer } from "buffer";
// import crypto from "crypto";
import { atom } from "jotai";
import { atomWithLocation } from 'jotai-location';
import { atomWithStorage, loadable } from "jotai/utils";
import { TCategories, TItems } from "../types";

import { encodeData, decodeData } from "./encryption";

// console.info(window.crypto.getRandomValues(new Uint8Array(16)));
// const crypto = window.crypto;

// encryption
// const algorithm = 'aes256';
// const inputEncoding = 'utf8';
// const outputEncoding = 'hex';
// const ivlength = 16  // AES blocksize
// const iv = crypto.randomBytes(ivlength);
// const iv = crypto.getRandomValues(new Uint8Array(ivlength))

// const HOMESERVER = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo";
const HOMESERVER = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo";
const homeserver = PublicKey.from(HOMESERVER);
const pubkyClient = PubkyClient.testnet();

// // decode and decrypt
// const decode = (data: Buffer, secretKey: string) => {
//   const string = data.toString();
//   const encKey = Buffer.from(secretKey, 'hex');
//   const components = string.split(':');
//   const iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
//   const decipher = crypto.createDecipheriv(algorithm, encKey, iv_from_ciphertext);
//   let deciphered = decipher.update(components.join(':'), outputEncoding, inputEncoding);
//   deciphered += decipher.final(inputEncoding);
//   const payload = JSON.parse(deciphered);
//   return payload;
// }

// // encrypt and encode
// const encode = (data: any, secretKey: string) => {
//   const string = JSON.stringify(data);
//   // let payload = Buffer.from(string);
//   const encKey = Buffer.from(secretKey, 'hex');
//   const cipher = crypto.createCipheriv(algorithm, encKey, iv);
//   let ciphered = cipher.update(string, inputEncoding, outputEncoding);
//   ciphered += cipher.final(outputEncoding);
//   const ciphertext = iv.toString() + ':' + ciphered
//   const payload = Buffer.from(ciphertext);
//   return payload;
// }

export const locationAtom = atomWithLocation();

export const secretKeyAtom = atomWithStorage<string | undefined>(
  "secretKey",
  undefined,
  undefined,
  {
    getOnInit: true,
  }
);

export const signupAtom = atom<Promise<PubkyClient | undefined>>(async (get) => {
  const secretKey = get(secretKeyAtom);
  if (!secretKey) {
    return
  }
  const buff = Buffer.from(secretKey, "hex");
  const keypair = Keypair.fromSecretKey(buff);
  await pubkyClient.signup(keypair, homeserver);
  return pubkyClient
})
export const loadableSignupAtom = loadable(signupAtom)

export const urlAtom = atom((get) => {
  const secretKey = get(secretKeyAtom);
  if (!secretKey) {
    return
  }
  const signup = get(signupAtom);
  if (!signup) {
    return
  }
  const buff = Buffer.from(secretKey, "hex");
  const keypair = Keypair.fromSecretKey(buff);
  const z32 = keypair.publicKey().z32();
  return `pubky://${z32}/pub/pwpw/`
})

export const categoiesAtom = atom([]);
export const categoiesRWAtom = atom(async (get) => {
  const signup = await get(signupAtom);
  if (!signup) {
    return
  }
  const secretKey = get(secretKeyAtom);
  if (!secretKey) {
    return
  }
  const url = get(urlAtom);
  if (!url) {
    return
  }
  const cats = get(categoiesAtom);
  if (cats.length > 0) {
    return cats;
  }

  // try {
  //   await signup.delete(`${url}cats`);
  // } catch (e) {}

  let raw = await signup.get(`${url}cats`);
  // if file not found, create empty
  if (!raw) {
    // const empty = Buffer.from(encodeData([], secretKey));
    const empty = await encodeData([], secretKey);
    await signup.put(`${url}cats`, empty);
    return [];
  }

  return await decodeData(raw, secretKey);
  // return await decodeData(Buffer.from(raw!).toString(), secretKey);

  // return JSON.parse(Buffer.from(raw!).toString());
}, async (get, set, cats: TCategories) => {
  const signup = await get(signupAtom);
  if (!signup) {
    return
  }
  const url = get(urlAtom);
  if (!url) {
    return
  }
  const secretKey = get(secretKeyAtom);
  if (!secretKey) {
    return
  }
  // const buff = Buffer.from(JSON.stringify(cats));
  const buff = await encodeData(cats, secretKey);
  await signup.put(`${url}cats`, buff);
  set(categoiesAtom, cats);
});

export const itemsAtom = atom<TItems>([]);
export const itemsRWAtom = atom(async (get) => {
  const signup = await get(signupAtom);
  if (!signup) {
    return []
  }
  const url = get(urlAtom);
  if (!url) {
    return []
  }
  const currentItems = get(itemsAtom);
  if (currentItems.length > 0) {
    return currentItems;
  }

  const list = await signup.list(url);
  const noCats = list.filter(i => !i.endsWith('cats'));

  const items = await Promise.all(noCats.map(async (i) => {
    const id = i.split('/').pop();
    const raw = await signup.get(i);
    const parsed = JSON.parse(Buffer.from(raw!).toString());
    return { id, ...parsed };
  }));
  return items as TItems;
}, async (get, set, items: TItems) => {
  const signup = await get(signupAtom);
  if (!signup) {
    return
  }
  const url = get(urlAtom);
  if (!url) {
    return
  }
  const buff = Buffer.from(JSON.stringify(items));
  await signup.put(`${url}items`, buff);
  set(itemsAtom, items);
  return []
});



// export type TNote = {
//   id: string;
//   content: string;
// };

// export const initialNote = { id: "0", content: "" };

// export const notesAtom = atomWithStorage<TNote[]>(
//   "notes",
//   [initialNote],
//   undefined,
//   {
//     getOnInit: true,
//   }
// );

// export const sortedNotesAtom = atom((get) => {
//   return get(notesAtom).sort((a, b) => a.id.localeCompare(b.id));
// });

// export const selectedNoteAtom = atomWithDefault((get) => {
//   return get(sortedNotesAtom)[0];
// });
