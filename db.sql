CREATE DATABASE IF NOT EXISTS booking_db;
USE booking_db;

-- =========================================================
-- 1. BẢNG NGƯỜI DÙNG
-- =========================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'OWNER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. DỮ LIỆU CƠ SỞ ĐỊA LÝ / VỊ TRÍ
-- =========================================================
-- Bảng Sân bay
CREATE TABLE airports (
    code VARCHAR(10) PRIMARY KEY, -- Ví dụ: HAN, SGN, DAD
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Vietnam'
);

-- Bảng Địa điểm/Trạm thuê xe
CREATE TABLE car_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL
);

-- =========================================================
-- 3. CÁC THỰC THỂ DỊCH VỤ CỐT LÕI
-- =========================================================
-- 3.1 Khách sạn
CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0
);

-- Các loại phòng trong khách sạn
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT,
    room_type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_adults INT DEFAULT 2,
    max_children INT DEFAULT 0,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- 3.2 Chuyến bay
CREATE TABLE flights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(50) NOT NULL,
    departure_airport_code VARCHAR(10),
    arrival_airport_code VARCHAR(10),
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (departure_airport_code) REFERENCES airports(code),
    FOREIGN KEY (arrival_airport_code) REFERENCES airports(code)
);

-- 3.3 Xe cho thuê
CREATE TABLE cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    seats INT DEFAULT 4,
    price_per_day DECIMAL(10, 2) NOT NULL,
    location_id BIGINT,
    FOREIGN KEY (location_id) REFERENCES car_locations(id)
);

-- 3.4 Điểm tham quan / Hoạt động
CREATE TABLE attractions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL
);

-- 3.5 Xe đưa đón sân bay
CREATE TABLE airport_taxis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10),
    car_type VARCHAR(50) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (airport_code) REFERENCES airports(code)
);

-- =========================================================
-- 4. BẢNG QUẢN LÝ GIAO DỊCH & BOOKINGS
-- =========================================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    booking_type ENUM('FLIGHT', 'HOTEL', 'CAR_RENTAL', 'ATTRACTION', 'TAXI', 'COMBO') NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================================================
-- 5. CHI TIẾT CÁC LOẠI ĐẶT CHỖ
-- =========================================================
-- 5.1 Chi tiết đặt phòng Khách sạn
CREATE TABLE hotel_bookings (
    booking_id BIGINT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    rooms_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- 5.2 Chi tiết vé Máy bay
CREATE TABLE flight_bookings (
    booking_id BIGINT PRIMARY KEY,
    flight_id BIGINT NOT NULL,
    seat_class ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') DEFAULT 'ECONOMY',
    is_roundtrip BOOLEAN DEFAULT FALSE,
    return_flight_id BIGINT NULL,
    passengers_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (return_flight_id) REFERENCES flights(id)
);

-- 5.3 Chi tiết đặt Thuê xe tự lái
CREATE TABLE car_rental_bookings (
    booking_id BIGINT PRIMARY KEY,
    car_id BIGINT NOT NULL,
    pickup_location_id BIGINT NOT NULL,
    dropoff_location_id BIGINT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    dropoff_datetime DATETIME NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (pickup_location_id) REFERENCES car_locations(id),
    FOREIGN KEY (dropoff_location_id) REFERENCES car_locations(id)
);

-- 5.4 Chi tiết đặt vé Điểm tham quan
CREATE TABLE attraction_bookings (
    booking_id BIGINT PRIMARY KEY,
    attraction_id BIGINT NOT NULL,
    visit_date DATE NOT NULL,
    tickets_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (attraction_id) REFERENCES attractions(id)
);

-- 5.5 Chi tiết đặt Xe Taxi đưa đón sân bay
CREATE TABLE taxi_bookings (
    booking_id BIGINT PRIMARY KEY,
    taxi_id BIGINT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    dropoff_address VARCHAR(500) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (taxi_id) REFERENCES airport_taxis(id)
);

-- =========================================================
-- 6. BẢNG ĐÁNH GIÁ (REVIEWS)
-- =========================================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);