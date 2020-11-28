package Lions.demo.repository;

import org.springframework.data.repository.CrudRepository;
import Lions.demo.entity.*;

public interface JobRepository extends CrudRepository<Job, Integer>{
    
}
