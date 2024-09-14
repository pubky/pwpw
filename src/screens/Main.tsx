import { useAtom } from "jotai";
import { categoiesRWAtom, itemsRWAtom, locationAtom } from "../atoms";
import { loadable } from "jotai/utils";
import { TCategory } from "../types";

export const loadableCategoiesAtom = loadable(categoiesRWAtom)

const Main = () => {
  const [cats, setCats] = useAtom(categoiesRWAtom)
  const [items, setItems] = useAtom(itemsRWAtom)
  const [loc, setLoc] = useAtom(locationAtom)

  const handleCatClick = (id: string) => {
    setLoc({
      pathname: '/',
      searchParams: new URLSearchParams([['category', id]]),
    })
    // setCats([{ id: '1', name: 'Sites' }])
    // console.info('saved')
  }

  const handleSetCat = async () => {
    await setCats([{ id: '1', name: 'Sites' }])
    console.info('saved')
  }

  const handleAdd = () => {
    setLoc({ pathname: '/add' })
  }

  console.info('items', items)

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>Category 1</li>
          <li>Category 2</li>
          <li onClick={handleSetCat}>Category 3</li>
          {cats.map((c: TCategory) => (
            <li key={c.id} onClick={() => handleCatClick(c.id)}>{c.name}</li>
          ))}
        </ul>
      </div>
      <div className="content">
        <div className="top-menu">
          <button onClick={handleAdd}>Add</button>
          <button>Close</button>
          <button>Add Entry</button>
          <button>Edit</button>
          <button>Delete</button>
          <button>Copy Password</button>
          <button>Copy Username</button>
        </div>
        <div className="item-list">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      </div>
    </>
    )
}

export default Main;
