package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;

import Lions.demo.entity.CongressionalDistrict;

public interface CongressionalRepository extends CrudRepository<CongressionalDistrict, Integer>{
    
}
