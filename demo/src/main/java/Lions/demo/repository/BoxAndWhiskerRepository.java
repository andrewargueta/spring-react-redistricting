package Lions.demo.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.*;

import Lions.demo.entity.BoxAndWhisker;

public interface BoxAndWhiskerRepository extends CrudRepository<BoxAndWhisker, String>{

    @Query(value = "SELECT * FROM BoxAndWhiskers WHERE jobId = :id", nativeQuery = true)
    List<BoxAndWhisker> findByJob(@Param("id") int id);
}
