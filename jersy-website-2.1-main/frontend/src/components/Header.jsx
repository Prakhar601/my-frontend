import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartPanel from './CartPanel';
import CartIcon from './CartIcon';

export default function Header() {
  const { items, clearCart, getCount } = useCart();
  const [open, setOpen] = useState(false);

  function handleCheckout() {
    if (!items || items.length === 0) return;
    const site = 'Jersey Studio';
    const subject = `Order from ${site}`;
    const lines = [];
    items.forEach((it, idx) => {
      lines.push(`#${idx + 1} ${it.title} x${it.quantity} - $${Number(it.price).toFixed(2)}`);
      if (it.thumbnail) lines.push(`Image: ${it.thumbnail}`);
      if (it.options && Object.keys(it.options).length > 0) {
        lines.push(`Options: ${JSON.stringify(it.options)}`);
      }
      lines.push('');
    });
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity || 1), 0);
    lines.push(`Total: $${total.toFixed(2)}`);
    const body = encodeURIComponent(lines.join('\n'));
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
  }

  function handleExport() {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <header className="app-header">
      <div className="container header-inner">
        <Link to="/" className="brand">Jersey Studio</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cart" className="cart-icon-link" aria-label="View cart">
            <CartIcon count={getCount()} />
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="nav-button cart-panel-toggle">
            Quick View
          </button>
          <button onClick={clearCart} className="nav-button">Clear</button>
        </nav>
      </div>
      {open && (
        <CartPanel
          items={items}
          onClose={() => setOpen(false)}
          onCheckout={handleCheckout}
          onExport={handleExport}
        />
      )}
    </header>
  );
}


