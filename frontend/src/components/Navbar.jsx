import { Link, useLocation, useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('booking_token');
    const userName = localStorage.getItem('booking_name');

    const handleLogout = () => {
        localStorage.removeItem('booking_token');
        localStorage.removeItem('booking_user');
        localStorage.removeItem('booking_name');
        localStorage.removeItem('booking_role');
        navigate('/login');
    };

    // Hàm helper để định dạng class cho các mục Menu
    const navLinkClass = (isActive) => 
        `flex items-center space-x-2 rounded-full px-4 py-2 font-semibold transition-colors text-white no-underline whitespace-nowrap ${
            isActive 
            ? 'border border-white bg-booking-dark' // Class khi đang ở trang này
            : 'hover:bg-white/10' // Class khi ở trang khác
        }`;

    const languageItems = [
        {
            key: 'vi',
            label: (
                <div className="flex items-center space-x-3 px-1 py-0.5">
                    <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-4 rounded-sm shadow-sm" />
                    <span className="font-medium text-gray-700">Tiếng Việt</span>
                </div>
            ),
            onClick: () => i18n.changeLanguage('vi'),
        },
        {
            key: 'en',
            label: (
                <div className="flex items-center space-x-3 px-1 py-0.5">
                    <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-5 h-4 rounded-sm shadow-sm" />
                    <span className="font-medium text-gray-700">English (US)</span>
                </div>
            ),
            onClick: () => i18n.changeLanguage('en'),
        },
    ];

    const navItems = [
        { path: '/', icon: 'fa-bed', label: t('navbar.stays') },
        { path: '/flights', icon: 'fa-plane', label: t('navbar.flights') },
        { path: '/flight-hotel', icon: 'fa-suitcase', label: t('navbar.flightAndHotel') },
        { path: '/car-rentals', icon: 'fa-car', label: t('navbar.carRentals') },
        { path: '/attractions', icon: 'fa-fort-awesome', label: t('navbar.attractions') },
        { path: '/airport-taxis', icon: 'fa-taxi', label: t('navbar.airportTaxis') },
    ];

    return (
        <header className="bg-booking-blue text-white">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tight">Booking.com</Link>

                {/* Menu bên phải */}
                <div className="hidden md:flex items-center space-x-2 text-sm font-semibold flex-shrink-0">
                    <button className="hover:bg-booking-dark p-2 rounded min-w-[45px] transition-all">{t('navbar.currency')}</button>
                    <Dropdown menu={{ items: languageItems }} trigger={['click']} placement="bottomRight">
                        <button className="hover:bg-booking-dark p-2 rounded flex items-center justify-center cursor-pointer transition-colors" title="Select Language">
                            {i18n.language && i18n.language.startsWith('en') ? (
                                <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-5 h-4 rounded-sm shadow-sm" />
                            ) : (
                                <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-4 rounded-sm shadow-sm" />
                            )}
                        </button>
                    </Dropdown>
                    <button className="hover:bg-booking-dark p-2 rounded mr-1" title={t('navbar.help')}>
                        <i className="fa-regular fa-circle-question text-xl"></i>
                    </button>
                    
                    <div className="flex items-center space-x-4">
                        <Link to="/list-your-property">
                            <button className=" text-white hover:bg-booking-dark p-2 rounded whitespace-nowrap">
                                {t('navbar.listProperty')}
                            </button>
                        </Link>

                        <div className="flex space-x-2 items-center">
                            {token ? (
                                <>
                                    <Link to="/account" className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors no-underline">
                                        <PersonIcon className="text-white" />
                                        <span className="text-white font-bold whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">{userName}</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
                                    >
                                        {t('navbar.logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                                        {t('navbar.register')}
                                    </Link>
                                    <Link to="/login" className="bg-white text-booking-blue px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                                        {t('navbar.login')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-2xl">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Sub Navbar (Menu điều hướng chính) */}
            <div className="max-w-6xl mx-auto px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex space-x-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={navLinkClass(isActive)}
                            >
                                <i className={`fa-solid ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default Navbar;