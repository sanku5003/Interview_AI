import { useContext } from "react";
import { AuthContext } from "../Auth.context";
import { login, register, logout, getMe } from "../Services/Auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, username, password }) => {
    setLoading(true);
    const data = await register({ email, username, password });
    setUser(data.user);
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const data = await logout();
    setUser(null);
    setLoading(false);
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
