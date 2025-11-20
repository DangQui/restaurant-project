import { useCallback, useEffect, useReducer } from "react";
import {
  getCartByOrderId,
  removeCartItem,
  updateCartItemQuantity,
  updateOrderDelivery,
} from "@/services/cartService";
import { useCartContext } from "@/store/CartContext";

const SHIPPING_FEE = 6000;

const initialState = {
  order: null,
  items: [],
  subtotal: 0,
  shippingFee: 0,
  discount: 0,
  total: 0,
  loading: true,
  initialLoading: true,
  error: null,
  updatingItemId: null,
  removingItemId: null,
  couponStatus: "idle",
  couponCode: null,
  addressSaving: false,
};

const calculateTotal = (subtotal, discount, shipping) => {
  return Math.max(subtotal - discount + shipping, 0);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true, error: null };
    case "SUCCESS": {
      const adjustedDiscount = Math.min(
        state.discount,
        action.payload.subtotal
      );
      return {
        ...state,
        loading: false,
        initialLoading: false,
        order: action.payload.order,
        items: action.payload.items,
        subtotal: action.payload.subtotal,
        shippingFee: action.payload.shippingFee,
        discount: adjustedDiscount,
        total: calculateTotal(
          action.payload.subtotal,
          adjustedDiscount,
          action.payload.shippingFee
        ),
        error: null,
      };
    }
    case "FAILURE":
      return {
        ...state,
        loading: false,
        initialLoading: false,
        error: action.payload,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_ITEM_PENDING":
      return { ...state, updatingItemId: action.payload };
    case "UPDATE_ITEM_DONE":
      return { ...state, updatingItemId: null };
    case "REMOVE_ITEM_PENDING":
      return { ...state, removingItemId: action.payload };
    case "REMOVE_ITEM_DONE":
      return { ...state, removingItemId: null };
    case "COUPON_REQUEST":
      return { ...state, couponStatus: "loading" };
    case "COUPON_SUCCESS": {
      const discount = Math.min(action.payload.discount, state.subtotal);
      return {
        ...state,
        couponStatus: "success",
        couponCode: action.payload.code,
        discount,
        total: calculateTotal(state.subtotal, discount, state.shippingFee),
      };
    }
    case "COUPON_FAILURE":
      return { ...state, couponStatus: "error" };
    case "ADDRESS_REQUEST":
      return { ...state, addressSaving: true };
    case "ADDRESS_DONE":
      return { ...state, addressSaving: false };
    default:
      return state;
  }
};

