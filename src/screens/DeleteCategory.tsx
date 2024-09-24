import { useAtom } from "jotai";
import { useState } from "react";
import { categoiesRWAtom, locationAtom } from "../atoms";
import { TCategory } from "../types";

const DeleteCategory = () => {
  const [cats, setCats] = useAtom(categoiesRWAtom)
  const [, setLoc] = useAtom(locationAtom)

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [err, setErr] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      setErr('Choose a category to delete')
      return;
    }

    const newCats = cats.filter((c: TCategory) => c.id !== selectedCategory)

    try {
      setCats(newCats)
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
        <h1>Delete Category</h1>
        <div className="error-message">
          {err}
        </div>
        <form onSubmit={handleSave}>
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

          <div className="form-buttons">
            <button type="submit" className="button-delete">Delete</button>
            &nbsp;&nbsp;&nbsp;
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        </form>
      </div>
    )
}

export default DeleteCategory;
