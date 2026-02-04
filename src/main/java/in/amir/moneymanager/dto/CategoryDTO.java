package in.amir.moneymanager.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String profile_id;
    private String name;
    private String icon;
    private String type;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
