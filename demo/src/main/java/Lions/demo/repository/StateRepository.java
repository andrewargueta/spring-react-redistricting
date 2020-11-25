package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;

import Lions.demo.entity.State;

public interface StateRepository extends CrudRepository<State, String>{
    
}
