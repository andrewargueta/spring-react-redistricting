package Lions.demo.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import Lions.demo.entity.*;

public interface DistrictRepository extends CrudRepository<District, String>{

    @Modifying
    @Query(value = "DELETE FROM Districts WHERE jobId = :id", nativeQuery = true)
    void deleteByJob(@Param("id") int id);
}
