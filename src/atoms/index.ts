import { Keypair, PubkyClient, PublicKey } from "@synonymdev/pubky";
import { Buffer } from "buffer";
import { atom } from "jotai";
import { atomWithLocation } from 'jotai-location';
import { atomWithStorage, loadable } from "jotai/utils";

import { TCategories, TItems } from "../types";
import { decodeData, encodeData } from "./encryption";

const HOMESERVER = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo";
const homeserver = PublicKey.from(HOMESERVER);
const pubkyClient = PubkyClient.testnet();

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

  console.info('CATS', `${url}cats`)
  let raw = await signup.get(`${url}cats`);
  console.info('CATS', raw)
  // if file not found, create empty
  if (!raw) {
    const empty = await encodeData([], secretKey);
    await signup.put(`${url}cats`, empty);
    return [];
  }

  return await decodeData(raw, secretKey);
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
  const secretKey = get(secretKeyAtom);
  if (!secretKey) {
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

  try {
    await Promise.all(noCats.map(async (i) => {
      await signup.delete(i);
    }))
  } catch (e) {}

  // const items = []

  // for (let i of noCats) {
  //   const id = i.split('/').pop();
  //   const raw = await signup.get(`${url}${i}`);
  //   const parsed = await decodeData(raw!, secretKey);
  //   items.push({ ...parsed, id })
  // }

  console.info('noCats', noCats)

  const items = await Promise.all(noCats.map(async (i) => {
    const id = i.split('/').pop();
    console.info('id', id)
    const raw = await signup.get(`${url}${id}`);
    // const parsed = JSON.parse(Buffer.from(raw!).toString());
    console.info('raw', raw)
    const parsed = await decodeData(raw!, secretKey);
    return { ...parsed, id };
  }));
  console.info('items2', items)
  return items as TItems;
}, async (get, set, items: TItems) => {
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

  await Promise.all(items.map(async (item) => {
    const buff = await encodeData(item, secretKey);
    // const buff = await encodeData([], secretKey);
    console.info('path', `${url}${item.id}`)
    // await signup.put(`${url}${item.id}`, buff);
    await signup.put(`${url}${item.id}`, buff);
  }))

  await Promise.all(items.map(async (item) => {
    console.info("GET", item.id)
    const r = await signup.get(`${url}${item.id}`);
    console.info("GET RES", item.id, r)
  }))


  // await signup.put(`pubky://jhifu5qeg366soyrxuwd739i33atwi638k77i8eh7bceaiid34ry/pub/pwpw/aaaa`, await encodeData([], secretKey));
  // console.info('PUT')
  // const g = await signup.get(`pubky://jhifu5qeg366soyrxuwd739i33atwi638k77i8eh7bceaiid34ry/pub/pwpw/aaaa`);
  // console.info('GET', g)

  // for (let i of items) {
  //   // const buff = await encodeData(i, secretKey);
  //   const buff = await encodeData([], secretKey);
  //   await signup.put(`${url}zzzz`, buff);
  //   // await signup.put(`${url}${i.id}`, buff);
  // }

  set(itemsAtom, items);
  // return []
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
