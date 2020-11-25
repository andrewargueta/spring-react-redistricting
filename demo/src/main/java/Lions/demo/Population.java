package Lions.demo;

import java.util.*;
import Lions.demo.enums.*;

public class Population {
    private double totalPopulation;
    private double votingAgePopulation;
    private Map<MinorityGroup, Double> minorityVAPMap;

    public Population(double totPop, double totVap, double hispVap, double blkVap, double aianVap, double asianVap){
        this.totalPopulation = totPop;
        this.votingAgePopulation = totVap;
        minorityVAPMap = new HashMap<MinorityGroup, Double>();
        minorityVAPMap.put(MinorityGroup.AFRICAN, blkVap);
        minorityVAPMap.put(MinorityGroup.HISPANIC, hispVap);
        minorityVAPMap.put(MinorityGroup.NATIVE, aianVap);
        minorityVAPMap.put(MinorityGroup.ASIAN, asianVap);
    }

    public double getTotalPopulation() {
        return this.totalPopulation;
    }

    public void setTotalPopulation(double totalPopulation) {
        this.totalPopulation = totalPopulation;
    }

    public double getVotingAgePopulation() {
        return this.votingAgePopulation;
    }

    public void setVotingAgePopulation(double votingAgePopulation) {
        this.votingAgePopulation = votingAgePopulation;
    }

    public Map<MinorityGroup,Double> getMinorityVAPMap() {
        return this.minorityVAPMap;
    }

    public void setMinorityVAPMap(Map<MinorityGroup,Double> minorityVAPMap) {
        this.minorityVAPMap = minorityVAPMap;
    }
}
