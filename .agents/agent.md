# Booking.com Clone – Repository Documentation

> Cập nhật lần cuối: 2026-03-27

## Tổng quan

Clone website Booking.com dạng fullstack: **Spring Boot** (backend Java) + **React Vite** (frontend). Hỗ trợ đa ngôn ngữ (Vietnamese/English). Database: MySQL.

---

## Cấu trúc thư mục gốc

```
demo/
├── frontend/          # React Vite SPA
├── src/               # Spring Boot Java backend
├── db.sql             # Schema tạo database
├── seed.sql           # Seed data mẫu
├── gen_entities.py    # Script Python gen entity từ SQL
├── gen_services.py    # Script Python gen service/controller
├── pom.xml            # Maven config (Spring Boot 3.4.0, Java 17)
├── git_workflow.md    # Hướng dẫn Git workflow
└── .agents/           # Agent workflows
```

---

## Backend (Spring Boot)

### Config
- **Port**: `8081` (application.properties)
- **Database**: MySQL, `booking_db`, port `6666`, user `root`, no password
- **JPA**: Hibernate ddl-auto = `update`, show SQL = true
- **Security**: Spring Security + JWT (jjwt 0.11.5)
- **Lombok**: Enabled

### Package structure: `com.example.demo`

```
com.example.demo/
├── DemoApplication.java       # Main entry
├── controller/
│   ├── AuthController.java    # POST /api/auth/login, /api/auth/register
│   ├── HotelController.java   # /api/hotels/**
│   ├── FlightController.java  # /api/flights/**
│   ├── CarController.java     # /api/cars/**
│   ├── AttractionController.java # /api/attractions/**
│   ├── AirportTaxiController.java # /api/airport-taxis/**
│   └── BookingController.java # /api/bookings/**
├── entity/   (19 files)
│   ├── User.java, UserRole.java
│   ├── Airport.java
│   ├── Hotel.java, Room.java
│   ├── Flight.java
│   ├── Car.java, CarLocation.java
│   ├── Attraction.java
│   ├── AirportTaxi.java
│   ├── Booking.java, BookingStatus.java, BookingType.java
│   ├── HotelBooking.java, FlightBooking.java
│   ├── CarRentalBooking.java, AttractionBooking.java
│   ├── TaxiBooking.java
│   └── Review.java
├── repository/ (16 files) – JpaRepository cho mỗi entity
├── service/
│   ├── HotelService.java
│   ├── FlightService.java
│   ├── CarService.java
│   ├── AttractionService.java
│   ├── AirportTaxiService.java
│   └── BookingService.java
├── security/
│   ├── SecurityConfig.java     # CORS, JWT filter, public endpoints
│   ├── JwtUtil.java            # Generate/validate JWT
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetails.java
│   └── CustomUserDetailsService.java
└── dto/
    ├── LoginRequest.java
    ├── RegisterRequest.java
    └── AuthResponse.java
```

### API Endpoints (cốt lõi)

| Prefix | Controller | Chức năng |
|---|---|---|
| `/api/auth` | AuthController | Login, Register (JWT) |
| `/api/hotels` | HotelController | Search hotels by city, get cities |
| `/api/flights` | FlightController | Search flights, get airports |
| `/api/cars` | CarController | Search cars, get locations |
| `/api/attractions` | AttractionController | Search attractions, get cities |
| `/api/airport-taxis` | AirportTaxiController | Search taxis by airport code |
| `/api/bookings` | BookingController | CRUD bookings |

---

## Database Schema (`booking_db`)

### Tables chính
| Table | Mô tả |
|---|---|
| `users` | Người dùng (CUSTOMER/OWNER/ADMIN) |
| `airports` | Sân bay (PK: code VD: HAN, SGN) |
| `car_locations` | Trạm thuê xe |
| `hotels` | Khách sạn |
| `rooms` | Phòng (FK → hotels) |
| `flights` | Chuyến bay (FK → airports) |
| `cars` | Xe cho thuê (FK → car_locations) |
| `attractions` | Điểm tham quan |
| `airport_taxis` | Xe đưa đón sân bay (FK → airports) |
| `bookings` | Đơn đặt chỗ tổng (FK → users) |
| `hotel_bookings` | Chi tiết đặt phòng |
| `flight_bookings` | Chi tiết đặt vé bay |
| `car_rental_bookings` | Chi tiết thuê xe |
| `attraction_bookings` | Chi tiết đặt vé tham quan |
| `taxi_bookings` | Chi tiết đặt taxi |
| `reviews` | Đánh giá khách sạn |

---

## Frontend (React Vite)

### Config
- **Framework**: React 19 + Vite 7
- **Styling**: TailwindCSS v4 (via `@tailwindcss/vite` plugin)
- **UI Libraries**: Ant Design (antd v6), MUI v7, Radix UI Themes
- **Routing**: react-router-dom v7
- **HTTP**: Axios (proxy `/api` → `http://localhost:8081`)
- **i18n**: react-i18next (VI mặc định, EN phụ)
- **Dev server port**: Vite default (5173)

### Custom Tailwind Colors
```js
booking: {
  blue: '#003b95',
  dark: '#00224f',
  yellow: '#ffb700',
  gray: '#f5f5f5'
}
```

