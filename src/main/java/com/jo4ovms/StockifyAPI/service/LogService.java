package com.jo4ovms.StockifyAPI.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jo4ovms.StockifyAPI.mapper.LogMapper;
import com.jo4ovms.StockifyAPI.model.DTO.LogDTO;
import com.jo4ovms.StockifyAPI.model.Log;
import com.jo4ovms.StockifyAPI.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private LogMapper logMapper;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private ObjectMapper objectMapper;

    public void createLog(LogDTO logDTO) {
        try {

            String logMessage = objectMapper.writeValueAsString(logDTO);

            kafkaProducerService.sendMessage(logMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Page<LogDTO> getAllLogs(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return logRepository.findAll(pageable).map(logMapper::toLogDTO);
    }

    public Page<LogDTO> getRecentActivities(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        return logRepository.findAll(pageable).map(logMapper::toLogDTO);
    }
}
