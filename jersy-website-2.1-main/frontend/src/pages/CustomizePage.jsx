import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useCart from '../hooks/useCart';
import JerseyCanvas from '../components/JerseyCanvas';
import Jersey3D from '../components/Jersey3D';
import LoaderStitch from '../components/LoaderStitch';

export default function CustomizePage() {
  const { id } = useParams();
  const api = useApi();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedColor, setSelectedColor] = useState('');
  const [nameText, setNameText] = useState('');
  const [numberText, setNumberText] = useState('');
  const [selectedFont, setSelectedFont] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [sleeveStyle, setSleeveStyle] = useState('full'); // 'full' | 'half'
  const [enable3D, setEnable3D] = useState(false); // 3D preview toggle
  const [webGLSupported, setWebGLSupported] = useState(false); // WebGL support check
  const jerseyCanvasRef = useRef(null);
  const jersey3DRef = useRef(null);

  // Check WebGL support and detect mobile devices
  useEffect(() => {
    // Check WebGL support
    let isWebGLSupported = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      isWebGLSupported = !!gl;
    } catch (e) {
      isWebGLSupported = false;
    }
    setWebGLSupported(isWebGLSupported);

    // Detect mobile devices and default to 2D preview
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    if (isMobile || !isWebGLSupported) {
      setEnable3D(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await api.get(`/products/${id}`);
        if (!isMounted) return;
        setProduct(data);
        setSelectedColor(data?.colors?.[0] || '');
        setSelectedFont(data?.fonts?.[0] || '');
        setSelectedSize(data?.sizes?.[0] || '');
        setSelectedVariant(data?.variants?.[0]?.id || data?.variants?.[0] || '');
      } catch (e) {
        if (isMounted) setError(e?.message || 'Failed to load product');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  const baseImage = useMemo(() => product?.images?.[0] || product?.image || '', [product]);

  async function handleAddToCart() {
    if (!product) return;
    const priceFromVariant = (() => {
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const match = product.variants.find((v) => (typeof v === 'string' ? v : v.id) === selectedVariant);
        if (match && typeof match !== 'string') return match.price;
      }
      return product.price;
    })();

    // Export the canvas image (try 3D first, then 2D)
    let previewImageURL = baseImage; // fallback to base image
    if (enable3D && jersey3DRef.current) {
      const exportedImage = jersey3DRef.current.exportImage();
      if (exportedImage) {
        previewImageURL = exportedImage;
      }
    } else if (jerseyCanvasRef.current) {
      const exportedImage = jerseyCanvasRef.current.exportImage();
      if (exportedImage) {
        previewImageURL = exportedImage;
      }
    }

    addToCart({
      productId: product.id,
      title: product.title || product.name,
      thumbnail: previewImageURL,
      previewImageURL: previewImageURL,
      options: {
        color: selectedColor,
        name: nameText,
        number: numberText,
        font: selectedFont,
        fontSize: fontSize,
        textColor: textColor,
        size: selectedSize,
        variant: selectedVariant,
        sleeveStyle: sleeveStyle,
      },
      quantity: 1,
      price: priceFromVariant ?? 0,
    });
  }

  if (loading) {
    return (
      <div className="container">
        <LoaderStitch message="We're stitching your jersey… 🪡✨" />
      </div>
    );
  }
  if (error) return <div className="container error">{error}</div>;
  if (!product) return <div className="container">Product not found</div>;

  return (
    <div className="container customize-layout">
      <section className="preview-pane">
        <div className="preview-canvas">
          {baseImage ? (
            enable3D ? (
              <Jersey3D
                ref={jersey3DRef}
                baseImageUrl={baseImage}
                colorHex={selectedColor}
                nameText={nameText}
                numberText={numberText}
                fontFamily={selectedFont || 'Arial'}
                fontSize={fontSize}
                textColor={textColor}
                sleeveStyle={sleeveStyle}
              />
            ) : (
              <JerseyCanvas
                ref={jerseyCanvasRef}
                baseImageUrl={baseImage}
                colorHex={selectedColor}
                nameText={nameText}
                numberText={numberText}
                fontFamily={selectedFont || 'Arial'}
                fontSize={fontSize}
                textColor={textColor}
                sleeveStyle={sleeveStyle}
              />
            )
          ) : (
            <div className="preview-placeholder" />
          )}
        </div>
        <div className="preview-controls">
          {/* 3D Preview Toggle - Only show if WebGL is supported */}
          {webGLSupported && (
            <div className="control-group preview-toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enable3D}
                  onChange={(e) => setEnable3D(e.target.checked)}
                />
                <span>3D Preview</span>
              </label>
            </div>
          )}
          {/* Sleeve Style Toggle */}
          <div className="mask-toggle">
            <label>
              <input
                type="radio"
                name="sleeve"
                checked={sleeveStyle === 'full'}
                onChange={() => setSleeveStyle('full')}
              />{' '}
              Full Sleeve
            </label>
            <label>
              <input
                type="radio"
                name="sleeve"
                checked={sleeveStyle === 'half'}
                onChange={() => setSleeveStyle('half')}
              />{' '}
              Half Sleeve
            </label>
          </div>
        </div>
      </section>

      <aside className="controls-pane">
        <h2>{product.title || product.name}</h2>

        {/* Colors */}
        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="control-group">
            <div className="control-label">Color</div>
            <div className="swatches">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`swatch ${selectedColor === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Name */}
        <div className="control-group">
          <div className="control-label">Name</div>
          <input
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
            placeholder="Enter name (e.g., Prakhar)"
            maxLength={20}
          />
        </div>

        {/* Number */}
        <div className="control-group">
          <div className="control-label">Jersey Number</div>
          <input
            type="text"
            value={numberText}
            onChange={(e) => setNumberText(e.target.value.replace(/\D/g, '').slice(0, 3))}
            placeholder="Enter number (e.g., 55)"
            maxLength={3}
          />
        </div>

        {/* Font Size */}
        <div className="control-group">
          <div className="control-label">Font Size</div>
          <input
            type="range"
            min="16"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{fontSize}px</span>
        </div>

        {/* Text Color */}
        <div className="control-group">
          <div className="control-label">Text Color</div>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
          />
        </div>

        {/* Font */}
        {Array.isArray(product.fonts) && product.fonts.length > 0 && (
          <div className="control-group">
            <div className="control-label">Font</div>
            <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
              {product.fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}

        {/* Size */}
        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <div className="control-group">
            <div className="control-label">Size</div>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              {product.sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Variant */}
        {Array.isArray(product.variants) && product.variants.length > 0 && (
          <div className="control-group">
            <div className="control-label">Variant</div>
            <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}>
              {product.variants.map((v) => {
                const id = typeof v === 'string' ? v : v.id;
                const label = typeof v === 'string' ? v : (v.label || v.name || v.id);
                return <option key={id} value={id}>{label}</option>;
              })}
            </select>
          </div>
        )}

        <button className="primary" onClick={handleAddToCart}>Add to Cart</button>
      </aside>
    </div>
  );
}


