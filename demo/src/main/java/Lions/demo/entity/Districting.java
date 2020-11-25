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
    private int districtingId;
    private List<District> districts;
    private PlotData plotData;

    /**
     * sort the districts based on VAP for each district
     */
    public void sortDistricts(){
        Collections.sort(districts, (a,b) -> a.getPercentVotingAge().compareTo(b.getPercentVotingAge()));
    }

    /**
     * @return PlotData class using the list of districts 
     */
    public PlotData generatePlotData(){
        return null;
    }

    /**
     * @return list of the voting age populations from all the districts
     */
    public List<Double> getVotingAgePopulation(){
        return null;
    }

    // @Id
    // @Column(name = "districtingId")
    public int getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(int districtingId) {
        this.districtingId = districtingId;
    }

    public List<District> getDistricts() {
        return this.districts;
    }

    public void setDistricts(List<District> districts) {
        this.districts = districts;
    }

    public PlotData getPlotData() {
        return this.plotData;
    }

    public void setPlotData(PlotData plotData) {
        this.plotData = plotData;
    }
}
