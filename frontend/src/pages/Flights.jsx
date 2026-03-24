import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Radio, ConfigProvider } from 'antd';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DetailOverlay from '../components/DetailOverlay';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

// Hàm chặn chọn ngày trong quá khứ (Dùng logic bạn vừa gửi)
const disabledDate = (current) => {
  // Không cho phép chọn những ngày trước ngày hôm nay
  return current && current < dayjs().startOf('day');
};

const Flights = () => {
  const { t } = useTranslation();
  const [departureCode, setDepartureCode] = useState(null);
  const [arrivalCode, setArrivalCode] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('/api/flights/airports');
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports", error);
      }
    };
    fetchAirports();
  }, []);

  const handleSearch = async () => {
    if (!departureCode || !arrivalCode || !departureDate) {
      alert("Vui lòng chọn đầy đủ thông tin: Điểm đi, Điểm đến và Ngày đi");
      return;
    }
    setLoading(true);
    try {
      // Format required by Spring @DateTimeFormat(iso)
      const startDate = departureDate[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const endDate = departureDate[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const response = await axios.get(`/api/flights/search`, {
        params: {
          departureCode: departureCode,
          arrivalCode: arrivalCode,
          startDate: startDate,
          endDate: endDate
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching flights", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">

        {/* Banner */}
        <div className="bg-gradient-to-br from-booking-blue via-blue-800 to-indigo-900 text-white relative w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">{t('flights.heroTitle')}</h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-sm">{t('flights.heroSubtitle')}</p>
            </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-12">
          <div className="bg-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden p-4 shadow-inner">

            <Radio.Group defaultValue="roundtrip" buttonStyle="solid">
              <Radio.Button value="roundtrip">{t('flights.roundtrip')}</Radio.Button>
              <Radio.Button value="oneway">{t('flights.oneway')}</Radio.Button>
            </Radio.Group>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Điểm đi */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightTakeoffIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase font-sans">{t('flights.from')}</span>
                  <Select
                    showSearch
                    placeholder={t('flights.originPlaceholder')}
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setDepartureCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* Điểm đến */}
              <div className="md:col-span-3 border rounded-lg p-2 hover:border-booking-blue bg-white flex items-center gap-2">
                <FlightLandIcon className="text-gray-400" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-gray-500 uppercase font-sans">{t('flights.to')}</span>
                  <Select
                    showSearch
                    placeholder={t('flights.destPlaceholder')}
                    variant="borderless"
                    className="w-full"
                    onChange={(val) => setArrivalCode(val)}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
                </div>
              </div>

              {/* DATE SELECTION */}
              <div className="md:col-span-4 border rounded-lg p-2 hover:border-booking-blue bg-white">
                <span className="text-[10px] font-bold text-gray-500 uppercase px-3 font-sans">{t('flights.dateRange')}</span>
                <RangePicker
                  disabledDate={disabledDate} // Áp dụng logic chặn ngày quá khứ
                  variant="borderless"
                  className="w-full"
                  format="DD/MM/YYYY"
                  placeholder={[t('flights.dateStart'), t('flights.dateEnd')]}
                  onChange={(dates) => setDepartureDate(dates)}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  variant="contained"
                  fullWidth
                  className="h-full bg-booking-blue hover:bg-booking-dark"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', height: '100%', textTransform: 'none' }}>
                  {loading ? t('flights.searching') : t('flights.search')}
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Hướng dẫn/Phổ biến - Ẩn đi khi có kết quả tìm kiếm */}
        {results.length === 0 && (
          <div className="section-container mt-12 mb-20">
            <h2 className="text-2xl font-bold mb-6">{t('flights.popularFlights')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1555505012-1c4b6992d9ec?w=500" alt="HN-HCM" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">Hà Nội - TP. Hồ Chí Minh</h4>
                  <p className="text-sm text-gray-500">{t('flights.fromPrice')} 1.200.000 VND</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1559592413-7ece70199464?w=500" alt="HCM-DN" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">TP. Hồ Chí Minh - Đà Nẵng</h4>
                  <p className="text-sm text-gray-500">{t('flights.fromPrice')} 850.000 VND</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1506634064465-7dab4de896ed?w=500" alt="HN-PQ" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">Hà Nội - Phú Quốc</h4>
                  <p className="text-sm text-gray-500">{t('flights.fromPrice')} 1.800.000 VND</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List vé mẫu... */}
        {results.length > 0 && (
          <div className="section-container mt-6 pb-12">
            <h2 className="text-2xl font-bold mb-4">{t('flights.searchResults')}</h2>
            <div className="flex flex-col gap-4">
              {results.map((flight) => (
                <div key={flight.id} className="result-card flex flex-col md:flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-booking-blue">{flight.airline}</span>
                    <span className="text-sm text-gray-500">{t('flights.flightNumber')}: {flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0 text-center">
                    <div>
                      <div className="text-xl font-bold">{dayjs(flight.departureTime).format('HH:mm')}</div>
                      <div className="text-gray-500">{flight.departureAirport?.code}</div>
                    </div>
                    <div className="text-gray-400 border-b border-gray-300 w-16 mb-6"></div>
                    <div>
                      <div className="text-xl font-bold">{dayjs(flight.arrivalTime).format('HH:mm')}</div>
                      <div className="text-gray-500">{flight.arrivalAirport?.code}</div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <span className="text-2xl font-bold text-red-600 mb-2">{flight.price.toLocaleString('vi-VN')} VND</span>
                    <DetailOverlay 
                      trigger={<Button variant="contained" sx={{ backgroundColor: '#006ce4', fontWeight: 'bold' }}>{t('flights.selectFlight')}</Button>}
                      title={`${t('flights.flightDetails')} ${flight.flightNumber}`}
                      description={`${t('flights.journeyFrom')} ${flight.departureAirport?.city} ${t('flights.journeyTo')} ${flight.arrivalAirport?.city}`}
                      content={
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                            <span className="font-bold text-booking-blue">{flight.airline}</span>
                            <span className="text-sm font-medium">#{flight.flightNumber}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border-l-2 border-blue-200 pl-3">
                              <p className="text-xs text-gray-400">{t('flights.departure')}</p>
                              <p className="font-bold text-lg">{dayjs(flight.departureTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.departureAirport?.name} ({flight.departureAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.departureTime).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className="border-l-2 border-green-200 pl-3">
                              <p className="text-xs text-gray-400">{t('flights.arrival')}</p>
                              <p className="font-bold text-lg">{dayjs(flight.arrivalTime).format('HH:mm')}</p>
                              <p className="text-sm">{flight.arrivalAirport?.name} ({flight.arrivalAirport?.code})</p>
                              <p className="text-xs text-gray-500">{dayjs(flight.arrivalTime).format('DD/MM/YYYY')}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-semibold mb-1">{t('flights.baggagePolicy')}</p>
                            <ul className="list-disc list-inside text-gray-600">
                              <li>{t('flights.carryOn')}</li>
                              <li>{t('flights.checkedBag')}</li>
                              <li>{t('flights.meal')}</li>
                              <li>{t('flights.wifi')}</li>
                            </ul>
                          </div>
                        </div>
                      }
                      footer={
                        <Button variant="contained" sx={{ backgroundColor: '#006ce4' }}>{t('flights.confirmSelection')}</Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Flights;