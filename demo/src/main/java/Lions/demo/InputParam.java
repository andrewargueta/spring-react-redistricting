package Lions.demo;

import java.util.*;

public class InputParam {
    private String state;
    private int numOfPlans;
    private String server;
    private List<String> minorityGroups;
    private String compactness;
    private double populationVariation;

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }


    public int getNumOfPlans() {
        return this.numOfPlans;
    }

    public void setNumOfPlans(int numOfPlans) {
        this.numOfPlans = numOfPlans;
    }

    public String getServer() {
        return this.server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public List<String> getMinorityGroups() {
        return this.minorityGroups;
    }

    public void setMinorityGroups(List<String> minorityGroups) {
        this.minorityGroups = minorityGroups;
    }

    public String getCompactness() {
        return this.compactness;
    }

    public void setCompactness(String compactness) {
        this.compactness = compactness;
    }

    public double getPopulationVariation() {
        return this.populationVariation;
    }

    public void setPopulationVariation(double populationVariation) {
        this.populationVariation = populationVariation;
    }
}
