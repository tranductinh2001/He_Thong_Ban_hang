package com.example.demo.service;

import com.example.demo.entity.Statistics;
import java.util.List;
import java.util.Optional;

public interface StatisticsService {

    List<Statistics> getAllStatistics();

    Optional<Statistics> getStatisticsById(Long id);

    Statistics createStatistics(Statistics statistics);

    Statistics updateStatistics(Statistics statistics, Long id);

    void deleteStatistics(Long id);
}
