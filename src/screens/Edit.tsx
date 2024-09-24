import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { categoiesRWAtom, itemsRWAtom, locationAtom } from "../atoms";
import { TCategory, TItem } from "../types";

const Edit = ({ id } : { id: string }) => {
  const [items, setItems] = useAtom(itemsRWAtom)
  const [cats] = useAtom(categoiesRWAtom)
  const [, setLoc] = useAtom(locationAtom)

  const item = useMemo(() => {
    return items.find((i: TItem) => i.id === id)
  }, [id]);

  if (!item) {
    return <div>Item not found</div>
  }

  const [title, setTitle] = useState<string>(item.title)
  const [username, setUsername] = useState<string>(item.username ?? '')
  const [password, setPassword] = useState<string>(item.password ?? '')
  const [repeatPassword, setRepeatPassword] = useState<string>(item.password ?? '')
  const [url, setUrl] = useState<string>(item.url ?? '')
  const [notes, setNotes] = useState<string>(item.notes ?? '')
  const [selectedCategory, setSelectedCategory] = useState<string>(item.category ?? '');
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

    const i: TItem = {
      id: uuid(),
      title,
      username,
      password,
      url,
      notes,
      category: selectedCategory,
    }

    // delete emply keys
    for (let key in i) {
      // @ts-ignore
      if (!i[key]) {
        // @ts-ignore
        delete i[key]
      }
    }

    const newItems = items.map((it: TItem) => {
      if (it.id === id) {
        return i
      }
      return it
    })

    try {
      setItems(newItems)
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
        <h1>Edit Entry</h1>
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
            <button type="submit">Save</button>
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        </form>
      </div>
    )
}

export default Edit;
