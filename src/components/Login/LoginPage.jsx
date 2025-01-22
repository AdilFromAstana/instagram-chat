import { useState } from "react";
import "./LoginPage.css";
import { login, isAuthenticated, logout } from "../../services/api";

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result.instagramToken) {
      localStorage.setItem("instagramToken", result.instagramToken);
      window.location.reload();
    }
    if (result.success) {
      setMessage("Login successful!");
    } else {
      setMessage(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    setMessage("Logged out.");
  };

  const handleInstagramLogin = () => {
    const instagramClientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const scopes =
      "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments";

    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

    window.location.href = instagramAuthUrl;
  };

  return (
    <div className="login-page">
      <h1>Mekel CRM</h1>
      {isAuthenticated() ? (
        <div className="login-form">
          <button onClick={handleLogout}>Выйти</button>
          <br />
          <button onClick={handleInstagramLogin}>Войти в инстаграм</button>
        </div>
      ) : (
        <div className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Войти</button>
        </div>
      )}
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default LoginPage;
