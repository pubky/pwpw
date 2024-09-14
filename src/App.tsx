import { useAtom } from "jotai";
import { loadableSignupAtom, locationAtom } from "./atoms";
import Login from "./screens/Login";
import Main from "./screens/Main";
import GlobalStyle from './styles/global';

import "./styles.css";

function App() {
  const [loc, setLoc] = useAtom(locationAtom)
  const [signup] = useAtom(loadableSignupAtom)

  let content

  console.info('loc', loc.searchParams?.get('id'))

  if (signup.state !== 'hasData') {
    content = <Login />;
  } else if (loc.pathname === '/') {
    content = <Main />;
  } else {
    content = <Main />;
  }

  return (
    <>
    <GlobalStyle />
    {content}
    </>
  );
}

export default App;
