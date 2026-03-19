import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    const jobCategories = [
        { title: "Công nghệ & Kỹ thuật", open: 45, icon: "fa-code" },
        { title: "Dịch vụ khách hàng", open: 12, icon: "fa-headset" },
        { title: "Marketing & Truyền thông", open: 8, icon: "fa-bullhorn" },
        { title: "Quản lý khách sạn", open: 15, icon: "fa-hotel" },
        { title: "Tài chính & Nhân sự", open: 5, icon: "fa-users-gear" },
        { title: "Dữ liệu & AI", open: 22, icon: "fa-brain" },
    ];

    const hotJobs = [
        { id: 1, title: "Senior React Developer", location: "TP. Hồ Chí Minh", type: "Toàn thời gian" },
        { id: 2, title: "Chuyên viên Tư vấn Khách hàng", location: "Hà Nội", type: "Toàn thời gian" },
        { id: 3, title: "Product Manager (Phòng Vé máy bay)", location: "Từ xa / Remote", type: "Toàn thời gian" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center text-white">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Careers at Booking" 
                />
                <div className="absolute inset-0 bg-booking-blue/60"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Xây dựng tương lai ngành du lịch</h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Gia nhập đội ngũ hơn 17,000 nhân viên trên toàn thế giới để giúp mọi người trải nghiệm thế giới dễ dàng hơn.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button className="bg-white text-booking-blue px-6 py-3 rounded font-bold hover:bg-gray-100 transition shadow-lg">
                            Xem tất cả vị trí
                        </button>
                    </div>
                </div>
            </div>

            {/* Mục tiêu & Giá trị */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Tại sao nên làm việc tại Booking.com?</h2>
                        <p className="text-gray-600 mb-4 text-lg">
                            Chúng tôi tin rằng sự đa dạng thúc đẩy sự đổi mới. Tại đây, bạn sẽ được làm việc trong môi trường quốc tế, sáng tạo và luôn đặt khách hàng làm trọng tâm.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-700">
                                <i className="fa-solid fa-check text-green-500"></i> Lương thưởng cạnh tranh & bảo hiểm cao cấp.
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <i className="fa-solid fa-check text-green-500"></i> Cơ hội làm việc tại các văn phòng toàn cầu (Amsterdam, Singapore, London...).
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <i className="fa-solid fa-check text-green-500"></i> Chế độ làm việc linh hoạt (Hybrid working).
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400" className="rounded-lg shadow-md" alt="Team 1" />
                        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" className="rounded-lg shadow-md mt-8" alt="Team 2" />
                    </div>
                </div>
            </div>

            {/* Tìm kiếm theo bộ phận */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Tìm kiếm theo bộ phận</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {jobCategories.map((cat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                                <div className="text-booking-blue text-3xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className={`fa-solid ${cat.icon}`}></i>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                                <p className="text-gray-500 text-sm">{cat.open} vị trí đang tuyển</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Các vị trí nổi bật */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-8">Vị trí nổi bật tại Việt Nam</h2>
                <div className="space-y-4">
                    {hotJobs.map(job => (
                        <div key={job.id} className="border border-gray-200 p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:border-booking-blue transition group">
                            <div>
                                <h3 className="font-bold text-xl text-booking-blue group-hover:underline">{job.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                    <span><i className="fa-solid fa-location-dot mr-1"></i> {job.location}</span>
                                    <span><i className="fa-solid fa-briefcase mr-1"></i> {job.type}</span>
                                </div>
                            </div>
                            <button className="mt-4 md:mt-0 border border-booking-blue text-booking-blue px-6 py-2 rounded font-bold hover:bg-booking-blue hover:text-white transition">
                                Ứng tuyển ngay
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link to="#" className="text-booking-blue font-bold hover:underline">Xem tất cả các công việc đang tuyển dụng <i className="fa-solid fa-arrow-right ml-2"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default Careers;