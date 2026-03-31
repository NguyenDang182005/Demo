package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.client.RestClientResponseException;

@Service
public class PaypalService {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    private final RestTemplate restTemplate = new RestTemplate();

    private String getBaseUrl() {
        return "sandbox".equals(mode) ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
    }

    private String getAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    getBaseUrl() + "/v1/oauth2/token",
                    request,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
            throw new RuntimeException("Cannot get PayPal access token");
        } catch (RestClientResponseException e) {
            throw new RuntimeException("PayPal Token Error: " + e.getResponseBodyAsString(), e);
        }
    }

    public Map<String, Object> createOrder(String value) {
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo body JSON thủ công để không phải tạo thêm class
        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("intent", "CAPTURE");
        
        Map<String, Object> amount = new HashMap<>();
        amount.put("currency_code", "USD");
        amount.put("value", value); // Ví dụ "10.00"

        Map<String, Object> purchaseUnit = new HashMap<>();
        purchaseUnit.put("amount", amount);

        orderRequest.put("purchase_units", Collections.singletonList(purchaseUnit));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderRequest, headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    getBaseUrl() + "/v2/checkout/orders",
                    request,
                    Map.class
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            return body;
        } catch (RestClientResponseException e) {
            throw new RuntimeException("PayPal Create Order Error: " + e.getResponseBodyAsString(), e);
        }
    }

    public Map<String, Object> captureOrder(String orderId) {
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // Theo tài liệu PayPal, request body cho capture là {} (rỗng) và dùng POST
        // Chúng ta có thể dùng String rỗng cho request entity body
        HttpEntity<String> request = new HttpEntity<>("{}", headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(
                    getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            return body;
        } catch (RestClientResponseException e) {
            throw new RuntimeException("PayPal Capture Order Error: " + e.getResponseBodyAsString(), e);
        }
    }
}
