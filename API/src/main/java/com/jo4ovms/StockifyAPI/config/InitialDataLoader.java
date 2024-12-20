package com.jo4ovms.StockifyAPI.config;


import com.jo4ovms.StockifyAPI.model.ERole;
import com.jo4ovms.StockifyAPI.model.Role;
import com.jo4ovms.StockifyAPI.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Component
public class InitialDataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Logger logger = Logger.getLogger(InitialDataLoader.class.getName());


    @Override
    public void run(String... args) throws Exception {

        try {
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS unaccent;");
            logger.info("Extensão unaccent ativada no banco de dados.");
        } catch (Exception e) {
            logger.warning("Erro ao ativar a extensão unaccent: " + e.getMessage());
        }

        logger.info("Checking roles in database...");

        if(roleRepository.count() == 0) {
            logger.info("No Roles found. Creating roles...");
            List<Role> roles = Arrays.asList(
                    new Role(ERole.ROLE_USER),
                    new Role(ERole.ROLE_ADMIN)
            );
            roleRepository.saveAll(roles);
            logger.info("Default Roles inserted.");
        } else {
            logger.info("Roles already exist. Skipping...");
        }
    }
}
