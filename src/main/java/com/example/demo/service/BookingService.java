package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.BookingStatus;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private com.example.demo.repository.HotelBookingRepository hotelBookingRepository;
    @Autowired
    private com.example.demo.repository.FlightBookingRepository flightBookingRepository;
    @Autowired
    private com.example.demo.repository.CarRentalBookingRepository carRentalBookingRepository;
    @Autowired
    private com.example.demo.repository.AttractionBookingRepository attractionBookingRepository;
    @Autowired
    private com.example.demo.repository.TaxiBookingRepository taxiBookingRepository;

    @Autowired
    private EmailService emailService;

    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        for (Booking b : bookings) {
            try {
                switch (b.getBookingType()) {
                    case HOTEL:
                        hotelBookingRepository.findById(b.getId()).ifPresent(hb -> {
                            if (hb.getRoom() != null && hb.getRoom().getHotel() != null) {
                                b.setServiceName(hb.getRoom().getHotel().getName());
                                b.setServiceDetail(hb.getRoom().getRoomType());
                            }
                        });
                        break;
                    case FLIGHT:
                        flightBookingRepository.findById(b.getId()).ifPresent(fb -> {
                            if (fb.getFlight() != null) {
                                b.setServiceName(fb.getFlight().getAirline() + " (" + fb.getFlight().getFlightNumber() + ")");
                                b.setServiceDetail(fb.getFlight().getDepartureAirport().getCode() + " ➔ " + fb.getFlight().getArrivalAirport().getCode());
                            }
                        });
                        break;
                    case CAR_RENTAL:
                        carRentalBookingRepository.findById(b.getId()).ifPresent(cb -> {
                            if (cb.getCar() != null && cb.getPickupLocation() != null) {
                                b.setServiceName(cb.getCar().getCompanyName() + " - " + cb.getCar().getCarModel());
                                b.setServiceDetail("Nhận xe: " + cb.getPickupLocation().getCity());
                            }
                        });
                        break;
                    case ATTRACTION:
                        attractionBookingRepository.findById(b.getId()).ifPresent(ab -> {
                            if (ab.getAttraction() != null) {
                                b.setServiceName(ab.getAttraction().getName());
                                b.setServiceDetail(ab.getAttraction().getCity());
                            }
                        });
                        break;
                    case TAXI:
                        taxiBookingRepository.findById(b.getId()).ifPresent(tb -> {
                            if (tb.getTaxi() != null) {
                                b.setServiceName("Taxi Sân Bay " + tb.getTaxi().getAirport().getCode());
                                b.setServiceDetail(tb.getTaxi().getCarType() + " | Điểm đến: " + tb.getDropoffAddress());
                            }
                        });
                        break;
                }
            } catch (Exception e) {
                System.err.println("Loi load chi tiet booking " + b.getId() + ": " + e.getMessage());
            }
        }
        
        bookings.sort((b1, b2) -> {
            if (b1.getCreatedAt() == null) return 1;
            if (b2.getCreatedAt() == null) return -1;
            return b2.getCreatedAt().compareTo(b1.getCreatedAt());
        });
        
        return bookings;
    }

    public java.util.Optional<Booking> getBookingByCode(String bookingCode) {
        List<Booking> list = bookingRepository.findByBookingCode(bookingCode);
        if (list != null && !list.isEmpty()) {
            return java.util.Optional.of(list.get(list.size() - 1));
        }
        return java.util.Optional.empty();
    }

    public Booking createBooking(Booking booking) {
        try {
            System.out.println("BookingService: Dang luu don hang voi ma: " + booking.getBookingCode());
            Booking savedBooking = bookingRepository.save(booking);

            // Gửi email xác nhận đặt chỗ tự động
            sendBookingEmail(savedBooking, "CREATED");

            return savedBooking;
        } catch (Exception e) {
            System.err.println("DATABASE ERROR khi luu booking: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Root Cause: " + e.getCause().getMessage());
            }
            throw e;
        }
    }

    public Booking updateStatus(Long id, BookingStatus status) {
        return bookingRepository.findById(id).map(booking -> {
            boolean isStatusChanged = booking.getStatus() != status;
            booking.setStatus(status);
            Booking updatedBooking = bookingRepository.save(booking);

            if (isStatusChanged) {
                // Gửi email thông báo khi trạng thái thay đổi
                if (status == BookingStatus.CONFIRMED) {
                    sendBookingEmail(updatedBooking, "CONFIRMED");
                } else if (status == BookingStatus.CANCELLED) {
                    sendBookingEmail(updatedBooking, "CANCELLED");
                }
            }

            return updatedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    public void cancelBooking(Long id) {
        updateStatus(id, BookingStatus.CANCELLED);
    }

    /**
     * Gửi email tương ứng với sự kiện booking.
     */
    private void sendBookingEmail(Booking booking, String event) {
        try {
            // Lấy thông tin user từ booking
            if (booking.getUser() == null) {
                System.out.println("EMAIL: Khong gui email vi booking khong co thong tin user");
                return;
            }

            String email = booking.getUser().getEmail();
            String name = booking.getUser().getFullName();

            if (email == null || email.isEmpty()) {
                System.out.println("EMAIL: Khong gui email vi user khong co email");
                return;
            }

            switch (event) {
                case "CREATED" -> emailService.sendBookingConfirmation(booking, email, name);
                case "CONFIRMED" -> emailService.sendPaymentSuccess(booking, email, name);
                case "CANCELLED" -> emailService.sendBookingCancellation(booking, email, name);
            }
        } catch (Exception e) {
            // Không throw lỗi email để không ảnh hưởng đến luồng booking chính
            System.err.println("EMAIL: Loi khi gui email (khong anh huong booking): " + e.getMessage());
        }
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
}
