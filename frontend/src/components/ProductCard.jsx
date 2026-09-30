import React from 'react';

export default function ProductCard({ product, onSelect }) {
  const isOutOfStock = product.stock !== null && product.stock <= 0;
  const isLowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onSelect(product);
      }}
      className={`bg-white rounded-2xl border border-cream-300 p-3 flex flex-col justify-between h-fit self-start transition cursor-pointer select-none ${
        isOutOfStock
          ? 'opacity-60 pointer-events-none'
          : 'hover:border-terracotta hover:shadow-md active:scale-[0.98]'
      }`}
    >
      {/* Product Image */}
      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-cream-200 relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Low Stock Badge */}
        {isLowStock && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            เหลือ {product.stock} ชิ้น
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">
            สินค้าหมด (OUT OF STOCK)
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="font-bold text-xs text-espresso-900 line-clamp-1">
            {product.name}
          </div>
          <p className="text-[11px] text-warmgray-600 line-clamp-1 mt-0.5">
            {product.desc}
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-cream-200">
          <span className="font-mono font-bold text-terracotta text-sm tabular-nums">
            ฿{product.price.toFixed(2)}
          </span>
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              product.customizable
                ? 'bg-cream-200 text-espresso-900 hover:bg-terracotta hover:text-white'
                : 'bg-cream-200 text-espresso-900 hover:bg-terracotta hover:text-white'
            }`}
          >
            {product.customizable ? 'Custom' : '+ เพิ่ม'}
          </span>
        </div>
      </div>
    </div>
  );
}
