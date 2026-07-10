import { useState } from "react";
import { Login } from "./components/Login.tsx";
import { Dashboard } from "./components/Dashboard.tsx";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
