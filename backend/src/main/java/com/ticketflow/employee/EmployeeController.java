package com.ticketflow.employee;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

  private final EmployeeRepository repo;

  public EmployeeController(EmployeeRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<Employee> list() {
    return repo.findAll();
  }

  @GetMapping("/{id}")
  public Employee get(@PathVariable Long id) {
    return repo
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Employee create(@Valid @RequestBody Employee employee) {
    employee.setId(null);
    return repo.save(employee);
  }

  @PutMapping("/{id}")
  public Employee update(@PathVariable Long id, @Valid @RequestBody Employee updated) {
    var existing =
        repo
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

    existing.setName(updated.getName());
    existing.setPosition(updated.getPosition());
    existing.setDepartment(updated.getDepartment());
    existing.setSalary(updated.getSalary());

    return repo.save(existing);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
    }
    repo.deleteById(id);
  }
}
