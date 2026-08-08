import React, { useState } from 'react';
import { CropBatch, User, CartItem, StoreOrder, LanguageMode } from '../types';
import { getTranslation } from '../utils/translations';
import { ShoppingCart, Search, Filter, ShieldCheck, MapPin, CheckCircle, Tag, Truck, CreditCard, ChevronRight, X, Plus, Minus, Check } from 'lucide-react';

interface PublicECommerceStoreProps {
  cropBatches: CropBatch[];
  activeUser: User;
  lang: LanguageMode;
  onPlaceOrder: (order: StoreOrder) => void;
  triggerNotificationToast: (msg: string) => void;
  addLog: (msg: string) => void;
}

export const PublicECommerceStore: React.FC<PublicECommerceStoreProps> = ({
  cropBatches,
  activeUser,
  lang,
  onPlaceOrder,
  triggerNotificationToast,
  addLog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrderConfirmed, setLastOrderConfirmed] = useState<StoreOrder | null>(null);

  // Form state
  const [buyerName, setBuyerName] = useState(activeUser.name || "");
  const [buyerPhone, setBuyerPhone] = useState(activeUser.phone_number || "+8801700000000");
  const [shippingAddress, setShippingAddress] = useState(activeUser.upazila_district || "Gulshan 2, Dhaka");
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Escrow' | 'Cash on Delivery'>("Escrow");

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Filter batches
  const availableBatches = cropBatches.filter(batch => batch.status === "AVAILABLE" && batch.quantity_kg > 0);

  const filteredBatches = availableBatches.filter(batch => {
    const matchesCategory = selectedCategory === "ALL" || batch.crop_name.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesGrade = selectedGrade === "ALL" || batch.production_grade === selectedGrade;
    const matchesSearch = searchQuery === "" ||
      batch.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.upazila_district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesGrade && matchesSearch;
  });

  const handleAddToCart = (batch: CropBatch) => {
    setCart(prev => {
      const existing = prev.find(item => item.batch.batch_id === batch.batch_id);
      if (existing) {
        const newQty = Math.min(existing.order_quantity_kg + 50, batch.quantity_kg);
        return prev.map(item =>
          item.batch.batch_id === batch.batch_id ? { ...item, order_quantity_kg: newQty } : item
        );
      } else {
        return [...prev, { batch, order_quantity_kg: Math.min(100, batch.quantity_kg) }];
      }
    });
    triggerNotificationToast(`🛒 ${batch.crop_name} ${lang === 'BN' ? 'কার্টে যুক্ত হয়েছে' : 'added to cart'}`);
  };

  const handleUpdateCartQty = (batchId: number, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.batch.batch_id !== batchId));
    } else {
      setCart(prev => prev.map(item => {
        if (item.batch.batch_id === batchId) {
          const maxAvailable = item.batch.quantity_kg;
          return { ...item, order_quantity_kg: Math.min(qty, maxAvailable) };
        }
        return item;
      }));
    }
  };

  const handleDirectBuy = (batch: CropBatch) => {
    setCart([{ batch, order_quantity_kg: Math.min(100, batch.quantity_kg) }]);
    setIsCheckoutOpen(true);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.batch.base_price_per_kg * item.order_quantity_kg), 0);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!buyerName || !buyerPhone || !shippingAddress) {
      alert(lang === 'BN' ? "দয়া করে আপনার নাম, ফোন এবং ঠিকানা প্রদান করুন।" : "Please fill in buyer name, phone, and delivery address.");
      return;
    }

    const newOrder: StoreOrder = {
      order_id: Date.now(),
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      items: cart.map(item => ({
        batch_id: item.batch.batch_id,
        crop_name: item.batch.crop_name,
        farmer_name: item.batch.farmer_name,
        quantity_kg: item.order_quantity_kg,
        unit_price: item.batch.base_price_per_kg,
        subtotal: item.order_quantity_kg * item.batch.base_price_per_kg
      })),
      total_amount: calculateTotal(),
      created_at: new Date().toLocaleString(),
      status: "CONFIRMED"
    };

    onPlaceOrder(newOrder);
    setLastOrderConfirmed(newOrder);
    addLog(`[E-Commerce] New order #${newOrder.order_id} placed by '${buyerName}' for ৳${newOrder.total_amount.toLocaleString()} via ${paymentMethod}.`);
    triggerNotificationToast(t('orderSuccess'));
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-[#1A3816] via-[#2D4F1E] to-[#1e3818] rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'BN' ? "১০০% যাচাইকৃত কৃষক ও সরকারি ল্যাব সার্টিফাইড" : "100% Certified Direct Farmer Marketplace"}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t('storeTitle')}
          </h2>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
            {t('storeSubtitle')}
          </p>

          {/* QUICK STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-medium">
            <div>
              <span className="block text-gray-300">{lang === 'BN' ? "উপলব্ধ শস্য" : "Active Batches"}</span>
              <strong className="text-lg font-bold text-emerald-400">{availableBatches.length} {lang === 'BN' ? "টি লট" : "Lots"}</strong>
            </div>
            <div>
              <span className="block text-gray-300">{lang === 'BN' ? "সুরক্ষিত পেমেন্ট" : "Smart Escrow"}</span>
              <strong className="text-lg font-bold text-amber-400">bKash / Nagad / Bank</strong>
            </div>
            <div>
              <span className="block text-gray-300">{lang === 'BN' ? "ডিএই কোয়ালিটি" : "DAE Quality"}</span>
              <strong className="text-lg font-bold text-sky-400">{lang === 'BN' ? "গ্রেড A ও B প্রিমিয়াম" : "Grade A Certified"}</strong>
            </div>
            <div>
              <span className="block text-gray-300">{lang === 'BN' ? "পরিবহন খরচ" : "Transport"}</span>
              <strong className="text-lg font-bold text-emerald-300">{lang === 'BN' ? "৩২% পরিবহন সাশ্রয়" : "Pooled Truck Freight"}</strong>
            </div>
          </div>
        </div>

        {/* CART TRIGGER BUTTON */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="absolute top-6 right-6 bg-[#F97316] hover:bg-[#ea6305] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 font-bold text-xs transition-all cursor-pointer active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t('cart')}</span>
          {cart.length > 0 && (
            <span className="bg-white text-[#F97316] font-black px-2 py-0.5 rounded-full text-[11px]">
              {cart.reduce((sum, i) => sum + i.order_quantity_kg, 0)} kg
            </span>
          )}
        </button>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-5 rounded-3xl border border-[#1A2A1A]/10 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'BN' ? "ফসল, কৃষকের নাম বা জেলা খুঁজুন..." : "Search crops, farmer name, or district..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
            />
          </div>

          {/* Quality Grade Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#2D4F1E]" /> {lang === 'BN' ? "গ্রেড মান:" : "Grade:"}
            </span>
            {["ALL", "A", "B", "C"].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedGrade === grade
                    ? "bg-[#2D4F1E] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {grade === "ALL" ? (lang === 'BN' ? "সব গ্রেড" : "All Grades") : `Grade ${grade}`}
              </button>
            ))}
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 text-xs font-medium">
          <span className="text-gray-400 text-[11px] font-bold uppercase">{lang === 'BN' ? "শস্য ক্যাটাগরি:" : "Crop Type:"}</span>
          {[
            { id: "ALL", labelEn: "All Crops", labelBn: "সব ফসল" },
            { id: "Rice", labelEn: "Rice (Paddy)", labelBn: "ধান / চাল" },
            { id: "Potato", labelEn: "Potato", labelBn: "আলু" },
            { id: "Tomato", labelEn: "Tomato", labelBn: "টমেটো" },
            { id: "Mustard", labelEn: "Mustard", labelBn: "সরষে" },
            { id: "Jute", labelEn: "Jute", labelBn: "পাট" }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#F97316] text-white shadow-sm"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {lang === 'BN' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

      </div>

      {/* STORE CARDS GRID */}
      {filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map(batch => (
            <div
              key={batch.batch_id}
              className="bg-white rounded-3xl border border-[#1A2A1A]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Crop Image & Badge Header */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={batch.imageUrl || "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"}
                    alt={batch.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Quality Grade Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow ${
                      batch.production_grade === "A" ? "bg-emerald-600" :
                      batch.production_grade === "B" ? "bg-sky-600" : "bg-amber-600"
                    }`}>
                      Grade {batch.production_grade || "A"} Certified
                    </span>
                  </div>

                  {/* Officer Verification Badge */}
                  {batch.officer_verified && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>DAE Verified</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-black text-white drop-shadow">{batch.crop_name}</h3>
                    <p className="text-xs text-gray-200 flex items-center gap-1 drop-shadow">
                      <MapPin className="w-3 h-3 text-amber-400" /> {batch.upazila_district}
                    </p>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 space-y-4">
                  
                  {/* Farmer info */}
                  <div className="flex items-center justify-between text-xs text-gray-600 border-b border-gray-100 pb-3 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-[#2D4F1E]/10 text-[#2D4F1E] font-black rounded-full flex items-center justify-center text-xs">
                        🌾
                      </span>
                      <div>
                        <span className="block font-bold text-gray-800">{batch.farmer_name}</span>
                        <span className="text-[10px] text-gray-400">{lang === 'BN' ? "প্রত্যয়িত ক্ষুদ্র কৃষক" : "Certified Smallholder"}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">{t('availableQty')}</span>
                      <strong className="text-xs font-black text-[#2D4F1E]">{batch.quantity_kg.toLocaleString()} kg</strong>
                    </div>
                  </div>

                  {/* Pricing Display */}
                  <div className="bg-[#F4F1EA]/50 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block">{lang === 'BN' ? "পাইকারি দর" : "Wholesale Rate"}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#2D4F1E]">৳{batch.base_price_per_kg}</span>
                        <span className="text-xs font-bold text-gray-500">/ kg</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-emerald-700 font-bold">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <Truck className="w-3 h-3" /> {lang === 'BN' ? "রেডি শিপমেন্ট" : "Ready Freight"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddToCart(batch)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t('addToCart')}</span>
                </button>

                <button
                  onClick={() => handleDirectBuy(batch)}
                  className="w-full py-2.5 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{t('buyNow')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <p className="text-base font-bold text-gray-700">{lang === 'BN' ? "কোনো শস্যের ফলাফল পাওয়া যায়নি।" : "No matching crop batches found."}</p>
          <p className="text-xs text-gray-400">{lang === 'BN' ? "দয়া করে অনুসন্ধানের কীওয়ার্ড বা ফিল্টার পরিবর্তন করুন।" : "Try adjusting your search query or grade filter."}</p>
        </div>
      )}

      {/* SHOPPING CART DRAWER / MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slideLeft">
            
            <div className="space-y-6 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-[#1A2A1A] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#2D4F1E]" />
                  <span>{t('cart')}</span>
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.batch.batch_id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-[#1A2A1A]">{item.batch.crop_name}</h4>
                          <p className="text-xs text-gray-500">{item.batch.farmer_name} • {item.batch.upazila_district}</p>
                        </div>
                        <span className="font-black text-sm text-[#2D4F1E]">৳{item.batch.base_price_per_kg}/kg</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                        <span className="text-gray-500 font-semibold">{lang === 'BN' ? "পরিমাণ (কেজি):" : "Quantity (kg):"}</span>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                          <button
                            onClick={() => handleUpdateCartQty(item.batch.batch_id, item.order_quantity_kg - 50)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold px-2 text-gray-800">{item.order_quantity_kg} kg</span>
                          <button
                            onClick={() => handleUpdateCartQty(item.batch.batch_id, item.order_quantity_kg + 50)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right text-xs font-bold text-gray-700">
                        {lang === 'BN' ? "উপমোট:" : "Subtotal:"} <span className="text-[#2D4F1E] font-black">৳{(item.batch.base_price_per_kg * item.order_quantity_kg).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
                  <p className="text-sm font-bold">{lang === 'BN' ? "আপনার কার্ট বর্তমানে খালি।" : "Your cart is currently empty."}</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 pt-4 space-y-4 bg-white">
                <div className="flex items-center justify-between text-base font-black text-[#1A2A1A]">
                  <span>{t('orderTotal')}</span>
                  <span className="text-xl text-[#2D4F1E]">৳{calculateTotal().toLocaleString()}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer text-center"
                >
                  {t('checkout')}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CHECKOUT & ESCROW CONFIRMATION MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1A2A1A] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>{lang === 'BN' ? "স্মার্ট এসক্রো অর্ডার চেকআউট" : "Smart Escrow Order Checkout"}</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {lang === 'BN' ? "পণ্য পৌঁছানো ও মান পরীক্ষার পর পেমেন্ট ছাড় করা হবে।" : "Funds are held securely in escrow until crop delivery and quality inspection."}
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs font-sans">
              
              {/* Buyer Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">{lang === 'BN' ? "ক্রেতার নাম:" : "Buyer Name:"}</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-bold focus:outline-none focus:border-[#2D4F1E]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">{lang === 'BN' ? "মোবাইল নম্বর:" : "Phone Number:"}</label>
                <input
                  type="text"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-bold focus:outline-none focus:border-[#2D4F1E]"
                />
              </div>

              {/* Shipping Address */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">{t('shippingAddress')}</label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-bold focus:outline-none focus:border-[#2D4F1E]"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="font-bold text-gray-700 block">{t('paymentMethod')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Escrow', 'bKash', 'Nagad', 'Cash on Delivery'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === method
                          ? "border-[#2D4F1E] bg-[#2D4F1E]/5 font-black text-[#2D4F1E]"
                          : "border-gray-200 bg-white text-gray-700 font-semibold"
                      }`}
                    >
                      <span>{method}</span>
                      {paymentMethod === method && <Check className="w-4 h-4 text-[#2D4F1E]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#F4F1EA]/80 p-4 rounded-2xl space-y-2 border border-[#1A2A1A]/10">
                <div className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
                  {lang === 'BN' ? "অর্ডার আইটেম সমূহের সারসংক্ষেপ:" : "Order Items Summary:"}
                </div>
                {cart.map(item => (
                  <div key={item.batch.batch_id} className="flex justify-between text-xs font-medium text-gray-800">
                    <span>{item.batch.crop_name} ({item.order_quantity_kg} kg)</span>
                    <strong className="font-bold">৳{(item.batch.base_price_per_kg * item.order_quantity_kg).toLocaleString()}</strong>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-black text-[#2D4F1E] pt-2 border-t border-gray-200">
                  <span>{t('orderTotal')}</span>
                  <span>৳{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer text-center"
              >
                {t('placeOrder')}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* CONFIRMED RECEIPT MODAL */}
      {lastOrderConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1A2A1A]">
                {lang === 'BN' ? "অর্ডার সফলভাবে সম্পন্ন হয়েছে!" : "Order Confirmed!"}
              </h3>
              <p className="text-xs text-gray-500 font-semibold">
                Order ID: #{lastOrderConfirmed.order_id}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl text-left space-y-2 text-xs border border-gray-200 font-medium">
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">{lang === 'BN' ? "ক্রেতা:" : "Buyer:"}</span>
                <strong className="text-gray-800">{lastOrderConfirmed.buyer_name}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">{lang === 'BN' ? "পেমেন্ট মাধ্যম:" : "Payment:"}</span>
                <strong className="text-emerald-700">{lastOrderConfirmed.payment_method}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1">
                <span className="text-gray-500">{lang === 'BN' ? "মোট পরিশোধ:" : "Total Paid:"}</span>
                <strong className="text-sm font-black text-[#2D4F1E]">৳{lastOrderConfirmed.total_amount.toLocaleString()}</strong>
              </div>
            </div>

            <button
              onClick={() => setLastOrderConfirmed(null)}
              className="w-full py-3 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-bold text-xs rounded-2xl cursor-pointer"
            >
              {lang === 'BN' ? "বন্ধ করুন" : "Close Receipt"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
