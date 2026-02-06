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
import org.springframework.stereotype.Service;

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
