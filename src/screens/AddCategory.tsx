import { useAtom } from "jotai";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { categoiesRWAtom, locationAtom } from "../atoms";
import { TCategory } from "../types";

const AddCategory = () => {
  const [cats, setCats] = useAtom(categoiesRWAtom)
  const [, setLoc] = useAtom(locationAtom)
  const [err, setErr] = useState('')

  const [name, setName] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: TCategory = {
      id: uuid(),
      name,
    }

    try {
      await setCats([...cats, item])
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr('')
    setName(e.target.value)
  }

  return (
      <div className="container">
        <h1>Add Category</h1>
        <div className="error-message">
          {err}
        </div>
        <form onSubmit={handleSave}>
          <label className="label">Title</label>
          <input value={name} className="input-field" onChange={handleChange} type="text" placeholder="Title" />

          <div className="form-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        </form>
      </div>
    )
}

export default AddCategory;
