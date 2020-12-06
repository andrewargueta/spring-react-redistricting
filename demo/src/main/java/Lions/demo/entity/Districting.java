package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

// @Entity
// @Table(name = "Districtings")
public class Districting {
    private String districtingId;
    private List<District> districts;
    private Double median;
    private int jobId;

    public Districting(String districtingId, int jobId){
        this.districtingId = districtingId;
        this.jobId = jobId;
        this.districts = new ArrayList<>();
    }

    public void sortDistricts(){
        Collections.sort(districts, (a,b) -> a.getVotingAgePercent().compareTo(b.getVotingAgePercent()));
    }

    // public void generateBoxAndWhisker(){
    //     sortDistricts();
    //     Double min = districts.get(0).getVotingAgePercent();
    //     Double q1 = districts.get(districts.size()/4).getVotingAgePercent();
    //     Double median = districts.get(districts.size()/2).getVotingAgePercent();
    //     Double q3 = districts.get((districts.size()*3) / 4).getVotingAgePercent();
    //     Double max = districts.get(districts.size()-1).getVotingAgePercent();
    //     this.boxAndWhisker = new BoxAndWhisker(min, q1, median, q3, max, districtingId, jobId);
    //     persistBoxAndWhisker(this.boxAndWhisker);
    // }

    public void findMedian(){
        this.median = districts.get(districts.size()/2).getVotingAgePercent();
    }

    // public void persistBoxAndWhisker(BoxAndWhisker boxAndWhisker){
    //     EntityManagerFactory emf = Persistence.createEntityManagerFactory("Lions.demo.entity.BoxAndWhisker");
    //     EntityManager em = emf.createEntityManager();
    //     em.getTransaction().begin();
    //     em.persist(boxAndWhisker);
    //     em.getTransaction().commit();
    //     em.close();
    // }

    // @Id
    // @Column(name = "districtingId")
    public String getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(String districtingId) {
        this.districtingId = districtingId;
    }

    // @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    // @JoinColumn(name = "districtingId")
    public List<District> getDistricts() {
        return this.districts;
    }

    public void setDistricts(List<District> districts) {
        this.districts = districts;
    }

    public void addDistrict(District d){
        this.districts.add(d);
    }

    public Double getMedian() {
        return this.median;
    }

    public void setMedian(Double median) {
        this.median = median;
    }
    
}