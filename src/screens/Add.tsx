import { useAtom } from "jotai";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { categoiesRWAtom, itemsRWAtom, locationAtom } from "../atoms";
import { TCategory, TItem } from "../types";

const Add = () => {
  const [items, setItems] = useAtom(itemsRWAtom)
  const [cats] = useAtom(categoiesRWAtom)
  const [, setLoc] = useAtom(locationAtom)

  const [title, setTitle] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [err, setErr] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setErr('Password is required')
      return;
    }

    if (password !== repeatPassword) {
      setErr('Passwords do not match')
      return;
    }

    const item: TItem = {
      id: uuid(),
      title,
      username,
      password,
      url,
      notes,
      category: selectedCategory,
    }

    // delete emply keys
    for (let key in item) {
      // @ts-ignore
      if (!item[key]) {
        // @ts-ignore
        delete item[key]
      }
    }

    try {
      setItems([...items, item])
    } catch(e: any) {
      console.error(e)
      setErr(e.message)
      return
    }

    setLoc({ pathname: '/'})
  }

  const handleClose = () => {
    setLoc({ pathname: '/' })
  }

  const handleChange = (set: (s: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setErr('')
      set(e.target.value)
    }
  }

  return (
      <div className="container">
        <h1>Add Entry</h1>
        <div className="error-message">
          {err}
        </div>
        <form onSubmit={handleSave}>
          <label className="label">Title</label>
          <input
            value={title}
            className="input-field"
            onChange={handleChange(setTitle)}
            type="text"
            placeholder="Title" />

          <label>Username</label>
          <input
            value={username}
            className="input-field"
            onChange={handleChange(setUsername)}
            type="text"
            placeholder="Username" />

          <label>Password</label>
          <input
            value={password}
            className="input-field"
            onChange={handleChange(setPassword)}
            type="password"
            placeholder="Password" />

          <label>Repeat Password</label>
          <input
            value={repeatPassword}
            className="input-field"
            onChange={handleChange(setRepeatPassword)}
            type="password"
            placeholder="Repeat Password" />

          <label>URL</label>
          <input
            value={url}
            className="input-field"
            onChange={handleChange(setUrl)}
            type="url"
            placeholder="URL" />

          <label className="label">Category</label>
          <select
            className="select-field"
            onChange={handleChange(setSelectedCategory)}
            value={selectedCategory}>
            <option value="">Select Category</option>
            {cats.map((c: TCategory) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label>Notes</label>
          <textarea
            value={notes}
            className="textarea-field"
            onChange={handleChange(setNotes)}
            rows={5}
            placeholder="Notes" />

          <div className="form-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        </form>
      </div>
    )
}

export default Add;
