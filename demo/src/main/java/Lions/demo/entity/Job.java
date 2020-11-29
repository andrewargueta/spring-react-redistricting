package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import Lions.demo.enums.*;

@Entity
@Table(name = "job")
public class Job {
    private int averageDistricting;
    private int extremeDistricting;
    private int randomDistricting;

    private int jobId;
    private String stateName;
    private int numberOfPlans;
    private String compactness;
    private double populationThreshold;
    private String runLocation;
    
    private String status;
    private String minorityGroups;

    public Job(String stateName, int newJobId, int numOfPlans, String compactness, double populationVariation, String minorityGroups, String runLoc, String status){
        this.stateName = stateName;
        this.jobId = newJobId;
        this.numberOfPlans = numOfPlans;
        this.compactness = compactness;
        this.populationThreshold = populationVariation;
        this.runLocation = runLoc;
        this.status = status;
        this.averageDistricting = -1;
        this.extremeDistricting = -1;
        this.minorityGroups = minorityGroups;
    }

    public Job(){
        
    }

    @Id
    @Column(name = "jobId")
    public int getJobId() {
        return this.jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }
    
    @Column(name = "stateName")
    public String getStateName() {
        return this.stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    @Column(name = "numberOfPlans")
    public int getNumberOfPlans() {
        return this.numberOfPlans;
    }

    public void setNumberOfPlans(int numberOfPlans) {
        this.numberOfPlans = numberOfPlans;
    }

    @Column(name = "compactness")
    public String getCompactness() {
        return this.compactness;
    }

    public void setCompactness(String compactness) {
        this.compactness = compactness;
    }

    @Column(name = "populationThreshold")
    public double getPopulationThreshold() {
        return this.populationThreshold;
    }

    public void setPopulationThreshold(double populationThreshold) {
        this.populationThreshold = populationThreshold;
    }

    @Column(name = "runLocation")
    public String getRunLocation() {
        return this.runLocation;
    }

    public void setRunLocation(String runLocation) {
        this.runLocation = runLocation;
    }

    @Column(name = "status")
    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Column(name = "minorityGroups")
    public String getMinorityGroups() {
        return this.minorityGroups;
    }

    public void setMinorityGroups(String minorityGroups) {
        this.minorityGroups = minorityGroups;
    }

    @Column(name = "averageDistricting")
    public int getAverageDistricting() {
        return this.averageDistricting;
    }

    public void setAverageDistricting(int averageDistricting) {
        this.averageDistricting = averageDistricting;
    }

    @Column(name = "extremeDistricting")
    public int getExtremeDistricting() {
        return this.extremeDistricting;
    }

    public void setExtremeDistricting(int extremeDistricting) {
        this.extremeDistricting = extremeDistricting;
    }

    @Column(name = "randomDistricting")
    public int getRandomDistricting() {
        return this.randomDistricting;
    }

    public void setRandomDistricting(int randomDistricting) {
        this.randomDistricting = randomDistricting;
    }

}
