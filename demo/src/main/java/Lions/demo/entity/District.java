package Lions.demo.entity;

import java.util.*;
import Lions.demo.enums.*;

public class District {
    private int districtId;
    private List<Precinct> precincts;
    private int counites;
    private Double percentVotingAge;

    public int getDistrictId() {
        return this.districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }

    public List<Precinct> getPrecincts() {
        return this.precincts;
    }

    public void setPrecincts(List<Precinct> precincts) {
        this.precincts = precincts;
    }

    public int getCounites() {
        return this.counites;
    }

    public void setCounites(int counites) {
        this.counites = counites;
    }

    public Double getPercentVotingAge() {
        return this.percentVotingAge;
    }

    public void setPercentVotingAge(Double percentVotingAge) {
        this.percentVotingAge = percentVotingAge;
    }

    /**
     * @return The number of distinct counties in the precincts
     */
    public int calculateCounties(){
        return 0;
    }

    // /**
    //  * for each precinct sum up the values for a population class for this district
    //  * @param minGroups the user select minority groups
    //  * @return a population class containing information from all precincts
    //  */
    // public Population calculatePopulation(List<MinorityGroup> minGroups){
    //     return null;
    // }
}
