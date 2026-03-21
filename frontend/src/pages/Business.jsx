import React from 'react';
import { Button } from '@mui/material';
import { 
    BankOutlined, 
    BarChartOutlined, 
    GlobalOutlined, 
    SafetyCertificateOutlined,
    ThunderboltOutlined 
} from '@ant-design/icons';

const Business = () => {
    const features = [
        {
            icon: <BankOutlined className="text-4xl text-blue-600" />,
            title: "Tiết kiệm chi phí",
            desc: "Nhận mức giá dành riêng cho doanh nghiệp và quản lý ngân sách du lịch dễ dàng."
        },
        {
            icon: <BarChartOutlined className="text-4xl text-blue-600" />,
            title: "Quản lý tập trung",
            desc: "Mọi đặt chỗ và hóa đơn được lưu trữ tại một nơi duy nhất, giúp báo cáo nhanh chóng."
        },
        {
            icon: <ThunderboltOutlined className="text-4xl text-blue-600" />,
            title: "Đặt chỗ nhanh chóng",
            desc: "Công cụ tự động hóa giúp nhân viên của bạn đặt phòng chỉ trong vài giây."
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-20 text-black">
            {/* Hero Section */}
            <div className="relative bg-gray-900 h-[500px] flex items-center">
                <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
                    alt="Business Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative max-w-6xl mx-auto px-4 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl">
                        Quản lý du lịch doanh nghiệp dễ dàng hơn
                    </h1>
                    <p className="text-xl mb-8 max-w-xl opacity-90">
                        Tiết kiệm thời gian và chi phí cho mọi chuyến công tác với nền tảng quản lý thông minh của chúng tôi.
                    </p>
                    <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                            backgroundColor: '#006ce4', 
                            color: 'white', 
                            fontWeight: 'bold',
                            px: 5,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            '&:hover': { backgroundColor: '#0053b3' }
                        }}
                    >
                        Đăng ký miễn phí
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dashboard Preview Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center">
                    <div className="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
                        <h2 className="text-3xl font-bold mb-6 text-blue-900">Kiểm soát hoàn toàn trong tầm tay</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-lg">
                                <SafetyCertificateOutlined className="text-green-500 mt-1" />
                                <span>Thiết lập chính sách du lịch cho từng phòng ban</span>
                            </li>
                            <li className="flex items-start gap-3 text-lg">
                                <SafetyCertificateOutlined className="text-green-500 mt-1" />
                                <span>Tích hợp thẻ tín dụng doanh nghiệp tiện lợi</span>
                            </li>
                            <li className="flex items-start gap-3 text-lg">
                                <SafetyCertificateOutlined className="text-green-500 mt-1" />
                                <span>Báo cáo chi phí chi tiết theo thời gian thực</span>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2">
                        <img 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                            alt="Dashboard" 
                            className="rounded-xl shadow-2xl border border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Gia nhập cùng hàng ngàn doanh nghiệp khác</h2>
                <p className="text-gray-600 mb-10">Không mất phí đăng ký, không phí duy trì. Chỉ thanh toán cho những gì bạn đặt.</p>
                <div className="flex justify-center gap-4">
                    <Button variant="outlined" size="large" sx={{ textTransform: 'none' }}>Tìm hiểu thêm</Button>
                    <Button variant="contained" size="large" sx={{ backgroundColor: '#006ce4', textTransform: 'none' }}>Bắt đầu ngay</Button>
                </div>
            </div>
        </div>
    );
};

export default Business;