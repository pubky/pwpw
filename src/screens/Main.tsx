import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useState } from "react";
import { categoiesRWAtom, itemsRWAtom, locationAtom, secretKeyAtom } from "../atoms";
import { TCategory } from "../types";

export const loadableCategoiesAtom = loadable(categoiesRWAtom)

const Main = () => {
  const [, setSecret] = useAtom(secretKeyAtom)
  const [cats] = useAtom(categoiesRWAtom)
  const [items] = useAtom(itemsRWAtom)
  const [, setLoc] = useAtom(locationAtom)
  const [selectedCat, setSelectedCat] = useState('')

  const handleExit = () => {
    setSecret(undefined)
  }

  const handleAddItem = () => {
    setLoc({ pathname: '/add' })
  }

  const handleAddCategory = () => {
    setLoc({ pathname: '/add-category' })
  }

  const handleSelectItem = (id: string) => {
    setLoc({ pathname: '/edit', searchParams: new URLSearchParams([['id', id]]) })
  }

  const handleSetCategory = (id: string) => {
    setSelectedCat(id)
  }

  const handleRemoveCategory = () => {
    setLoc({ pathname: '/delete-category'})
  }

  const handleCopyUsername = (e: any, id: string) => {
    e.stopPropagation();
    const username = items.find((i) => i.id === id)?.username ?? '';
    navigator.clipboard.writeText(username)
  }

  const handleCopyPassword = (e: any, id: string) => {
    e.stopPropagation();
    const password = items.find((i) => i.id === id)?.password ?? '';
    navigator.clipboard.writeText(password)
  }

  const filtered = items.filter((i) => !selectedCat || i.category === selectedCat)

  return (
    <>
      <div className="sidebar">
        <ul>
          {/*<li>Category 1</li>*/}
{/*          <li onClick={handleSetItems}>set items</li>
          <li onClick={handleSetItemsEmpty}>set items empty</li>
          <li onClick={handleSetCat}>set cats</li>*/}
          <li
            className={!selectedCat ? 'selected' : ''}
            onClick={() => handleSetCategory('')}>
              All
            </li>
          {cats.map((c: TCategory) => (
            <li
              key={c.id}
              className={c.id === selectedCat ? 'selected' : ''}
              onClick={() => handleSetCategory(c.id)}>
                {c.name}
              </li>
          ))}
        </ul>
        <button className="button" onClick={handleAddCategory}>Add Category</button>
        <button className="button" onClick={handleRemoveCategory}>Remove Category</button>
      </div>
      <div className="content">
        <div className="top-menu">
          <button onClick={handleAddItem}>Add Item</button>
          <button onClick={handleExit}>Exit</button>
        </div>
        <div className="item-list">
          <ul>
            {filtered.map((i) => (
              <li onClick={() => handleSelectItem(i.id)} key={i.id}>
                {i.title}
                <div>
                  <button className="item-button" onClick={(e) => handleCopyUsername(e, i.id)}>Copy Username</button>
                  <button className="item-button" onClick={(e) => handleCopyPassword(e, i.id)}>Copy Password</button>
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="empty-list">
              <p>No items in the category</p>
            </div>
          )}
        </div>
      </div>
    </>
    )
}

export default Main;
