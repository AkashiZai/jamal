import React from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const isOutOfStock = product.stock !== null && product.stock <= 0;
  const isLowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onSelect(product);
      }}
      className={`bg-white rounded-2xl border transition-all duration-200 p-3 flex flex-col justify-between group select-none ${
        isOutOfStock
          ? 'border-cream-300 opacity-60 pointer-events-none'
          : 'border-cream-300 hover:border-terracotta hover:shadow-lg cursor-pointer active:scale-[0.98]'
      }`}
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cream-200 mb-2.5">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-espresso-900/80 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
            <span className="text-white font-extrabold text-xs tracking-wider uppercase bg-red-600 px-2.5 py-1 rounded-md shadow">
              สินค้าหมด (Out of Stock)
            </span>
          </div>
        )}

        {/* Low Stock Badge (FR-03) */}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-md font-mono">
            เหลือ {product.stock} ชิ้น
          </div>
        )}

        {/* Customizer Indicator */}
        {product.customizable && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 bg-espresso-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <SlidersHorizontal className="w-2.5 h-2.5 text-terracotta" />
            <span>ปรับแต่งได้</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-espresso-900 line-clamp-1 leading-snug">
            {product.name}
          </h4>
          <p className="text-[11px] text-warmgray-600 line-clamp-1 mt-0.5">
            {product.desc}
          </p>
        </div>

        {/* Bottom Bar: Price & Add Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-cream-200">
          <span className="font-mono font-extrabold text-terracotta text-sm sm:text-base tabular-nums">
            ฿{product.price.toFixed(2)}
          </span>

          <button
            type="button"
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
              product.customizable
                ? 'bg-terracotta-light text-terracotta hover:bg-terracotta hover:text-white'
                : 'bg-cream-200 text-espresso-900 hover:bg-terracotta hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{product.customizable ? 'เลือก' : 'เพิ่ม'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
