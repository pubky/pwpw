import { Keypair, PubkyClient, PublicKey } from "@synonymdev/pubky";
import { Buffer } from "buffer";
import { atom } from "jotai";
import { atomWithLocation } from "jotai-location";
import { atomWithStorage, loadable } from "jotai/utils";
import isEqual from "lodash/isEqual";

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

  let raw = await signup.get(`${url}cats`);

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

  // try {
  //   await Promise.all(noCats.map(async (i) => {
  //     await signup.delete(i);
  //   }))
  // } catch (e) {}

  const items = await Promise.all(noCats.map(async (i) => {
    const id = i.split('/').pop();
    const raw = await signup.get(`${url}${id}`);
    const parsed = await decodeData(raw!, secretKey);
    return { ...parsed, id };
  }));
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

  const old = await get(itemsRWAtom)

  // find items to delete
  const toDelete = old.filter((i) => !items.find((j) => j.id === i.id));
  await Promise.all(toDelete.map(async (item) => {
    await signup.delete(`${url}${item.id}`);
  }));

  // find items to add or update, use isEqual
  const toAdd = items.filter((i) => !isEqual(i, old.find((j) => j.id === i.id)));
  await Promise.all(toAdd.map(async (item) => {
    const buff = await encodeData(item, secretKey);
    await signup.put(`${url}${item.id}`, buff);
  }))

  set(itemsAtom, items);
});
