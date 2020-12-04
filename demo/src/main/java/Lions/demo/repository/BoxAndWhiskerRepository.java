package Lions.demo.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

import Lions.demo.entity.BoxAndWhisker;

@Repository
public interface BoxAndWhiskerRepository extends CrudRepository<BoxAndWhisker, String>{

    @Query(value = "SELECT * FROM BoxAndWhiskers WHERE jobId = :id", nativeQuery = true)
    List<BoxAndWhisker> findByJobId(@Param("id") int id);

    @Modifying
    @Query(value = "DELETE FROM BoxAndWhiskers WHERE jobId = :id", nativeQuery = true)
    void deleteByJobId(@Param("id") int id);
}
