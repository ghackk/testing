import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart]= useState([]);
  const [total, setTotal] = useState(0);

  const pageSize = 3;

  useEffect(() => {
    fetchData();
  }, [search, page]);

  async function fetchData() {
    try {
      // BUG: wrong URL path (typo)
      const res = await fetch(`http://localhost:5000/ap/products?search=${search}&page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      // BUG: code expects data.items but API returns items in a different shape when error
      if (data.error) {
        setItems([]);
        setTotal(0);
        return;
      }
      // BUG: wrong key mapping: uses productId instead of id
      setItems(data.items.map(i => ({ id: i.productId, name: i.name, price: i.price })));
      setTotal(data.total);
    } catch (err) {
      console.error("fetch error", err);
    }
  }

  function formatPrice(p) {
    // BUG: broken formatting that can produce NaN if p undefined
    return `₹${(p).toFixed(2)}`;
  }

function addToCart(product) {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.id === product.id);
    if (existingItem) {
      return prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prevCart, { ...product, quantity: 1 }];
  });  } 

  function removeFromCart(productId) {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  return (
    <div> 
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h3>Products</h3>
      <button onClick={() => setShowCart(!showCart)}>
        Cart ({getCartItemCount()})
      </button>
      </div>
      {showCart && (
        <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
          <h4>Shopping Cart</h4>
          {cart.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <span>{item.name} - {formatPrice(item.price)} x </span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                    style={{ width: 40 }}
                  />
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 8 }}>
                    Remove
                  </button>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <strong>Total: {formatPrice(getCartTotal())}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      <input placeholder="Search products" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <div style={{ marginTop: 12 }}>
        {items.length === 0 && <div>No products found.</div>}
        {items.map(it => (
          <div key={it.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
            <div><strong>{it.name}</strong></div>
            <div>{formatPrice(it.price)}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span style={{ margin: "0 8px" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
      <div style={{ marginTop: 8 }}>Total: {total}</div>
    </div>
  );
}
