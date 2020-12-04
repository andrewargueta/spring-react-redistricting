package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;

import Lions.demo.entity.State;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends CrudRepository<State, String>{
    
}
