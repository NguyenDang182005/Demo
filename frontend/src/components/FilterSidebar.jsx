import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterSidebar = () => {
    const { t } = useTranslation();
    return (
        <aside className="w-[280px] shrink-0 font-sans hidden md:block">
            {/* 1. Phần Bản đồ */}
            <div className="relative h-[140px] mb-4 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                <img 
                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=300" 
                    alt="Map" 
                    className="w-full h-full object-cover opacity-70"
                />
                <button className="absolute inset-0 m-auto w-fit h-fit bg-[#006ce4] text-white px-4 py-2 rounded shadow-lg text-sm font-bold hover:bg-[#003b95] transition">
                    {t('filterSidebar.showOnMap')}
                </button>
            </div>

            {/* 2. Khung các bộ lọc */}
            <div className="border border-gray-200 rounded-md">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-bold text-sm text-gray-900">{t('filterSidebar.filterBy')}</h2>
                </div>

                {/* Nhóm: Điểm đánh giá */}
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-bold mb-3">{t('filterSidebar.guestRating')}</h3>
                    <div className="space-y-2">
                        {[
                            { label: t('filterSidebar.superb'), count: 803 },
                            { label: t('filterSidebar.veryGood'), count: 1882 },
                            { label: t('filterSidebar.good'), count: 2612 }
                        ].map((item, i) => (
                            <label key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 border-gray-300 rounded accent-[#006ce4]" />
                                    <span className="text-sm text-gray-700 group-hover:underline">{item.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Nhóm: Loại chỗ ở */}
                <div className="p-4">
                    <h3 className="text-sm font-bold mb-3">{t('filterSidebar.propertyType')}</h3>
                    <div className="space-y-2">
                        {[t('filterSidebar.apartment'), t('filterSidebar.hotel'), t('filterSidebar.villa'), t('filterSidebar.resort')].map((type, i) => (
                            <label key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 border-gray-300 rounded accent-[#006ce4]" />
                                    <span className="text-sm text-gray-700 group-hover:underline">{type}</span>
                                </div>
                                <span className="text-xs text-gray-500">{150 + i * 45}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;