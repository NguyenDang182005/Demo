import React from 'react';
import { Button } from '@mui/material';
import { 
    UsergroupAddOutlined, // Thay thế cho HandshakeOutlined
    LineChartOutlined, 
    GlobalOutlined, 
    WalletOutlined 
} from '@ant-design/icons';

const BecomePartner = () => {
    const benefits = [
        {
            icon: <LineChartOutlined className="text-5xl text-blue-600" />,
            title: "Hoa hồng hấp dẫn",
            desc: "Nhận mức hoa hồng cao cho mỗi đơn đặt phòng thành công qua link của bạn."
        },
        {
            icon: <GlobalOutlined className="text-5xl text-green-600" />,
            title: "Mạng lưới toàn cầu",
            desc: "Tiếp cận hơn 2,5 triệu chỗ nghỉ trên toàn thế giới để quảng bá tới khách hàng."
        },
        {
            icon: <UsergroupAddOutlined className="text-5xl text-orange-600" />,
            title: "Hỗ trợ chuyên nghiệp",
            desc: "Công cụ theo dõi hiện đại và đội ngũ hỗ trợ đối tác luôn sẵn sàng 24/7."
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-20 text-black overflow-x-hidden">
            {/* Hero Section */}
            <div className="bg-[#003b95] text-white py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Trở thành đối tác liên kết của chúng tôi
                    </h1>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Kiếm tiền từ lưu lượng truy cập của bạn bằng cách quảng bá các lựa chọn lưu trú hàng đầu thế giới.
                    </p>
                    <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                            backgroundColor: '#ffb700', 
                            color: '#003b95', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            px: 8,
                            py: 2,
                            borderRadius: '4px',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#feba02', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }
                        }}
                    >
                        Đăng ký ngay
                    </Button>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-6xl mx-auto px-4 py-24">
                <h2 className="text-3xl font-bold text-center mb-20 text-blue-900">Tại sao nên đồng hành cùng chúng tôi?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    {benefits.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed px-4">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-20 border-t border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 flex flex-wrap justify-around text-center gap-10">
                        <div className="min-w-[200px]">
                            <div className="text-4xl font-extrabold text-blue-600 mb-2">2.5M+</div>
                            <div className="text-gray-500 font-medium">Chỗ nghỉ toàn cầu</div>
                        </div>
                        <div className="min-w-[200px]">
                            <div className="text-4xl font-extrabold text-blue-600 mb-2">15.5%</div>
                            <div className="text-gray-500 font-medium">Tỷ lệ chuyển đổi</div>
                        </div>
                        <div className="min-w-[200px]">
                            <div className="text-4xl font-extrabold text-blue-600 mb-2">12,500+</div>
                            <div className="text-gray-500 font-medium">Đối tác tin dùng</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 text-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Sẵn sàng gia nhập mạng lưới?</h3>
                <p className="text-gray-600 mb-8">Quy trình đăng ký chỉ mất chưa đầy 5 phút.</p>
                <div className="flex justify-center gap-4">
                     <WalletOutlined className="text-2xl text-blue-600" />
                     <span className="font-semibold">Thanh toán hoa hồng đúng hạn mỗi tháng</span>
                </div>
            </div>
        </div>
    );
};

export default BecomePartner;