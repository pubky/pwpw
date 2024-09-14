import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { categoiesRWAtom, itemsRWAtom, locationAtom } from "../atoms";
import { TItem, TItems } from "../types";

export const loadableCategoiesAtom = loadable(categoiesRWAtom)

const Add = () => {
  const [items, setItems] = useAtom(itemsRWAtom)

  const [title, setTitle] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: TItem = {
      id: uuid(),
      title,
      username,
      password,
      url,
      notes,
    }

    // delete emply keys
    for (let key in item) {
      // @ts-ignore
      if (!item[key]) {
        // @ts-ignore
        delete item[key]
      }
    }

    setItems((prev: TItems) => [...prev, item])
  }


  const [cats, setCats] = useAtom(categoiesRWAtom)
  const [loc, setLoc] = useAtom(locationAtom)

  // console.info('items', items)

  return (
      <div className="container">
        <h1>Add Entry</h1>
        <form onSubmit={handleSave}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" />

          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />

          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />

          <label>Repeat Password</label>
          <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type="password" placeholder="Repeat Password" />

          <label>URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="URL" />

          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Notes"></textarea>

          <div className="form-buttons">
            <button type="submit">Add</button>
            <button type="button">Close</button>
          </div>
        </form>
      </div>
    )
}

export default Add;
