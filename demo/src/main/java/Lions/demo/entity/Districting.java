package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;


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

    public void findMedian(){
        this.median = districts.get(districts.size()/2).getVotingAgePercent();
    }

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

    public Double getMedian() {
        return this.median;
    }

    public void setMedian(Double median) {
        this.median = median;
    }
    
}