import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { setAuthToken } from "@/services/apiClient";

const STORAGE_KEY = "wowwraps_auth";

const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persistSession = (payload) => {
  if (!payload) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    loading: true,
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  useEffect(() => {
    const saved = readStoredSession();
    if (saved?.token && saved?.user) {
      setAuthToken(saved.token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ user: saved.user, token: saved.token, loading: false });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const saveSession = useCallback((payload) => {
    persistSession(payload);
    setAuthToken(payload?.token || null);
    setState({
      user: payload?.user || null,
      token: payload?.token || null,
      loading: false,
    });
  }, []);

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        const data = await authService.login(credentials);
        saveSession(data);
        setAuthModalOpen(false);
        toast.success("Đăng nhập thành công", {
          description: `Chào mừng trở lại, ${
            data.user?.name || data.user?.email
          }`,
        });
      } catch (error) {
        toast.error("Đăng nhập thất bại", {
          description: error.message,
        });
        throw error;
      }
    },
    [saveSession]
  );

  const handleRegister = useCallback(
    async (payload) => {
      try {
        const data = await authService.register(payload);
        saveSession(data);
        setAuthModalOpen(false);
        toast.success("Đăng ký thành công", {
          description: "Tài khoản của bạn đã được tạo và đăng nhập.",
        });
      } catch (error) {
        toast.error("Đăng ký thất bại", {
          description: error.message,
        });
        throw error;
      }
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    saveSession(null);
    toast("Bạn đã đăng xuất");
  }, [saveSession]);

  const openAuthModal = useCallback((view = "login") => {
    setAuthView(view);
    setAuthModalOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: Boolean(state.token),
      loading: state.loading,
      login: handleLogin,
      register: handleRegister,
      logout,
      authModalOpen,
      authView,
      setAuthView,
      openAuthModal,
      closeAuthModal: () => setAuthModalOpen(false),
    }),
    [
      authModalOpen,
      authView,
      handleLogin,
      handleRegister,
      logout,
      openAuthModal,
      state.loading,
      state.token,
      state.user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
