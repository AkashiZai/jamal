import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function CustomizationModal({ product, onClose, onConfirm }) {
  const [sweetness, setSweetness] = useState('25%');
  const [milk, setMilk] = useState('นมสดวัวปกติ');
  const [extraShot, setExtraShot] = useState(false);
  const [brownSugarJelly, setBrownSugarJelly] = useState(false);

  // Calculate Extra Costs
  let extraPrice = 0;
  if (milk.includes('15')) extraPrice += 15;
  if (extraShot) extraPrice += 20;
  if (brownSugarJelly) extraPrice += 15;

  const totalPrice = product.price + extraPrice;

  const handleConfirm = () => {
    const selectedOptions = [`หวาน ${sweetness}`, milk];
    if (extraShot) selectedOptions.push('เพิ่มช็อต (+฿20)');
    if (brownSugarJelly) selectedOptions.push('บุกบราวน์ชูการ์ (+฿15)');

    onConfirm(product, {
      optionsText: selectedOptions.join(' • '),
      unitPrice: totalPrice,
    });
  };

  return (
    <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cream-300 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-cream-100 border-b border-cream-300 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-espresso-900 text-base sm:text-lg">
              {product.name}
            </h3>
            <span className="font-mono font-bold text-terracotta text-sm">
              ราคาเริ่มต้น ฿{product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-warmgray-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Options Form */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          
          {/* 1. Sweetness Level (NFR-02 Touch-friendly Large Targets) */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider">
              1. ระดับความหวาน (Sweetness Level)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '0%', desc: 'ไม่หวาน' },
                { label: '25%', desc: 'หวานน้อย' },
                { label: '50%', desc: 'หวานปกติ' },
                { label: '100%', desc: 'หวานมาก' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSweetness(item.label)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold border transition text-center flex flex-col items-center justify-center ${
                    sweetness === item.label
                      ? 'border-terracotta bg-terracotta-light text-terracotta shadow-sm ring-1 ring-terracotta'
                      : 'border-cream-300 bg-white text-espresso-900 hover:bg-cream-100'
                  }`}
                >
                  <span className="text-sm font-extrabold">{item.label}</span>
                  <span className="text-[10px] font-medium opacity-80">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Milk Options */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider">
              2. ประเภทนม (Milk Choices)
            </label>
            <div className="space-y-2">
              {[
                { name: 'นมสดวัวปกติ', price: 0 },
                { name: 'นมโอ๊ต Oatly (+15฿)', price: 15 },
                { name: 'นมอัลมอนด์ (+15฿)', price: 15 },
              ].map((item) => (
                <label
                  key={item.name}
                  onClick={() => setMilk(item.name)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${
                    milk === item.name
                      ? 'border-terracotta bg-terracotta-light text-terracotta shadow-sm ring-1 ring-terracotta'
                      : 'border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="milkChoice"
                      checked={milk === item.name}
                      onChange={() => setMilk(item.name)}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    {item.name}
                  </span>
                  <span className="font-mono font-bold text-terracotta">
                    {item.price > 0 ? `+฿${item.price.toFixed(2)}` : '+฿0.00'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Add-ons & Toppings */}
          <div>
            <label className="block text-xs font-bold text-espresso-900 mb-2 uppercase tracking-wider">
              3. ท็อปปิ้งเพิ่มเติม (Add-ons)
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${
                  extraShot
                    ? 'border-terracotta bg-terracotta-light text-terracotta ring-1 ring-terracotta'
                    : 'border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="rounded text-terracotta focus:ring-terracotta"
                  />
                  เพิ่มช็อตกาแฟเข้มข้น (Extra Espresso Shot)
                </span>
                <span className="font-mono font-bold text-terracotta">+฿20.00</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition ${
                  brownSugarJelly
                    ? 'border-terracotta bg-terracotta-light text-terracotta ring-1 ring-terracotta'
                    : 'border-cream-300 bg-white text-espresso-900 hover:bg-cream-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={brownSugarJelly}
                    onChange={(e) => setBrownSugarJelly(e.target.checked)}
                    className="rounded text-terracotta focus:ring-terracotta"
                  />
                  บุกบราวน์ชูการ์เจลลี่ (Brown Sugar Jelly)
                </span>
                <span className="font-mono font-bold text-terracotta">+฿15.00</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-cream-100 border-t border-cream-300 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-cream-300 hover:bg-cream-200 rounded-2xl text-xs font-bold text-warmgray-600 transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-2 w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>เพิ่มลงในบิล • ฿{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
