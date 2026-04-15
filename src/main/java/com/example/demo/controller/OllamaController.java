package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.entity.Attraction;
import com.example.demo.entity.Hotel;
import com.example.demo.entity.Flight;
import com.example.demo.entity.Car;
import com.example.demo.entity.AirportTaxi;
import com.example.demo.repository.AttractionRepository;
import com.example.demo.repository.HotelRepository;
import com.example.demo.repository.FlightRepository;
import com.example.demo.repository.CarRepository;
import com.example.demo.repository.AirportTaxiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class OllamaController {

    private final String OLLAMA_API_URL = "http://localhost:11434/api/generate";
    private final String MODEL_NAME     = "gemma";

    // ── Simple LRU cache: key = normalized question, value = AI reply ──
    private final LinkedHashMap<String, String> responseCache = new LinkedHashMap<String, String>() {
        @Override protected boolean removeEldestEntry(Map.Entry<String, String> e) {
            return size() > 50; // keep last 50 answers
        }
    };

    // ── Thread pool for parallel DB queries ──
    private final ExecutorService executor = Executors.newFixedThreadPool(3);

    @Autowired private AttractionRepository attractionRepository;
    @Autowired private HotelRepository      hotelRepository;
    @Autowired private FlightRepository     flightRepository;
    @Autowired private CarRepository        carRepository;
    @Autowired private AirportTaxiRepository airportTaxiRepository;

    // ── Keyword sets ──
    private static final List<String> ATTRACTION_KW = Arrays.asList(
            "khu vui chơi", "địa điểm", "tham quan", "du lịch", "thắng cảnh",
            "điểm đến", "vui chơi", "giải trí", "attraction", "điểm tham quan",
            "khám phá", "danh lam", "thắng tích", "vui choi", "khu du lich",
            "kvc", "dd", "tq"
    );
    private static final List<String> HOTEL_KW = Arrays.asList(
            "khách sạn", "hotel", "resort", "nghỉ dưỡng", "đặt phòng",
            "chỗ nghỉ", "lưu trú", "homestay", "villa", "ở đâu", "ngu o dau",
            "ks", "nn"
    );
    private static final List<String> FLIGHT_KW = Arrays.asList(
            "chuyến bay", "vé máy bay", "flight", "bay", "hãng hàng không",
            "máy bay", "vé bay", "hành trình bay", "cb", "vmb"
    );
    private static final List<String> CAR_KW = Arrays.asList(
            "thuê xe", "mướn xe", "ô tô", "car rental", "xe tự lái", "xe hơi", "tx", "oto"
    );
    private static final List<String> TAXI_KW = Arrays.asList(
            "taxi", "đưa đón", "sân bay", "airport taxi", "đưa rước", "xe đưa đi", "xe sân bay", "sb"
    );
    private static final Map<String, String> CITY_MAP = new LinkedHashMap<>();
    static {
        CITY_MAP.put("hà nội", "Hà Nội"); CITY_MAP.put("ha noi", "Hà Nội"); CITY_MAP.put("hn", "Hà Nội");
        CITY_MAP.put("hồ chí minh", "Hồ Chí Minh"); CITY_MAP.put("ho chi minh", "Hồ Chí Minh"); CITY_MAP.put("sài gòn", "Hồ Chí Minh"); CITY_MAP.put("saigon", "Hồ Chí Minh"); CITY_MAP.put("sg", "Hồ Chí Minh"); CITY_MAP.put("hcm", "Hồ Chí Minh");
        CITY_MAP.put("đà nẵng", "Đà Nẵng"); CITY_MAP.put("da nang", "Đà Nẵng"); CITY_MAP.put("dn", "Đà Nẵng");
        CITY_MAP.put("phú quốc", "Phú Quốc"); CITY_MAP.put("phu quoc", "Phú Quốc"); CITY_MAP.put("pq", "Phú Quốc");
        CITY_MAP.put("đà lạt", "Đà Lạt"); CITY_MAP.put("da lat", "Đà Lạt"); CITY_MAP.put("dl", "Đà Lạt");
        CITY_MAP.put("nha trang", "Nha Trang"); CITY_MAP.put("nt", "Nha Trang");
        CITY_MAP.put("hội an", "Hội An"); CITY_MAP.put("hoi an", "Hội An"); CITY_MAP.put("ha", "Hội An");
        CITY_MAP.put("huế", "Huế"); CITY_MAP.put("hue", "Huế");
        CITY_MAP.put("vũng tàu", "Vũng Tàu"); CITY_MAP.put("vung tau", "Vũng Tàu"); CITY_MAP.put("vt", "Vũng Tàu");
        CITY_MAP.put("cần thơ", "Cần Thơ"); CITY_MAP.put("can tho", "Cần Thơ"); CITY_MAP.put("ct", "Cần Thơ");
        CITY_MAP.put("hạ long", "Hạ Long"); CITY_MAP.put("ha long", "Hạ Long"); CITY_MAP.put("hl", "Hạ Long");
        CITY_MAP.put("sa pa", "Sa Pa"); CITY_MAP.put("sapa", "Sa Pa"); CITY_MAP.put("sp", "Sa Pa");
        CITY_MAP.put("quảng ninh", "Quảng Ninh"); CITY_MAP.put("qn", "Quảng Ninh");
        CITY_MAP.put("bangkok", "Bangkok");
        CITY_MAP.put("singapore", "Singapore");
        CITY_MAP.put("bali", "Bali");
    }

    private enum ServiceType { ATTRACTION, HOTEL, FLIGHT, CAR, TAXI, UNKNOWN }

    private Optional<String> detectCity(String msg) {
        String lower = msg.toLowerCase();
        for (Map.Entry<String, String> entry : CITY_MAP.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return Optional.of(entry.getValue());
            }
        }
        return Optional.empty();
    }

    private ServiceType detectService(String msg) {
        String lower = msg.toLowerCase();
        if (ATTRACTION_KW.stream().anyMatch(lower::contains)) return ServiceType.ATTRACTION;
        if (HOTEL_KW.stream().anyMatch(lower::contains))     return ServiceType.HOTEL;
        if (FLIGHT_KW.stream().anyMatch(lower::contains))    return ServiceType.FLIGHT;
        if (CAR_KW.stream().anyMatch(lower::contains))       return ServiceType.CAR;
        if (TAXI_KW.stream().anyMatch(lower::contains))      return ServiceType.TAXI;
        return ServiceType.UNKNOWN;
    }

    // ── Parallel DB queries, max 3 records each ──
    private String buildDbContext(String message) {
        Optional<String> cityOpt = detectCity(message);
        ServiceType      svcType = detectService(message);
        StringBuilder    ctx     = new StringBuilder();

        if (cityOpt.isPresent()) {
            String city = cityOpt.get();

            // Run attraction + hotel queries in parallel when service is UNKNOWN
            if (svcType == ServiceType.ATTRACTION || svcType == ServiceType.UNKNOWN) {
                Future<List<Attraction>> attrFuture = executor.submit(() ->
                        attractionRepository.findByCityContainingIgnoreCase(city)
                                .stream().limit(3).collect(Collectors.toList()));
                try {
                    List<Attraction> list = attrFuture.get(3, TimeUnit.SECONDS);
                    if (!list.isEmpty()) {
                        ctx.append("=== ĐỊA ĐIỂM THAM QUAN TẠI ").append(city.toUpperCase()).append(" ===\n");
                        for (int i = 0; i < list.size(); i++) {
                            Attraction a = list.get(i);
                            ctx.append(i + 1).append(". ").append(a.getName())
                               .append(" | ").append(a.getCategory() != null ? a.getCategory() : "")
                               .append(" | Giá: ").append(a.getPrice() != null ? a.getPrice() + "đ" : "Liên hệ")
                               .append(" | ★ ").append(a.getRating() != null ? a.getRating() : "N/A").append("\n");
                        }
                        ctx.append("\n");
                    }
                } catch (Exception ignored) {}
            }

            if (svcType == ServiceType.HOTEL || svcType == ServiceType.UNKNOWN) {
                Future<List<Hotel>> hotelFuture = executor.submit(() ->
                        hotelRepository.findByCityContainingIgnoreCase(city)
                                .stream().limit(3).collect(Collectors.toList()));
                try {
                    List<Hotel> list = hotelFuture.get(3, TimeUnit.SECONDS);
                    if (!list.isEmpty()) {
                        ctx.append("=== KHÁCH SẠN TẠI ").append(city.toUpperCase()).append(" ===\n");
                        for (int i = 0; i < list.size(); i++) {
                            Hotel h = list.get(i);
                            ctx.append(i + 1).append(". ").append(h.getName())
                               .append(" | ★ ").append(h.getRating() != null ? h.getRating() : "N/A").append("\n");
                        }
                        ctx.append("\n");
                    }
                } catch (Exception ignored) {}
            }

            if (svcType == ServiceType.CAR || svcType == ServiceType.UNKNOWN) {
                Future<List<Car>> carFuture = executor.submit(() ->
                        carRepository.findAvailableCars(city, LocalDateTime.now(), LocalDateTime.now().plusDays(1))
                                .stream().limit(3).collect(Collectors.toList()));
                try {
                    List<Car> list = carFuture.get(3, TimeUnit.SECONDS);
                    if (!list.isEmpty()) {
                        ctx.append("=== THUÊ XE TẠI ").append(city.toUpperCase()).append(" ===\n");
                        for (int i = 0; i < list.size(); i++) {
                            Car c = list.get(i);
                            ctx.append(i + 1).append(". ").append(c.getCarModel())
                               .append(" | Hãng: ").append(c.getCompanyName())
                               .append(" | ").append(c.getSeats() != null ? c.getSeats() : 4).append(" chỗ")
                               .append(" | Giá: ").append(c.getPricePerDay()).append("đ/ngày\n");
                        }
                        ctx.append("\n");
                    }
                } catch (Exception ignored) {}
            }

            if (svcType == ServiceType.TAXI || svcType == ServiceType.UNKNOWN) {
                Future<List<AirportTaxi>> taxiFuture = executor.submit(() ->
                        airportTaxiRepository.findAvailableTaxisByCity(city, LocalDateTime.now(), LocalDateTime.now().plusDays(1))
                                .stream().limit(3).collect(Collectors.toList()));
                try {
                    List<AirportTaxi> list = taxiFuture.get(3, TimeUnit.SECONDS);
                    if (!list.isEmpty()) {
                        ctx.append("=== TAXI SÂN BAY TẠI ").append(city.toUpperCase()).append(" ===\n");
                        for (int i = 0; i < list.size(); i++) {
                            AirportTaxi t = list.get(i);
                            ctx.append(i + 1).append(". Xe: ").append(t.getCarType())
                               .append(" | Giá gốc: ").append(t.getBasePrice()).append("đ\n");
                        }
                        ctx.append("\n");
                    }
                } catch (Exception ignored) {}
            }
        }

        if (svcType == ServiceType.FLIGHT) {
            Optional<String> dest = detectCity(message);
            if (dest.isPresent()) {
                Future<List<Flight>> flightFuture = executor.submit(() ->
                        flightRepository.findByArrivalCity(dest.get())
                                .stream().limit(3).collect(Collectors.toList()));
                try {
                    List<Flight> list = flightFuture.get(3, TimeUnit.SECONDS);
                    if (!list.isEmpty()) {
                        ctx.append("=== CHUYẾN BAY ĐẾN ").append(dest.get().toUpperCase()).append(" ===\n");
                        for (int i = 0; i < list.size(); i++) {
                            Flight f = list.get(i);
                            ctx.append(i + 1).append(". ").append(f.getAirline())
                               .append(" | ").append(f.getDepartureAirport().getCity())
                               .append(" → ").append(f.getArrivalAirport().getCity())
                               .append(" | ").append(f.getPrice()).append("đ\n");
                        }
                        ctx.append("\n");
                    }
                } catch (Exception ignored) {}
            }
        }

        return ctx.toString();
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody ChatRequest request) {
        String userMsg = request.getMessage() == null ? "" : request.getMessage().trim();
        if (userMsg.isEmpty()) {
            return ResponseEntity.ok(Map.of("response", "Bạn muốn hỏi gì ạ? 😊"));
        }

        // 1. Normalize cache key
        String cacheKey = userMsg.toLowerCase().replaceAll("\\s+", " ");
        synchronized (responseCache) {
            if (responseCache.containsKey(cacheKey)) {
                return ResponseEntity.ok(Map.of("response", responseCache.get(cacheKey)));
            }
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            // 2. DB context
            String dbCtx = buildDbContext(userMsg);

            // 3. Compact prompt (fewer tokens = faster)
            String prompt;
            if (!dbCtx.isEmpty()) {
                prompt = "Bạn là trợ lý AI chuyên nghiệp của Booking.com. Dữ liệu từ hệ thống:\n" + dbCtx +
                         "Hãy trả lời NGẮN GỌN (1-2 câu) dựa CHÍNH XÁC vào dữ liệu trên. KHÔNG bịa thêm thông tin ngoài danh sách.\nHỏi: " + userMsg;
            } else {
                prompt = "Bạn là AI du lịch. Trả lời ngắn gọn tiếng Việt, thân thiện.\nHỏi: " + userMsg;
            }

            // 4. Ollama payload with speed-tuning params
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model",       MODEL_NAME);
            payload.put("prompt",      prompt);
            payload.put("stream",      false);
            // ── Speed params ──
            Map<String, Object> options = new LinkedHashMap<>();
            options.put("num_predict",  200);   // max output tokens — biggest speedup
            options.put("temperature",  0.7);   // focused answers
            options.put("top_k",        30);    // narrow candidate tokens
            options.put("top_p",        0.85);  // nucleus sampling
            options.put("num_ctx",      1024);  // context window (default 2048)
            options.put("repeat_penalty", 1.1); // reduce repetition
            payload.put("options", options);

            // 5. Call Ollama
            @SuppressWarnings("unchecked")
            Map<String, Object> ollamaResp = restTemplate.postForObject(OLLAMA_API_URL, payload, Map.class);

            String reply = "Gemma đang bận, vui lòng thử lại!";
            if (ollamaResp != null && ollamaResp.containsKey("response")) {
                reply = ollamaResp.get("response").toString().trim();
            }

            // 6. Cache result
            synchronized (responseCache) {
                responseCache.put(cacheKey, reply);
            }

            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    Map.of("response", "Xin lỗi, hệ thống AI đang bảo trì hoặc Ollama chưa chạy!"));
        }
    }
}
