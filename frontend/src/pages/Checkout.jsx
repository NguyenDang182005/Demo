import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy thông tin từ query params
  const type = searchParams.get('type') || '';
  const name = searchParams.get('name') || '';
  const price = Number(searchParams.get('price')) || 0;
  const details = searchParams.get('details') ? JSON.parse(searchParams.get('details')) : {};

  // States
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [confirmed, setConfirmed] = useState(false);

  const serviceFee = Math.round(price * 0.05);
  const totalPrice = price + serviceFee;

  // Label cho loại dịch vụ
  const typeLabels = {
    hotel: t('checkout.typeHotel'),
    flight: t('checkout.typeFlight'),
    car: t('checkout.typeCar'),
    attraction: t('checkout.typeAttraction'),
    taxi: t('checkout.typeTaxi'),
    package: t('checkout.typePackage'),
  };

  // Icon cho loại dịch vụ
  const typeIcons = {
    hotel: 'fa-solid fa-hotel',
    flight: 'fa-solid fa-plane',
    car: 'fa-solid fa-car',
    attraction: 'fa-solid fa-ticket',
    taxi: 'fa-solid fa-taxi',
    package: 'fa-solid fa-suitcase-rolling',
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      message.warning(t('checkout.fillRequired'));
      return;
    }
    setConfirmed(true);
  };

  // Trang xác nhận thành công
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-green-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{t('checkout.successTitle')}</h1>
          <p className="text-gray-500 mb-6">{t('checkout.successDesc')}</p>
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.orderCode')}</span>
              <span className="font-bold text-gray-900">BK{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.service')}</span>
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('checkout.totalAmount')}</span>
              <span className="font-bold text-green-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#003b95] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#002d73] transition-all w-full"
          >
            {t('checkout.backHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#003b95] text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-lock text-blue-300"></i>
            {t('checkout.title')}
          </h1>
          <p className="text-blue-200 mt-1">{t('checkout.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleConfirm}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CỘT TRÁI - Form thanh toán */}
            <div className="lg:col-span-2 space-y-6">

              {/* Thông tin khách hàng */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-user text-[#003b95]"></i>
                  {t('checkout.customerInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.fullName')} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.fullNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.email')} <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('checkout.phone')} <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={t('checkout.phonePlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-[#003b95]"></i>
                  {t('checkout.paymentMethod')}
                </h2>

                <div className="space-y-3">
                  {/* Thẻ tín dụng */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'card' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{t('checkout.creditCard')}</p>
                      <p className="text-xs text-gray-500">{t('checkout.creditCardDesc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded">VISA</span>
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">MC</span>
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">JCB</span>
                    </div>
                  </label>

                  {/* Form thẻ tín dụng */}
                  {paymentMethod === 'card' && (
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-fade-in-up">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('checkout.cardNumber')}</label>
                        <input
                          type="text" maxLength="19"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('checkout.cardName')}</label>
                        <input
                          type="text"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{t('checkout.expiry')}</label>
                          <input
                            type="text" maxLength="5"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                          <input
                            type="password" maxLength="4"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="•••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chuyển khoản ngân hàng */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'bank' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{t('checkout.bankTransfer')}</p>
                      <p className="text-xs text-gray-500">{t('checkout.bankTransferDesc')}</p>
                    </div>
                    <i className="fa-solid fa-building-columns text-xl text-gray-400"></i>
                  </label>

                  {paymentMethod === 'bank' && (
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up">
                      <p className="text-sm font-semibold text-gray-700 mb-2">{t('checkout.bankInfo')}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">{t('checkout.bankName')}:</span> Vietcombank</p>
                        <p><span className="font-medium">{t('checkout.accountNumber')}:</span> 1234 5678 9012</p>
                        <p><span className="font-medium">{t('checkout.accountHolder')}:</span> CONG TY BOOKING CLONE</p>
                        <p><span className="font-medium">{t('checkout.transferContent')}:</span> BK{Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                  )}

                  {/* Ví điện tử */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'ewallet' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('ewallet')}
                  >
                    <input type="radio" name="payment" value="ewallet" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{t('checkout.eWallet')}</p>
                      <p className="text-xs text-gray-500">{t('checkout.eWalletDesc')}</p>
                    </div>
                    <i className="fa-solid fa-wallet text-xl text-gray-400"></i>
                  </label>

                  {paymentMethod === 'ewallet' && (
                    <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-up">
                      <p className="text-sm font-semibold text-gray-700 mb-3">{t('checkout.selectWallet')}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <button type="button" className="border-2 border-gray-200 hover:border-pink-500 p-3 rounded-xl text-center transition-all focus:border-pink-500 focus:bg-pink-50">
                          <div className="text-2xl mb-1">💳</div>
                          <p className="text-xs font-bold text-gray-700">MoMo</p>
                        </button>
                        <button type="button" className="border-2 border-gray-200 hover:border-blue-500 p-3 rounded-xl text-center transition-all focus:border-blue-500 focus:bg-blue-50">
                          <div className="text-2xl mb-1">💙</div>
                          <p className="text-xs font-bold text-gray-700">ZaloPay</p>
                        </button>
                        <button type="button" className="border-2 border-gray-200 hover:border-red-500 p-3 rounded-xl text-center transition-all focus:border-red-500 focus:bg-red-50">
                          <div className="text-2xl mb-1">🔴</div>
                          <p className="text-xs font-bold text-gray-700">VNPay</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Thanh toán khi nhận */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'cod' ? 'border-[#003b95] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#003b95] w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{t('checkout.cod')}</p>
                      <p className="text-xs text-gray-500">{t('checkout.codDesc')}</p>
                    </div>
                    <i className="fa-solid fa-money-bill-wave text-xl text-gray-400"></i>
                  </label>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI - Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-[#003b95]"></i>
                  {t('checkout.orderSummary')}
                </h2>

                {/* Loại dịch vụ */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#003b95] rounded-lg flex items-center justify-center">
                    <i className={`${typeIcons[type] || 'fa-solid fa-tag'} text-white`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">{typeLabels[type] || type}</p>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{name}</p>
                  </div>
                </div>

                {/* Chi tiết */}
                {Object.keys(details).length > 0 && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Giá */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('checkout.subtotal')}</span>
                    <span className="font-medium">{price.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('checkout.serviceFee')}</span>
                    <span className="font-medium">{serviceFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">{t('checkout.totalAmount')}</span>
                    <span className="font-extrabold text-xl text-[#003b95]">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Nút xác nhận */}
                <button
                  type="submit"
                  className="w-full bg-[#006ce4] hover:bg-[#003b95] text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg active:scale-[0.98] shadow-lg shadow-blue-500/20"
                >
                  <i className="fa-solid fa-lock mr-2"></i>
                  {t('checkout.confirmPayment')}
                </button>

                {/* Badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-shield-halved text-green-600"></i>
                    {t('checkout.securePayment')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-rotate-left text-blue-600"></i>
                    {t('checkout.refundPolicy')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="fa-solid fa-headset text-purple-600"></i>
                    {t('checkout.support247')}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
