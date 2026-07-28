import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
const savedCart = typeof window !== "undefined"
  ? JSON.parse(localStorage.getItem("cart"))
  : null;

const initialState = savedCart || {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  totalDiscountedPrice: 0
};

function getProductId(item) {
  const productId = typeof item.productId === "object"
    ? item.productId._id
    : item.productId;
  return String(productId);
}

function matchesCartItem(item, { productId, color, size }) {
  return getProductId(item) === String(productId) && item.color === color && item.size === size;
}

function recalculateTotals(state) {
  state.totalQuantity = state.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  state.totalPrice = state.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0);
  state.totalDiscountedPrice = state.items.reduce(
    (sum, i) => sum + (i.quantity || 0) * (i.discountedPrice ?? i.price ?? 0),
    0
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set entire cart (used when fetching from backend)
    setCart(state, action) {
      state.items = action.payload
      recalculateTotals(state);
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Add new item
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find(
        i => matchesCartItem(i, item)
      );

      if (existing) existing.quantity += item.quantity;
      else state.items.push(item);

      recalculateTotals(state);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Update quantity
    updateQuantity(state, action) {
      const { productId, color, size, quantity } = action.payload;
      const item = state.items.find(
        i => matchesCartItem(i, { productId, color, size })
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !matchesCartItem(i, { productId, color, size })
          );
        } else {
          item.quantity = quantity;
        }
      }

      recalculateTotals(state)

      localStorage.setItem("cart", JSON.stringify(state))
    },

    // Remove single item (clean and explicit)
    removeItem(state, action) {
      const { productId, color, size } = action.payload;
      state.items = state.items.filter(
        i => !matchesCartItem(i, { productId, color, size })
      );

      recalculateTotals(state);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    // 🧹 Clear all items
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalDiscountedPrice = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, addToCart, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
