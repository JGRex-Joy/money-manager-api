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
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse:collapse;width:100%;'>");
                table.append("<tr><th>No.</th><th>Name</th><th>Amount</th><th>Category</th></tr>");
                int i = 1;
                for(ExpenseDTO expenseDTO : todayExpenses){
                    table.append("<tr>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(i++).append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expenseDTO.getName()).append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expenseDTO.getAmount()).append("</td>");
                    table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expenseDTO.getCategoryId() != null ?
                    expenseDTO.getCategoryId(): "N/A").append("</td>");
                    table.append("</tr>");
                }
                table.append("</table>");
                String body = "Hi " + profile.getFullName() + ",<br/>Here is a summary of your expenses for today: <br/><br/>" + table + "<br/><br/>Best regards,<br/>Money Manager CEO";
                emailService.sendEmail(profile.getEmail(), "Your daily Expense summary", body);
            }
        }
        log.info("Job started: sendDailyExpenseSummary");
    }

}
