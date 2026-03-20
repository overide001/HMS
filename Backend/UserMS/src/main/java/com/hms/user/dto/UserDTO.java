package com.hms.user.dto;

import java.time.LocalDateTime;

import com.hms.user.entity.User;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    @NotBlank(message = "Name is mandatory") // null, ""
    private String name;
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;
    @NotBlank(message = "Password is mandatory")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{8,15}$", message = "Password should contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character min 8 char and max 15 characters")
    private String password;
    private Roles role;
    private Long profileId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User toEntity() {
        return new User(this.id, this.name, this.email, this.password, this.role, this.profileId, this.createdAt,
                this.updatedAt);
    }
}
