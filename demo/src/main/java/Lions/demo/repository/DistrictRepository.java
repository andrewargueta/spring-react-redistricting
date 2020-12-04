package Lions.demo.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Lions.demo.entity.*;
import java.util.*;

@Repository
public interface DistrictRepository extends CrudRepository<District, String>{

    @Query(value = "SELECT * FROM Districts WHERE districtingId = :id", nativeQuery = true)
    List<District> findByDistrictingId(@Param("id") String id);

    @Modifying
    @Query(value = "DELETE FROM Districts WHERE jobId = :id", nativeQuery = true)
    void deleteByJobId(@Param("id") int id);
}
