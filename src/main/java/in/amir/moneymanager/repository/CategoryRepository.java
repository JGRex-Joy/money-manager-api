package in.amir.moneymanager.repository;

import in.amir.moneymanager.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {

    List<CategoryEntity> findByProfileId(Long profile_id);

    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);

}
