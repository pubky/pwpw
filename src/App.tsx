import { useAtom } from "jotai";
import { loadableSignupAtom, locationAtom } from "./atoms";
import Login from "./screens/Login";
import Main from "./screens/Main";
import GlobalStyle from './styles/global';

import "./styles.css";
import { Suspense } from "react";

function App() {
  const [loc, setLoc] = useAtom(locationAtom)
  const [signup] = useAtom(loadableSignupAtom)

  let content

  if (signup.state !== 'hasData' || !signup.data) {
    content = <Login />;
  } else if (loc.pathname === '/') {
    content = <Main />;
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
