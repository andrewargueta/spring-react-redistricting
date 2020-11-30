package Lions.demo.entity;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;

import Lions.demo.enums.*;
import Lions.demo.repository.PrecinctRepository;

public class District {
    private String districtId;
    // private List<Precinct> precincts;
    private List<String> precincts;
    private int counties;
    private Double votingAgePercent;
    private String districtingId;

    public District(String districtId, String districtingId){
        this.districtId = districtId;
        this.districtingId = districtingId;
        this.precincts = new ArrayList<>();
    }

    public String getDistrictId() {
        return this.districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    public String getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(String districtingId) {
        this.districtingId = districtingId;
    }

    public List<String> getPrecincts() {
        return this.precincts;
    }

    public void setPrecincts(List<String> precincts) {
        this.precincts = precincts;
    }

    public void addPrecinct(String precinctId){
        this.precincts.add(precinctId);
    }

    public int getCounties() {
        return this.counties;
    }

    public void setCounties(int counties) {
        this.counties = counties;
    }


    public Double getVotingAgePercent() {
        return this.votingAgePercent;
    }

    public void setVotingAgePercent(Double votingAgePercent) {
        this.votingAgePercent = votingAgePercent;
    }
}
