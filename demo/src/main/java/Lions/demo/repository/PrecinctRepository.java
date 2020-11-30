package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;

import Lions.demo.entity.*;

public interface PrecinctRepository extends CrudRepository<Precinct, String> {
    
}