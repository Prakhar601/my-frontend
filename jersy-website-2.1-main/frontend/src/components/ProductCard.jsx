export default function ProductCard({ product, onCustomize }) {
  const img = product?.thumbnails?.[0] || product?.images?.[0] || product?.image || '';
  const price = product?.price ?? product?.variants?.[0]?.price ?? '';
  const title = product?.title || product?.name || 'Product';

  return (
    <div className="product-card">
      <div className="product-thumb">
        {img ? <img src={img} alt={title} /> : <div className="thumb-placeholder" />}
      </div>
      <div className="product-info">
        <div className="product-name">{title}</div>
        {price !== '' && <div className="product-price">{typeof price === 'number' ? `$${price.toFixed(2)}` : price}</div>}
      </div>
      <button className="secondary" onClick={() => onCustomize(product?.id)}>Start Customizing</button>
    </div>
  );
}


