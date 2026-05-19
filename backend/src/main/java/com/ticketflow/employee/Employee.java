package com.ticketflow.employee;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employees")
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @NotBlank
  @Column(nullable = false)
  private String position;

  @NotBlank
  @Column(nullable = false)
  private String department;

  @NotNull
  @Column(nullable = false)
  private BigDecimal salary;

  // Supabase often uses created_at. We'll map to createdAt.
  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public Long getId() { return id; }

  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }

  public void setName(String name) { this.name = name; }

  public String getPosition() { return position; }

  public void setPosition(String position) { this.position = position; }

  public String getDepartment() { return department; }

  public void setDepartment(String department) { this.department = department; }

  public BigDecimal getSalary() { return salary; }

  public void setSalary(BigDecimal salary) { this.salary = salary; }

  public OffsetDateTime getCreatedAt() { return createdAt; }

  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
