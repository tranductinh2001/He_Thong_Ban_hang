package com.example.demo.service;

import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.io.IOException;
import java.util.Map;

public interface LeonardoService {
    JSONObject processImageGeneration(String imagePath, String prompt, String modelId) throws IOException, InterruptedException;
}
