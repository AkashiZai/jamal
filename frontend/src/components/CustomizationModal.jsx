import React, { useState } from 'react';

export default function CustomizationModal({ product, onClose, onConfirm }) {
  const [sweetness, setSweetness] = useState('25%');
  const [milk, setMilk] = useState('นมสดวัวแท้ (Fresh Milk)');
  const [extraShot, setExtraShot] = useState(false);
  const [brownSugarJelly, setBrownSugarJelly] = useState(false);

  // Extra cost calculations
  let extraPrice = 0;
  if (milk.includes('+15') || milk.includes('Oat') || milk.includes('Almond')) extraPrice += 15;
  if (extraShot) extraPrice += 20;
  if (brownSugarJelly) extraPrice += 15;

  const totalPrice = product.price + extraPrice;

  const handleConfirm = () => {
    const selectedOptions = [`หวาน ${sweetness}`];
    if (milk.includes('Oat')) selectedOptions.push('นมโอ๊ต (+฿15)');
    else if (milk.includes('Almond')) selectedOptions.push('นมอัลมอนด์ (+฿15)');

    if (extraShot) selectedOptions.push('เพิ่มช็อต (+฿20)');
    if (brownSugarJelly) selectedOptions.push('บุกบราวน์ชูการ์ (+฿15)');

    onConfirm(product, {
      optionsText: selectedOptions.join(' • '),
      unitPrice: totalPrice,
    });
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-300 overflow-hidden select-none">
        
        {/* Header */}
        <div className="p-5 bg-cream-100 border-b border-cream-300 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-espresso-900 text-lg leading-tight">
              {product.name}
            </h2>
            <span className="font-mono font-bold text-terracotta text-sm">
              ราคาเริ่มต้น ฿{product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-warmgray-600 flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Body Options */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {/* 1. Sweetness */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2">
              1. ระดับความหวาน (Sweetness Level)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '0%', sub: 'ไม่หวาน' },
                { label: '25%', sub: 'หวานน้อย' },
                { label: '50%', sub: 'หวานปกติ' },
                { label: '100%', sub: 'หวานมาก' },
              ].map((sw) => (
                <button
                  key={sw.label}
                  type="button"
                  onClick={() => setSweetness(sw.label)}
                  className={`py-3 px-2 rounded-xl text-xs text-center transition ${
                    sweetness === sw.label
                      ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                      : 'border border-cream-300 bg-white text-espresso-900 font-semibold hover:bg-cream-50'
                  }`}
                >
                  <span className="text-sm font-extrabold">{sw.label}</span>
                  <br />
                  <span className="text-[10px] text-warmgray-600">{sw.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Milk Choice */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2">
              2. ประเภทนม (Milk Choice)
            </label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'fresh', name: 'นมสดวัวแท้ (Fresh Milk)', price: 0 },
                { id: 'oat', name: 'นมโอ๊ต Oatly (Oat Milk)', price: 15 },
                { id: 'almond', name: 'นมอัลมอนด์ (Almond Milk)', price: 15 },
              ].map((m) => {
                const isSelected = milk.includes(m.name);
                return (
                  <div
                    key={m.id}
                    onClick={() => setMilk(m.name)}
                    className={`p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                      isSelected
                        ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                        : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                    }`}
                  >
                    <span>
                      {isSelected ? '✓ ' : ''}
                      {m.name}
                    </span>
                    <span className="font-mono text-warmgray-600 font-bold">
                      {m.price > 0 ? `+฿${m.price.toFixed(2)}` : '+฿0.00'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Add-ons */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2">
              3. ท็อปปิ้งเพิ่มเติม (Add-ons)
            </label>
            <div className="space-y-2 text-xs">
              <div
                onClick={() => setExtraShot(!extraShot)}
                className={`p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                  extraShot
                    ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                    : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }`}
              >
                <span>
                  {extraShot ? '✓ ' : ''}เพิ่มช็อตกาแฟ (Extra Espresso Shot)
                </span>
                <span className="font-mono font-bold text-terracotta">+฿20.00</span>
              </div>

              <div
                onClick={() => setBrownSugarJelly(!brownSugarJelly)}
                className={`p-3 rounded-xl cursor-pointer flex justify-between items-center transition ${
                  brownSugarJelly
                    ? 'border-2 border-terracotta bg-terracotta-light text-terracotta font-bold shadow-sm'
                    : 'border border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }`}
              >
                <span>
                  {brownSugarJelly ? '✓ ' : ''}บุกบราวน์ชูการ์เจลลี่ (Brown Sugar Jelly)
                </span>
                <span className="font-mono font-bold text-terracotta">+฿15.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-cream-100 border-t border-cream-300 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-cream-300 rounded-2xl text-xs font-bold text-warmgray-600 hover:bg-cream-200 transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-2 w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            เพิ่มลงในบิล • ฿{totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
