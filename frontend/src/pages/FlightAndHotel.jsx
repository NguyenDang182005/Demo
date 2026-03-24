import React, { useState, useEffect } from 'react';
import { DatePicker, Select, InputNumber, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

const FlightAndHotel = () => {
  const { t } = useTranslation();
  const disabledDate = (current) => current && current < dayjs().startOf('day');

  const [airports, setAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [departureCode, setDepartureCode] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('/api/flights/airports');
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports", error);
      }
    };
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/hotels/cities');
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching hotel cities", error);
      }
    };
    fetchAirports();
    fetchCities();
  }, []);

  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!departureCode || !destination) {
      alert(t('common.pleaseSelectOriginDest') || "Vui lòng chọn điểm đi và điểm đến");
      return;
    }
    setSearching(true);
    // Logic tìm kiếm thực tế sẽ được thêm sau
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
        
        {/* Banner Đặc trưng cho Packages */}
        <div className="bg-gradient-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('flightAndHotel.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('flightAndHotel.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar kết hợp */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <FlightTakeoffIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('flightAndHotel.origin')}</span>
                  <Select 
                    showSearch 
                    placeholder={t('flightAndHotel.originPlaceholder')} 
                    variant="borderless" 
                    className="w-full"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến (Vừa là sân bay vừa là nơi ở) */}
              <div className="md:col-span-3 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <HotelIcon className="text-blue-500" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('flightAndHotel.destination')}</span>
                  <Select 
                    showSearch 
                    placeholder={t('flightAndHotel.destPlaceholder')} 
                    variant="borderless" 
                    className="w-full"
                    onChange={(val) => setDestination(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={cities.map(city => ({ value: city, label: city }))} />
                </div>
              </div>

              {/* Lịch trình */}
              <div className="md:col-span-4 border rounded-lg p-2 bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase px-3">{t('flightAndHotel.dateRange')}</span>
                <RangePicker disabledDate={disabledDate} variant="borderless" className="w-full" />
              </div>

              {/* Số người */}
              <div className="md:col-span-2 border rounded-lg p-2 flex items-center gap-2 bg-white">
                <GroupIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('flightAndHotel.guests')}</span>
                  <InputNumber min={1} defaultValue={2} variant="borderless" className="w-full" />
                </div>
              </div>
            </div>

            {/* Nút Tìm kiếm to bản */}
            <div className="flex justify-end mt-2">
              <Button 
                variant="contained" 
                size="large"
                onClick={handleSearch}
                sx={{ 
                  backgroundColor: '#006ce4', 
                  px: 6, 
                  py: 1.5, 
                  fontWeight: 'bold', 
                  textTransform: 'none',
                  borderRadius: '4px'
                }}
              >
                {searching ? t('flightAndHotel.searching') : t('flightAndHotel.search')}
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Search Results Mockup */}
        {searching && (
          <div className="section-container mt-8 text-center py-10">
            <h2 className="text-2xl font-bold mb-4">{t('flightAndHotel.searchResults')}</h2>
            <p className="text-gray-500 italic">{t('flightAndHotel.searchDesc')}</p>
          </div>
        )}

        {/* Phần nội dung quảng cáo gói - Ẩn đi khi đang tìm kiếm */}
        {!searching && (
          <div className="section-container mt-12 mb-20">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center justify-between">
                  <div>
                      <h3 className="text-lg font-bold text-blue-900">{t('flightAndHotel.whyBookLabel')}</h3>
                      <ul className="mt-2 text-blue-800 list-disc list-inside space-y-1">
                          <li>{t('flightAndHotel.whyBook1')}</li>
                          <li>{t('flightAndHotel.whyBook2')}</li>
                          <li>{t('flightAndHotel.whyBook3')}</li>
                      </ul>
                  </div>
                  <div className="hidden md:block text-6xl opacity-20 text-blue-900">
                      ✈️+🏨
                  </div>
              </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default FlightAndHotel;