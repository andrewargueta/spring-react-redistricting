package Lions.demo.entity;

import java.util.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.beans.factory.annotation.Autowired;

import Lions.demo.enums.*;
import Lions.demo.repository.PrecinctRepository;

@Entity
@Table(name = "Districts")
public class District {
    private String districtId;
    // private List<Precinct> precincts;
    private List<String> precincts;
    private String precicntIds;
    private int counties;
    private Double votingAgePercent;
    private String districtingId;
    private String coordinates;
    private int jobId;

    public District(String districtId, String districtingId, int jobId){
        this.districtId = districtId;
        this.districtingId = districtingId;
        this.coordinates = "place holder";
        this.precincts = new ArrayList<>();
        this.precicntIds = "";
        this.jobId = jobId;
    }

    @Id
    @Column(name="districtId")
    public String getDistrictId() {
        return this.districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    @Column(name="districtingId")
    public String getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(String districtingId) {
        this.districtingId = districtingId;
    }

    public List<String> findPrecincts() {
        return this.precincts;
    }

    public void setPrecincts(List<String> precincts) {
        this.precincts = precincts;
    }

    public void addPrecinct(String precinctId){
        this.precincts.add(precinctId);
    }

    @Column(name="counties")
    public int getCounties() {
        return this.counties;
    }

    public void setCounties(int counties) {
        this.counties = counties;
    }

    @Column(name="votingAgePercent")
    public Double getVotingAgePercent() {
        return this.votingAgePercent;
    }

    public void setVotingAgePercent(Double votingAgePercent) {
        this.votingAgePercent = votingAgePercent;
    }

    @Column(name="coordinates")
    public String getCoordinates() {
        return this.coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    @Column(name="precinctIds")
    public String getPrecicntIds() {
        return this.precicntIds;
    }

    public void setPrecicntIds(String precicntIds) {
        this.precicntIds = precicntIds;
    }

    public void addPrecinctIds(String s){
        this.precicntIds = this.precicntIds + s + " ";
    }

    @Column(name="jobId")
    public int getJobId() {
        return this.jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }
}
