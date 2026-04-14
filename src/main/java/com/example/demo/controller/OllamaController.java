package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.entity.Attraction;
import com.example.demo.entity.Hotel;
import com.example.demo.entity.Flight;
import com.example.demo.repository.AttractionRepository;
import com.example.demo.repository.HotelRepository;
import com.example.demo.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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
    private final LinkedHashMap<String, String> responseCache = new LinkedHashMap<>() {
        @Override protected boolean removeEldestEntry(Map.Entry<String, String> e) {
            return size() > 50; // keep last 50 answers
        }
    };

    // ── Thread pool for parallel DB queries ──
    private final ExecutorService executor = Executors.newFixedThreadPool(3);

    @Autowired private AttractionRepository attractionRepository;
    @Autowired private HotelRepository      hotelRepository;
    @Autowired private FlightRepository     flightRepository;

    // ── Keyword sets ──
    private static final List<String> ATTRACTION_KW = Arrays.asList(
            "khu vui chơi", "địa điểm", "tham quan", "du lịch", "thắng cảnh",
            "điểm đến", "vui chơi", "giải trí", "attraction", "điểm tham quan",
            "khám phá", "danh lam", "thắng tích", "vui choi", "khu du lich"
    );
    private static final List<String> HOTEL_KW = Arrays.asList(
            "khách sạn", "hotel", "resort", "nghỉ dưỡng", "đặt phòng",
            "chỗ nghỉ", "lưu trú", "homestay", "villa", "ở đâu", "ngu o dau"
    );
    private static final List<String> FLIGHT_KW = Arrays.asList(
            "chuyến bay", "vé máy bay", "flight", "bay", "hãng hàng không",
            "máy bay", "vé bay", "hành trình bay"
    );
    private static final List<String> CITY_KW = Arrays.asList(
            "hà nội", "ha noi", "hồ chí minh", "ho chi minh", "sài gòn", "saigon",
            "đà nẵng", "da nang", "phú quốc", "phu quoc", "đà lạt", "da lat",
            "nha trang", "hội an", "hoi an", "huế", "hue", "vũng tàu", "vung tau",
            "cần thơ", "can tho", "hạ long", "ha long", "sa pa", "sapa",
            "quảng ninh", "bangkok", "singapore", "bali"
    );

    private enum ServiceType { ATTRACTION, HOTEL, FLIGHT, UNKNOWN }

    private Optional<String> detectCity(String msg) {
        String lower = msg.toLowerCase();
        return CITY_KW.stream().filter(lower::contains).findFirst();
    }

    private ServiceType detectService(String msg) {
        String lower = msg.toLowerCase();
        if (ATTRACTION_KW.stream().anyMatch(lower::contains)) return ServiceType.ATTRACTION;
        if (HOTEL_KW.stream().anyMatch(lower::contains))     return ServiceType.HOTEL;
        if (FLIGHT_KW.stream().anyMatch(lower::contains))    return ServiceType.FLIGHT;
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
        }

        if (svcType == ServiceType.FLIGHT) {
            String msgLower = message.toLowerCase();
            Optional<String> dest = CITY_KW.stream().filter(msgLower::contains).findFirst();
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
                prompt = "Bạn là AI du lịch Gemma. Dữ liệu thực:\n" + dbCtx +
                         "Dựa vào dữ liệu trên, trả lời ngắn gọn bằng tiếng Việt (tối đa 3 gợi ý, mỗi gợi ý 1-2 câu).\n" +
                         "Hỏi: " + userMsg;
            } else {
                prompt = "Bạn là AI du lịch Gemma. Trả lời ngắn gọn tiếng Việt, thân thiện.\nHỏi: " + userMsg;
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
