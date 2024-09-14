import { useAtom } from "jotai";
import { useState } from "react";
import { loadableSignupAtom, secretKeyAtom } from "../atoms";

const Login = () => {
  const [secretInput, setSecretInput] = useState<string>("");
  const [, setSecret] = useAtom(secretKeyAtom);
  const [signup] = useAtom(loadableSignupAtom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecret(secretInput);
  }

  console.info('signup', signup)

  return (
    <div className="container">
      <h1>Secret</h1>
      {signup.state === 'loading' && <p>Loading...</p>}
      {signup.state === 'hasError' && <p>{String(signup.error)}</p>}

      <form onSubmit={handleSubmit}>
        <input value={secretInput} onChange={(e) => setSecretInput(e.target.value)} type="password" placeholder="Enter Secret in HEX" />
        <button disabled={signup.state === 'loading'} type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