export const useCart = (orderId) => {
  const { syncItems, notify, requireAuth } = useCartContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCart = useCallback(() => {
    if (!requireAuth()) {
      dispatch({
        type: "FAILURE",
        payload: "Vui lòng đăng nhập để xem giỏ hàng",
      });
      return;
    }

    if (!orderId) {
      dispatch({ type: "FAILURE", payload: "Không xác định được đơn hàng" });
      return;
    }

    dispatch({ type: "REQUEST" });

    getCartByOrderId(orderId)
      .then((order) => {
        const items = (order?.items || []).map((item) => {
          const unitPrice =
            typeof item.price === "number"
              ? item.price
              : item.menuItem?.price || 0;

          return {
            id: item.id,
            menuItemId: item.menuItemId,
            name: item.menuItem?.name || `Món #${item.menuItemId}`,
            description:
              item.menuItem?.description || "Món ăn trong đơn hàng hiện tại",
            category: item.menuItem?.category || order?.orderType || "menu",
            imageUrl:
              item.menuItem?.imageUrl ||
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
            quantity: item.quantity,
            price: unitPrice,
            subtotal: unitPrice * item.quantity,
          };
        });

        const subtotal = items.reduce(
          (sum, current) => sum + current.subtotal,
          0
        );
        const shippingFee = items.length ? SHIPPING_FEE : 0;

        dispatch({
          type: "SUCCESS",
          payload: {
            order,
            items,
            subtotal,
            shippingFee,
          },
        });
        syncItems(order?.items || []);
      })
      .catch((error) => {
        dispatch({
          type: "FAILURE",
          payload: error.message || "Không thể tải giỏ hàng",
        });
      });
  }, [orderId, requireAuth, syncItems]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateItemQuantity = useCallback(
    async (itemId, quantity) => {
      if (!orderId || !itemId || quantity < 1) return;
      if (!requireAuth()) return;
      dispatch({ type: "UPDATE_ITEM_PENDING", payload: itemId });
      try {
        await updateCartItemQuantity(orderId, itemId, quantity);
        dispatch({ type: "UPDATE_ITEM_DONE" });
        fetchCart();
      } catch (error) {
        dispatch({ type: "UPDATE_ITEM_DONE" });
        const message = error.message || "Không thể cập nhật số lượng";
        dispatch({ type: "SET_ERROR", payload: message });
        notify("error", "Không thể cập nhật số lượng", message);
      }
    },
    [fetchCart, notify, orderId, requireAuth]
  );

  const removeItem = useCallback(
    async (itemId) => {
      if (!orderId || !itemId) return;
      if (!requireAuth()) return;
      dispatch({ type: "REMOVE_ITEM_PENDING", payload: itemId });
      try {
        await removeCartItem(orderId, itemId);
        dispatch({ type: "REMOVE_ITEM_DONE" });
        fetchCart();
      } catch (error) {
        dispatch({ type: "REMOVE_ITEM_DONE" });
        const message = error.message || "Không thể xoá món";
        dispatch({ type: "SET_ERROR", payload: message });
        notify("error", "Không thể xoá món", message);
      }
    },
    [fetchCart, notify, orderId, requireAuth]
  );

  const applyCoupon = useCallback(
    async (code) => {
      if (!requireAuth()) {
        dispatch({ type: "COUPON_FAILURE" });
        return;
      }
      dispatch({ type: "COUPON_REQUEST" });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const normalizedCode = code.trim().toUpperCase();
      if (!normalizedCode) {
        dispatch({ type: "COUPON_FAILURE" });
        notify("error", "Mã giảm giá chưa hợp lệ", "Vui lòng nhập mã giảm giá");
        return;
      }

      try {
        let discount = 0;
        let message = "";

        if (normalizedCode === "WOWWRAPS") {
          discount = Math.round(state.subtotal * 0.1);
          message = "Đã áp dụng giảm 10% cho toàn bộ món ăn";
        } else if (normalizedCode === "FREESHIP") {
          discount = state.shippingFee;
          message = "Miễn phí vận chuyển cho đơn này";
        } else if (normalizedCode === "TASTY50") {
          discount = 50000;
          message = "Giảm ngay 50.000đ";
        } else {
          throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }

        dispatch({
          type: "COUPON_SUCCESS",
          payload: {
            code: normalizedCode,
            discount,
            message,
          },
        });
        notify("success", "Đã áp dụng mã", message);
      } catch (error) {
        dispatch({ type: "COUPON_FAILURE" });
        notify("error", "Không áp dụng được mã", error.message);
      }
    },
    [notify, state.shippingFee, state.subtotal]
  );

  const saveDeliveryInfo = useCallback(
    async (payload) => {
      if (!orderId || !requireAuth()) return;
      dispatch({ type: "ADDRESS_REQUEST" });
      try {
        await updateOrderDelivery(orderId, payload);
        dispatch({ type: "ADDRESS_DONE" });
        notify("success", "Đã lưu địa chỉ giao hàng");
        fetchCart();
      } catch (error) {
        dispatch({ type: "ADDRESS_DONE" });
        const message = error.message || "Không thể lưu thông tin giao hàng";
        notify("error", "Không thể lưu thông tin", message);
      }
    },
    [fetchCart, notify, orderId]
  );

  return {
    ...state,
    refresh: fetchCart,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    saveDeliveryInfo,
  };
};