### Cấu trúc frontend/src/

```
src/
├── App.jsx            # Router chính, auto scroll-to-top
├── App.css
├── main.jsx           # Entry (React.StrictMode)
├── index.css
├── i18n.js            # i18next config (vi/en)
├── services/
│   └── api.js         # Axios instance + JWT interceptor
├── components/
│   ├── Navbar.jsx     # Navigation bar + language switcher
│   ├── Footer.jsx     # Footer links
│   ├── FilterSidebar.jsx # Sidebar cho SearchResults
│   ├── HotelCard.jsx  # Card khách sạn + DetailOverlay
│   └── DetailOverlay.jsx # Radix Dialog wrapper (reusable)
├── pages/
│   ├── Home.jsx           # Trang chủ, tìm khách sạn
│   ├── Flights.jsx        # Tìm chuyến bay
│   ├── FlightAndHotel.jsx # Gói bay + ở
│   ├── CarRental.jsx      # Thuê xe
│   ├── Attractions.jsx    # Điểm tham quan
│   ├── AirportTaxis.jsx   # Taxi sân bay
│   ├── SearchResults.jsx  # Kết quả tìm khách sạn
│   ├── Checkout.jsx       # Trang thanh toán
│   ├── Login.jsx          # Đăng nhập (ẩn Navbar/Footer)
│   ├── Register.jsx       # Đăng ký (ẩn Navbar/Footer)
│   ├── Account.jsx        # Tài khoản (profile/bookings/security/settings)
│   ├── ListProperty.jsx   # Đăng chỗ nghỉ
│   ├── Careers.jsx        # Tuyển dụng
│   ├── CustomerService.jsx # Dịch vụ khách hàng
│   ├── BecomePartner.jsx  # Đối tác liên kết
│   └── Business.jsx       # Booking for Business
└── locales/
    ├── en/translation.json  # ~280 keys
    └── vi/translation.json  # ~280 keys
```

### Routes

| Path | Component | Ghi chú |
|---|---|---|
| `/` | Home | Trang chủ |
| `/login` | Login | Ẩn Navbar/Footer |
| `/register` | Register | Ẩn Navbar/Footer |
| `/flights` | Flights | |
| `/flight-hotel` | FlightAndHotel | |
| `/car-rentals` | CarRental | |
| `/attractions` | Attractions | |
| `/airport-taxis` | AirportTaxis | |
| `/search-results` | SearchResults | Query: city, checkIn, checkOut |
| `/checkout` | Checkout | Query: type, name, price, details |
| `/account` | Account | |
| `/list-your-property` | ListProperty | |
| `/careers` | Careers | |
| `/customer-service` | CustomerService | |
| `/become-partner` | BecomePartner | |
| `/business` | Business | |

### Translation namespaces (trong translation.json)
- `navbar`, `home`, `footer`, `account`
- `flights`, `flightAndHotel`, `carRental`
- `attractions`, `airportTaxis`, `checkout`

### Component patterns

**DetailOverlay** – Wrapper quanh Radix Dialog:
```jsx
<DetailOverlay
  trigger={<button>...</button>}  // Nút mở dialog
  title="..."
  description="..."
  content={<div>...</div>}        // Nội dung chi tiết
  footer={<button>...</button>}   // Nút action (đặt → checkout)
/>
```
Được sử dụng trong: HotelCard, Flights, CarRental, Attractions, AirportTaxis, FlightAndHotel.

**Checkout navigation pattern** – Tất cả nút "Đặt ngay" trong footer overlay navigate đến:
```
/checkout?type={type}&name={name}&price={price}&details={JSON}
```
Types: `hotel`, `flight`, `car`, `attraction`, `taxi`, `package`

---

## Cách chạy

### Backend
```bash
cd demo
./mvnw spring-boot:run
# Runs on http://localhost:8081
```
> Yêu cầu MySQL server ở 127.0.0.1:6666, database `booking_db`

### Frontend
```bash
cd demo/frontend
npm install
npm run dev
# Runs on http://localhost:5173
# API proxy: /api → localhost:8081
```

### Database
```bash
mysql -u root -P 6666 < db.sql   # Tạo schema
mysql -u root -P 6666 < seed.sql # Seed data
```

---

## Scripts hỗ trợ (Python)
- `gen_entities.py` – Tự động gen Java entity từ SQL schema
- `gen_services.py` – Tự động gen service/controller boilerplate

---

## Ghi chú kỹ thuật

1. **Auth**: JWT stored trong `localStorage` key `booking_token`. Axios interceptor tự gắn `Authorization: Bearer <token>`.
2. **i18n**: Fallback language = `vi`. Chuyển ngôn ngữ qua Navbar.
3. **Vite proxy**: `/api` → `http://localhost:8081` (dev mode).
4. **Navbar/Footer**: Ẩn trên trang `/login` và `/register`.
5. **Auto scroll**: Tự cuộn lên đầu khi chuyển route.
6. **Tailwind v4**: Dùng `@tailwindcss/vite` plugin, KHÔNG dùng `@tailwind` directives cũ.
7. **Icons**: Font Awesome (CDN trong index.html) + MUI Icons.
