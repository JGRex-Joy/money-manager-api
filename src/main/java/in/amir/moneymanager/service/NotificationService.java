package in.amir.moneymanager.service;

import in.amir.moneymanager.dto.ExpenseDTO;
import in.amir.moneymanager.entity.ProfileEntity;
import in.amir.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Scheduled(cron = "0 0 22 * * *", zone="UTC")
    public void sendDailyIncomeExpenseReminder(){
        log.info("Job started: sendDailyIncomeExpenseReminder");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles){
            String body = "Hi " + profile.getFullName()
                    + "This is a friendly remainder to add your incomes and expenses for today in Money Manager "
                    + frontendUrl
                    + " Best regards,<br>Money Manager CEO";
            emailService.sendEmail(profile.getEmail(), "Daily reminder. Add your income and expenses", body);
        }
        log.info("Job finished: sendDailyIncomeExpenseReminder");
    }

    @Scheduled(cron = "0 0 23 * * *", zone="UTC")
    public void sendDailyExpenseSummary(){
        log.info("Job started: sendDailyExpenseSummary");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles){
            List<ExpenseDTO> todayExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now(ZoneId.of("UTC")));
            if (!todayExpenses.isEmpty()){
                StringBuilder
            }
        }
    }

}
