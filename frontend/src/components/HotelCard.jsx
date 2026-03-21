import React from 'react';

const HotelCard = ({ hotel }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow bg-white">
            {/* Ảnh bên trái */}
            <div className="relative w-full md:w-[240px] h-[240px] shrink-0">
                <img src={hotel.image} className="w-full h-full object-cover rounded-md" alt="hotel" />
                <button className="absolute top-2 right-2 text-white text-xl drop-shadow-md hover:text-red-500">
                    <i className="fa-regular fa-heart"></i>
                </button>
            </div>

            {/* Nội dung ở giữa và bên phải */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-[#006ce4] hover:text-[#a36100] cursor-pointer line-clamp-1">
                            {hotel.name}
                        </h3>
                        {/* Ô điểm số xanh đậm */}
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="font-bold text-sm leading-tight">Tuyệt vời</p>
                                <p className="text-[11px] text-gray-500">{hotel.reviews} đánh giá</p>
                            </div>
                            <div className="bg-[#003580] text-white w-8 h-8 flex items-center justify-center rounded-t-md rounded-br-md font-bold">
                                {hotel.rating}
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-[#006ce4] underline mb-2 cursor-pointer">{hotel.location} • Xem trên bản đồ</p>
                    <div className="border-l-2 border-gray-200 pl-2 mt-2">
                        <p className="text-xs font-bold text-gray-700">Căn hộ Studio</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{hotel.desc}</p>
                        <p className="text-xs font-bold text-green-700 mt-1">Miễn phí hủy bỏ • Không cần thanh toán trước</p>
                    </div>
                </div>

                {/* Giá tiền và Nút bấm */}
                <div className="flex flex-col items-end mt-4">
                    <span className="bg-[#febb02] text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1">
                        Ưu đãi giá hời
                    </span>
                    <p className="text-[11px] text-gray-500">1 đêm, 2 người lớn</p>
                    <p className="text-2xl font-bold text-gray-900">VND {hotel.price}</p>
                    <p className="text-[10px] text-gray-500 mb-2">Đã bao gồm thuế và phí</p>
                    <button className="bg-[#006ce4] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#003b95] transition flex items-center gap-2">
                        Xem chỗ trống <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;