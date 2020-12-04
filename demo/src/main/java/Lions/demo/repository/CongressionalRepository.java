package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;

import Lions.demo.entity.CongressionalDistrict;
import org.springframework.stereotype.Repository;

@Repository
public interface CongressionalRepository extends CrudRepository<CongressionalDistrict, Integer>{
    
}
