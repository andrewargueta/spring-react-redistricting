package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

// @Entity
// @Table(name = "districting")
public class Districting {
    private String districtingId;
    private List<District> districts;
    private BoxAndWhisker boxAndWhisker;

    public Districting(String districtingId){
        this.districtingId = districtingId;
        this.districts = new ArrayList<>();
    }

    public void sortDistricts(){
        Collections.sort(districts, (a,b) -> a.getVotingAgePercent().compareTo(b.getVotingAgePercent()));
    }

    public void generateBoxAndWhisker(){
        sortDistricts();
        Double min = districts.get(0).getVotingAgePercent();
        Double q1 = districts.get(districts.size()/4).getVotingAgePercent();
        Double mid = districts.get(districts.size()/2).getVotingAgePercent();
        Double q3 = districts.get((districts.size()*3) / 4).getVotingAgePercent();
        Double max = districts.get(districts.size()-1).getVotingAgePercent();
        this.boxAndWhisker = new BoxAndWhisker(min, q1, mid, q3, max);
    }

    // @Id
    // @Column(name = "districtingId")
    public String getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(String districtingId) {
        this.districtingId = districtingId;
    }

    public List<District> getDistricts() {
        return this.districts;
    }

    public void setDistricts(List<District> districts) {
        this.districts = districts;
    }

    public void addDistrict(District d){
        this.districts.add(d);
    }

    public BoxAndWhisker getBoxAndWhisker() {
        return this.boxAndWhisker;
    }

    public void setBoxAndWhisker(BoxAndWhisker boxAndWhisker) {
        this.boxAndWhisker = boxAndWhisker;
    }
}