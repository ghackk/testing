import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const pageSize = 3;

  useEffect(() => {
    fetchData();
  }, [search, page]);

  async function fetchData() {
    try {
      const res = await fetch(`http://localhost:5000/api/products?search=${search}&page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      
      if (res.status === 404) {
        setItems([]);
        setTotal(0);
        return;
      }
      
      setItems(data.items.map(i => ({ id: i.id, name: i.name, price: i.price })));
      setTotal(data.total);
    } catch (err) {
      console.error("fetch error", err);
      setItems([]);
      setTotal(0);
    }
  }

  function formatPrice(p) {
    if (p === null || p === undefined) return "N/A";
    return `₹${Number(p).toFixed(2)}`;
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
    });
  }

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
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <div>
      {/* Header with Cart Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>ZestFindz — Product Explorer</h2>
        <button 
          onClick={() => setShowCart(!showCart)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🛒 Cart ({getCartItemCount()})
        </button>
      </div>

      <input 
        placeholder="Search products" 
        value={search} 
        onChange={e => { setSearch(e.target.value); setPage(1); }} 
        style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          background: 'white',
          border: '1px solid #ddd',
          padding: '20px',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Your Cart</h3>
            <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
          
          {cart.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                  <div><strong>{item.name}</strong></div>
                  <div>{formatPrice(item.price)}</div>
                  <div style={{ marginTop: '5px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '2px 6px', borderRadius: '3px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #ddd', paddingTop: '10px', marginTop: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Total: {formatPrice(getCartTotal())}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product List */}
      <div style={{ marginTop: 12 }}>
        {items.length === 0 && <div>No products found.</div>}
        {items.map(it => (
          <div key={it.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
            <div><strong>{it.name}</strong></div>
            <div>{formatPrice(it.price)}</div>
            <button 
              onClick={() => addToCart(it)}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                marginTop: '5px'
              }}
            >
              Add to Cart
            </button>
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
