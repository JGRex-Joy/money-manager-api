package in.amir.moneymanager.service;


import in.amir.moneymanager.dto.CategoryDTO;
import in.amir.moneymanager.entity.CategoryEntity;
import in.amir.moneymanager.entity.ProfileEntity;
import in.amir.moneymanager.repository.CategoryRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if (categoryRepository.existsByNameAndProfileId(categoryDTO.getName(), profile.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }

        CategoryEntity newCategory = toEntity(categoryDTO, profile);
        newCategory = categoryRepository.save(newCategory);
        return toDTO(newCategory);
    }

    private CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile) {
        return CategoryEntity.builder()
                .name(categoryDTO.getName())
                .icon(categoryDTO.getIcon())
                .profile(profile)
                .type(categoryDTO.getType())
                .build();
    }

    private CategoryDTO toDTO(CategoryEntity categoryEntity) {
        return CategoryDTO.builder()
                .id(categoryEntity.getId())
                .profile_id(categoryEntity.getProfile() != null ? categoryEntity.getProfile().getId(): null)
                .name(categoryEntity.getName())
                .icon(categoryEntity.getIcon())
                .created_at(categoryEntity.getCreatedAt())
                .updated_at(categoryEntity.getUpdatedAt())
                .type(categoryEntity.getType())
                .build();
    }
}
