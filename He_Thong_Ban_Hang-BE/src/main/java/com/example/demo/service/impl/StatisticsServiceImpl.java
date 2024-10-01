package com.example.demo.service.impl;

import com.example.demo.entity.Statistics;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.StatisticsRepository;
import com.example.demo.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Override
    public List<Statistics> getAllStatistics() {
        return statisticsRepository.findAll();
    }

    @Override
    public Optional<Statistics> getStatisticsById(Long id) {
        return Optional.ofNullable(statisticsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Statistics not found with id: " + id)));
    }

    @Override
    public Statistics createStatistics(Statistics statistics) {
        return statisticsRepository.save(statistics);
    }

    @Override
    public Statistics updateStatistics(Statistics statistics, Long id) {
        Statistics existingStatistics = getStatisticsById(id)
                .orElseThrow(() -> new NotFoundException("Statistics not found with id: " + id));
        //existingStatistics.setViews(statistics.getViews());
        return statisticsRepository.save(existingStatistics);
    }

    @Override
    public void deleteStatistics(Long id) {
        statisticsRepository.deleteById(id);
    }
}
