import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useState } from "react";
import { categoiesRWAtom, itemsRWAtom, locationAtom } from "../atoms";
import { TCategory } from "../types";

export const loadableCategoiesAtom = loadable(categoiesRWAtom)

const Main = () => {
  const [cats, setCats] = useAtom(categoiesRWAtom)
  const [items, setItems] = useAtom(itemsRWAtom)
  const [, setLoc] = useAtom(locationAtom)
  const [selectedCat, setSelectedCat] = useState('')

  // const handleCatClick = (id: string) => {
  //   setLoc({
  //     pathname: '/',
  //     searchParams: new URLSearchParams([['category', id]]),
  //   })
  // }

  // const handleSetCat = async () => {
  //   await setCats([{ id: '1', name: 'Sites' }])
  // }

  // const handleSetItems = async () => {
  //   await setItems([{ id: 'aaaa', title: 'Google' }, { id: 'bbbb', title: 'Facebook' }])
  // }

  // const handleSetItemsEmpty = async () => {
  //   try {
  //     await setItems([])
  //   } catch(e) {
  //     console.info('e', e)
  //   }
  // }

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
        {/*<button className="button">Remove Category</button>*/}
      </div>
      <div className="content">
        <div className="top-menu">
          <button onClick={handleAddItem}>Add Item</button>
          <button>Exit</button>
        </div>
        <div className="item-list">
          <ul>
            {filtered.map((i) => (
              <li onClick={() => handleSelectItem(i.id)} key={i.id}>{i.title}</li>
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
