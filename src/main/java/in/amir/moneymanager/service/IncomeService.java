package in.amir.moneymanager.service;

import in.amir.moneymanager.dto.ExpenseDTO;
import in.amir.moneymanager.dto.IncomeDTO;
import in.amir.moneymanager.entity.CategoryEntity;
import in.amir.moneymanager.entity.ExpenseEntity;
import in.amir.moneymanager.entity.IncomeEntity;
import in.amir.moneymanager.entity.ProfileEntity;
import in.amir.moneymanager.repository.CategoryRepository;
import in.amir.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;


    public IncomeDTO addIncome(IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category Not Found"));
        IncomeEntity newIncome = toEntity(dto, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    public void deleteIncome(Long incomeId){
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        if (!entity.getProfile().getId().equals(profile.getId())){
            throw new RuntimeException("Unauthorized to delete this income");
        }
        incomeRepository.delete(entity);
    }

    public List<IncomeDTO> getLatest5IncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    public BigDecimal getTotalIncomeForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total: BigDecimal.ZERO;
    }

    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::toDTO).toList();
    }


    private IncomeEntity toEntity(IncomeDTO incomeDTO, ProfileEntity profileEntity, CategoryEntity categoryEntity) {
        return IncomeEntity.builder()
                .name(incomeDTO.getName())
                .icon(incomeDTO.getIcon())
                .amount(incomeDTO.getAmount())
                .date(incomeDTO.getDate())
                .profile(profileEntity)
                .category(categoryEntity)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity incomeEntity) {
        return IncomeDTO.builder()
                .id(incomeEntity.getId())
                .name(incomeEntity.getName())
                .icon(incomeEntity.getIcon())
                .categoryId(incomeEntity.getCategory() != null ? incomeEntity.getCategory().getId() : null)
                .categoryName(incomeEntity.getCategory() != null ? incomeEntity.getCategory().getName() : "N/A")
                .amount(incomeEntity.getAmount())
                .date(incomeEntity.getDate())
                .createdAt(incomeEntity.getCreatedAt())
                .updatedAt(incomeEntity.getUpdatedAt())
                .build();
    }
}
