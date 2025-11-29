// POLISH UPDATE - Created ProductImage component with placeholder fallback
import { useState } from 'react';
import placeholderJersey from '../assets/placeholder-jersey.svg';

export default function ProductImage({ src, alt = 'Product', className = '' }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(placeholderJersey);
    }
  };

  return (
    <div className={`product-image-container ${className}`}>
      <img
        src={imgSrc || placeholderJersey}
        alt={alt}
        loading="lazy"
        onError={handleError}
        className="product-image"
      />
    </div>
  );
}

