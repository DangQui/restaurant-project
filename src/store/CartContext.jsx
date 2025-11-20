/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import {
  addCartItem,
  getCartByOrderId,
  updateCartItemQuantity,
} from "@/services/cartService";
import { useAuthContext } from "@/store/AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const defaultOrderId = import.meta.env.VITE_DEFAULT_ORDER_ID || "1";
  const [orderId] = useState(defaultOrderId);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, openAuthModal } = useAuthContext();

  const syncItems = useCallback((serverItems = []) => {
    setItems(
      serverItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        name: item.menuItem?.name,
      }))
    );
  }, []);

  const refreshCart = useCallback(async () => {
    if (!orderId || !isAuthenticated) {
      setItems([]);
      setError(
        isAuthenticated
          ? "Chưa xác định được mã đơn hàng"
          : "Bạn cần đăng nhập để sử dụng giỏ hàng"
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const order = await getCartByOrderId(orderId);
      syncItems(order?.items || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId, syncItems]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [isAuthenticated, refreshCart]);

  const notify = useCallback((variant, title, description) => {
    const message = title || "Thông báo";
    const options = description ? { description } : undefined;
    if (variant === "error") {
      toast.error(message, options);
      return;
    }
    if (variant === "success") {
      toast.success(message, options);
      return;
    }
    toast(message, options);
  }, []);

  const addItemToCart = useCallback(
    async ({ menuItemId, quantity = 1, price, name, meta }) => {
      if (!isAuthenticated) {
        openAuthModal("login");
        notify(
          "error",
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để thêm món vào giỏ hàng"
        );
        return;
      }

      if (!orderId) {
        notify("error", "Không thể thêm món", "Thiếu mã đơn hàng mặc định");
        return;
      }

      try {
        const existingItem = items.find(
          (item) => item.menuItemId === menuItemId
        );
        if (existingItem) {
          await updateCartItemQuantity(
            orderId,
            existingItem.id,
            existingItem.quantity + quantity
          );
        } else {
          await addCartItem(orderId, {
            menuItemId,
            quantity,
            price,
            meta: {
              name,
              ...meta,
            },
          });
        }
        await refreshCart();
        notify(
          "success",
          "Đã thêm vào giỏ",
          name ? `Đã thêm ${name} vào giỏ hàng của bạn` : "Món đã được thêm"
        );
      } catch (err) {
        notify(
          "error",
          "Không thể thêm món",
          err.message || "Vui lòng thử lại sau"
        );
      }
    },
    [items, notify, orderId, refreshCart]
  );

  const contextValue = useMemo(
    () => ({
      orderId,
      items,
      distinctCount: items.length,
      loading,
      error,
      refreshCart,
      syncItems,
      addItemToCart,
      notify,
      requireAuth: () => {
        if (isAuthenticated) return true;
        openAuthModal("login");
        notify(
          "error",
          "Vui lòng đăng nhập",
          "Tính năng này chỉ dành cho thành viên"
        );
        return false;
      },
    }),
    [
      addItemToCart,
      error,
      isAuthenticated,
      items,
      loading,
      notify,
      openAuthModal,
      orderId,
      refreshCart,
      syncItems,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext phải được sử dụng trong CartProvider");
  }
  return context;
};
