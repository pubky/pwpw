import { Suspense } from "react";
import { useAtom } from "jotai";
import { loadableSignupAtom, locationAtom } from "./atoms";
import Add from "./screens/Add";
import Login from "./screens/Login";
import Main from "./screens/Main";
import Edit from "./screens/Edit";
import AddCategory from "./screens/AddCategory";
import DeleteCategory from "./screens/DeleteCategory";

import GlobalStyle from './styles/global';
import "./styles.css";

function App() {
  const [loc] = useAtom(locationAtom)
  const [signup] = useAtom(loadableSignupAtom)

  let content

  if (signup.state !== 'hasData' || !signup.data) {
    content = <Login />;
  } else if (loc.pathname === '/') {
    content = <Main />;
  } else if (loc.pathname === '/add') {
    content = <Add />;
  } else if (loc.pathname === '/edit') {
    content = <Edit id={loc.searchParams?.get('id')!} />;
  } else if (loc.pathname === '/add-category') {
    content = <AddCategory />;
  } else if (loc.pathname === '/delete-category') {
    content = <DeleteCategory />;
  } else {
    content = <Main />;
  }

  return (
    <>
    <GlobalStyle />
    <Suspense fallback={null}>
    {content}
    </Suspense>
    </>
  );
}

export default App;
