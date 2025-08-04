console.log("==> Combined limit checker loaded");

let lastValidState = true;

function getCartTotalFromInputs() {
  console.log("[Step 1] Getting total quantity from input fields...");
  const priceElements = document.querySelectorAll('input[name="updates[]"]');
  let totalQuantity = 0;

  priceElements.forEach((input, i) => {
    const qty = parseInt(input.value, 10);
    console.log(`  - Input ${i + 1}: value=${input.value}, parsed=${qty}`);
    if (!isNaN(qty)) {
      totalQuantity += qty;
    }
  });

  console.log("  => Total Quantity from DOM inputs:", totalQuantity);
  return totalQuantity;
}

async function validateCartLimits() {

  const { minPrice, maxPrice, minQty, maxQty } = window.OrderLimitConfig || {};
  console.log("Config Values:", { minPrice, maxPrice, minQty, maxQty });

   const minP = minPrice ? parseFloat(minPrice) : null;
  const maxP = maxPrice ? parseFloat(maxPrice) : null;
  const minQ = minQty ? parseInt(minQty, 10) : null;
  const maxQ = maxQty ? parseInt(maxQty, 10) : null;
  console.log("Parsed Limits:", { minP, maxP, minQ, maxQ });

  const res = await fetch("/cart.js", {
    headers: { "Content-Type": "application/json" }
  });
  const cart = await res.json();
  console.log("Cart Data Received:", cart);

  const subtotal = cart.items_subtotal_price / 100;
  const quantity = cart.item_count;

  console.log(" Subtotal :", subtotal);
  console.log("Quantity:", quantity);

  const checkoutBtn = document.querySelector('button[type="submit"][name="checkout"]');


  if (!checkoutBtn) {
    console.log("Checkout button not found.");
    return;
  }

  if (minP !== null && subtotal < minP) {
    console.log("Subtotal below min limit");
    blockCheckout(checkoutBtn, `Minimum ₹${minP} required`);
    console.log(`Please add more items. Minimum order value is ₹${minP}`);
    return;
  }

  if (maxP !== null && subtotal > maxP) {
    console.log("Subtotal above max limit");
    blockCheckout(checkoutBtn, `Max ₹${maxP} exceeded`);
    console.log(`Please remove some items. Maximum order value is ₹${maxP}`);
    return;
  }

  if (minQ !== null && quantity < minQ) {
    console.log("Quantity below min limit");
    blockCheckout(checkoutBtn, `Min ${minQ} qty required`);
    console.log(`Please add more items. Minimum quantity is ${minQ}`);
    return;
  }

  if (maxQ !== null && quantity > maxQ) {
    console.log("Quantity above max limit");
    blockCheckout(checkoutBtn, `Max ${maxQ} qty exceeded`);
    console.log(`Please reduce quantity. Maximum allowed is ${maxQ}`);
    return;
  }

  console.log("Cart is within limits. Enabling checkout.");
  allowCheckout(checkoutBtn);

}

function blockCheckout(button, message) {
  console.log("[Step 4] Blocking checkout:", message);
  button.style.opacity = "0.6";
  button.style.backgroundColor = "#ccc";
  button.style.cursor = "not-allowed";
  button.textContent = message;

  button.addEventListener("click", preventCheckout);

  lastValidState = false;
}

function preventCheckout(e) {
  console.log("[Step 5] Checkout prevented.");
  e.preventDefault();
}

function allowCheckout(button) {
  if (!lastValidState) {
    console.log("[Step 6] Restoring checkout button to normal state.");
    button.style.opacity = "1";
    button.style.backgroundColor = "";
    button.style.cursor = "pointer";
    button.textContent = "Checkout";

    button.removeEventListener("click", preventCheckout);
    lastValidState = true;
  } else {
    console.log("[Step 6] Checkout was already valid. No changes needed.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[Step 7] DOM Loaded. Setting up MutationObserver...");

  const cartItems = document.querySelector("cart-items");

  if (cartItems) {
    const observer = new MutationObserver(() => {
      console.log(" Cart changed. Running validation...");
      setTimeout(() => {
        validateCartLimits();
      }, 300);
    });

    observer.observe(cartItems, { childList: true, subtree: true });
  } else {
    console.warn("<cart-items> element not found.");
  }

  validateCartLimits();
});
