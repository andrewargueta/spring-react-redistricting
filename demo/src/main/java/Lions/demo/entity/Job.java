package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import java.io.FileReader;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import Lions.demo.enums.*;
import Lions.demo.repository.PrecinctRepository;

@Entity
@Table(name = "Jobs")
public class Job {
    private int jobId;
    private String stateName;
    private int numberOfPlans;
    private String compactness;
    private double populationThreshold;
    private String runLocation;
    private String status;
    private String minorityGroups;
    private String[] minorities;
    private List<Districting> districtings;
    private String averageDistricting;
    private String extremeDistricting;
    private String randomDistricting;

    public Job(String stateName, int newJobId, int numOfPlans, String compactness, double populationVariation, String minorityGroups, String runLoc, String status){
        this.stateName = stateName;
        this.jobId = newJobId;
        this.numberOfPlans = numOfPlans;
        this.compactness = compactness;
        this.populationThreshold = populationVariation;
        this.runLocation = runLoc;
        this.status = status;
        this.averageDistricting = "";
        this.extremeDistricting = "";
        this.minorityGroups = minorityGroups;
        this.minorities = minorityGroups.split(" ");
        this.districtings = new ArrayList<>();
    }

    public Job(){
        
    }

    public void processGraph(String path, PrecinctRepository precinctRepo){
        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(new FileReader(path));
            // Object obj = parser.parse(new FileReader("demo/src/main/resources/static/test.json"));
            JSONObject jsonObject = (JSONObject)obj;
            for(int i =0; i < numberOfPlans; i++){
                String districtingKey = jobId +"_"+i;
                Districting newDistricting = new Districting(districtingKey);
                //persist districting
                JSONObject districtingJson = (JSONObject)jsonObject.get(districtingKey);
                Set<String> keys = districtingJson.keySet();
                for(String districtKey : keys){
                    District newDistrict = new District(districtKey, districtingKey);
                    List<String> precincts = (List<String>)districtingJson.get(districtKey);
                    HashSet<String> counties = new HashSet<>();
                    for(String precinctId : precincts){
                        Precinct precinct = precinctRepo.findById(precinctId).get();
                        counties.add(precinct.getCounty());
                        newDistrict.addPrecinct(precinctId);
                    }
                    newDistrict.setCounties(counties.size());
                    calculateDistrictVap(newDistrict, precinctRepo);
                    newDistricting.addDistrict(newDistrict);
                }
                newDistricting.generateBoxAndWhisker();
                districtings.add(newDistricting);
            }
            System.out.println(districtings.size());
            sortDistrictings();
            averageDistricting = districtings.get(districtings.size()/2).getDistrictingId();
            extremeDistricting = districtings.get(0).getDistrictingId();
            int randindex = new Random().nextInt(districtings.size());
            randomDistricting = districtings.get(randindex).getDistrictingId();
         } catch(Exception e) {
            e.printStackTrace();
         }
    }

    public void sortDistrictings(){
        // Collections.sort(districtings, (a,b) -> a.getVotingAgePercent().compareTo(b.getVotingAgePercent()));
        Collections.sort(districtings, (a,b) -> a.getBoxAndWhisker().getMedian().compareTo(b.getBoxAndWhisker().getMedian()));
    }

    public void calculateDistrictVap(District newDistrict, PrecinctRepository precinctRepo){
        double sumVap = 0;
        double totVap = 0;
        double hispVap = 0;
        double blackVap = 0;
        double aianVap = 0;
        double asianVap = 0;
        for(String precinctId : newDistrict.getPrecincts()){
            Precinct precinct = precinctRepo.findById(precinctId).get();
            totVap += precinct.getTotVap();
            hispVap += precinct.getHispVap();
            blackVap += precinct.getBlackVap();
            aianVap += precinct.getAianVap();
            asianVap += precinct.getAsianVap();
        }
        for(String minority : minorities){
            switch(minority) {
                case "hisp":
                    sumVap += hispVap;
                    break;
                case "black":
                    sumVap += blackVap;
                    break;
                case "asian":
                    sumVap += asianVap;
                    break;
                case "aian":
                    sumVap += aianVap;
                    break;
              }
        }
        newDistrict.setVotingAgePercent(sumVap/totVap);
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
    public String getAverageDistricting() {
        return this.averageDistricting;
    }

    public void setAverageDistricting(String averageDistricting) {
        this.averageDistricting = averageDistricting;
    }

    @Column(name = "extremeDistricting")
    public String getExtremeDistricting() {
        return this.extremeDistricting;
    }

    public void setExtremeDistricting(String extremeDistricting) {
        this.extremeDistricting = extremeDistricting;
    }

    @Column(name = "randomDistricting")
    public String getRandomDistricting() {
        return this.randomDistricting;
    }

    public void setRandomDistricting(String randomDistricting) {
        this.randomDistricting = randomDistricting;
    }
}
