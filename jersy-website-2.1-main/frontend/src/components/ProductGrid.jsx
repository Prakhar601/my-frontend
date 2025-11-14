import ProductCard from './ProductCard';

export default function ProductGrid({ products, onCustomize }) {
  const safeProducts = Array.isArray(products) ? products : [];
  return (
    <div className="product-grid">
      {safeProducts.map((p) => (
        <ProductCard key={p.id} product={p} onCustomize={onCustomize} />
      ))}
      {safeProducts.length === 0 && <div>No products available.</div>}
    </div>
  );
}


