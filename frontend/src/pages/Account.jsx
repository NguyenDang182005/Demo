import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const userName = localStorage.getItem('booking_name') || 'Guest User';
  const userRole = localStorage.getItem('booking_role') || 'Sáng lập viên';
  const email = 'user@example.com'; // Placeholder

  useEffect(() => {
    if (!localStorage.getItem('booking_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: <PersonIcon /> },
    { id: 'bookings', label: t('account.bookings'), icon: <HistoryIcon /> },
    { id: 'security', label: t('account.security'), icon: <LockIcon /> },
    { id: 'settings', label: t('account.settings'), icon: <SettingsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="relative group cursor-pointer mb-4">
                <div className="w-24 h-24 rounded-full bg-booking-blue text-white flex justify-center items-center text-3xl font-bold shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon className="text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
              <p className="text-sm text-gray-500">{userRole}</p>
            </div>

            <nav className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === tab.id
                    ? 'bg-blue-50 text-booking-blue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100'
                    }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-booking-blue' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full transition-all duration-300">
            {activeTab === 'profile' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.personalInfo')}</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.fullName')}</label>
                      <input type="text" defaultValue={userName} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" defaultValue={email} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.phoneNumber')}</label>
                      <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.nationality')}</label>
                      <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                        <option>{t('account.vietnam')}</option>
                        <option>{t('account.usa')}</option>
                        <option>{t('account.japan')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                    <button className="bg-booking-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm focus:ring-4 focus:ring-blue-100">
                      {t('account.saveChanges')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.bookings')}</h3>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <HistoryIcon className="text-booking-blue" style={{ fontSize: 40 }} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{t('account.noTripsYet')}</h4>
                  <p className="text-gray-500 max-w-md mb-8 leading-relaxed">{t('account.noTripsDesc')}</p>
                  <button onClick={() => navigate('/')} className="px-6 py-3 bg-booking-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100">
                    {t('account.startSearching')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.accountSecurity')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{t('account.password')}</h4>
                      <p className="text-sm text-gray-500">{t('account.passwordDesc')}</p>
                    </div>
                    <button className="text-booking-blue font-bold px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors whitespace-nowrap ml-4">{t('account.changePassword')}</button>
                  </div>
                  <div className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{t('account.twoFactor')}</h4>
                      <p className="text-sm text-gray-500">{t('account.twoFactorDesc')}</p>
                    </div>
                    <button className="text-booking-blue font-bold px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors whitespace-nowrap ml-4">{t('account.setupTwoFactor')}</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="transition-opacity duration-500 opacity-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('account.appSettings')}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.language')}</label>
                    <select className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                      <option>Tiếng Việt</option>
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{t('account.currency')}</label>
                    <select className="w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-booking-blue outline-none transition-all">
                      <option>VND - Đồng Việt Nam</option>
                      <option>USD - US Dollar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;
