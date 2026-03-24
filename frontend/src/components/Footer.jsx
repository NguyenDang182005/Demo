import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-booking-blue text-white mt-10">
            <div className="section-container py-6 text-center">
                
                <div className="h-px bg-white bg-opacity-20 mb-6"></div>
                
                <ul className="flex flex-wrap justify-center space-x-4 space-y-2 md:space-y-0 text-sm font-semibold underline mb-4">
                    <li><Link to="/account" className="hover:text-blue-400">{t('footer.yourAccount')}</Link></li>
                    <Link to="/customer-service" className="hover:text-blue-400">
                        {t('footer.customerService')}
                    </Link>
                    <li>
                        <Link to="/become-partner" className="hover:text-blue-400">
                            {t('footer.becomePartner')}
                        </Link>
                    </li>
                    <li>
                        <Link to="/business" className="hover:text-blue-400">
                            {t('footer.bookingForBusiness')}
                        </Link>
                    </li>
                </ul>
            </div>
            
            <div className="bg-booking-dark text-white text-xs py-4 text-center">
                {t('footer.copyright')}
            </div>
        </footer>
    );
};

export default Footer;