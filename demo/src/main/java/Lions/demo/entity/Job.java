package Lions.demo.entity;

import Lions.demo.*;
import java.util.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Persistence;
import javax.persistence.Table;

import java.io.FileReader;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import Lions.demo.enums.*;

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
    private String minDistricting;
    private String maxDistricting;
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
        this.minDistricting = "";
        this.maxDistricting = "";
        this.minorityGroups = minorityGroups;
        this.minorities = minorityGroups.split(" ");
        this.districtings = new ArrayList<>();
    }

    public Job(){
        
    }

    public void processGraph(String path, List<Precinct> precincts){
        EntityManagerFactory emfJob = Persistence.createEntityManagerFactory("Lions.demo.entity.Job");
        EntityManagerFactory emfDistrict = Persistence.createEntityManagerFactory("Lions.demo.entity.District");
        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(new FileReader(path));
            // Object obj = parser.parse(new FileReader("demo/src/main/resources/static/test.json"));
            JSONObject jsonObject = (JSONObject)obj;
            for(int i =0; i < numberOfPlans; i++){
                String districtingKey = jobId +"_"+i;
                Districting newDistricting = new Districting(districtingKey, jobId);
                JSONObject districtingJson = (JSONObject)jsonObject.get(districtingKey);
                Set<String> keys = districtingJson.keySet();
                for(String districtKey : keys){
                    District newDistrict = new District(districtKey, districtingKey, jobId);
                    List<String> precinctsJson = (List<String>)districtingJson.get(districtKey);
                    Set<String> counties = new HashSet<>();
                    for(String precinctId : precinctsJson){
                        Precinct precinct = findPrecinct(precincts, precinctId);
                        counties.add(precinct.getCounty());
                        newDistrict.addPrecinct(precinct);
                        newDistrict.addPrecinctIds(precinctId);
                    }
                    newDistrict.setCounties(counties.size());
                    calculateDistrictVap(newDistrict, precincts);
                    persistDistrict(newDistrict, emfDistrict);
                    newDistricting.addDistrict(newDistrict);
                }
                newDistricting.findMedian();
                districtings.add(newDistricting);
            }
            sortDistrictings();
            averageDistricting = districtings.get(districtings.size()/2).getDistrictingId();
            minDistricting = districtings.get(0).getDistrictingId();
            maxDistricting = districtings.get(districtings.size()-1).getDistrictingId();
            int randindex = new Random().nextInt(districtings.size());
            randomDistricting = districtings.get(randindex).getDistrictingId();
            generateBoxAndWhisker();
            persistJobDistricting(emfJob);
         } catch(Exception e) {
            e.printStackTrace();
         }
         emfDistrict.close();
         emfJob.close();
    }

    public void generateBoxAndWhisker(){
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("Lions.demo.entity.BoxAndWhisker");
        for(Districting d : this.districtings){
            d.sortDistricts();
        }
        int numDistricts = this.districtings.get(0).getDistricts().size();
        for(int i =0; i < numDistricts; i++){
            ArrayList<Double> temp = new ArrayList<>();
            for(Districting d : this.districtings){
                temp.add(d.getDistricts().get(i).getVotingAgePercent());
            }
            Collections.sort(temp);
            Double min = temp.get(0);
            Double q1 = temp.get(temp.size()/4);
            Double median = temp.get(temp.size()/2);
            Double q3 = temp.get((temp.size()*3) / 4);
            Double max = temp.get(temp.size()-1);
            BoxAndWhisker boxAndWhisker = new BoxAndWhisker(min, q1, median, q3, max, jobId +"_"+ (i+1), jobId);
            persistBoxAndWhisker(boxAndWhisker, emf);
        }
        emf.close();
    }

    public void persistBoxAndWhisker(BoxAndWhisker boxAndWhisker, EntityManagerFactory emf){
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(boxAndWhisker);
        em.getTransaction().commit();
        em.close();
    }

    public void persistJobDistricting(EntityManagerFactory emf){
        EntityManager em = emf.createEntityManager();
        Job job = em.find(Job.class, jobId);
        em.getTransaction().begin();
        job.setAverageDistricting(this.averageDistricting);
        job.setMinDistricting(this.minDistricting);
        job.setMaxDistricting(this.maxDistricting);
        job.setRandomDistricting(this.randomDistricting); 
        em.getTransaction().commit();
        em.close();
    }

    public void persistDistrict(District d, EntityManagerFactory emf){
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(d);
        em.getTransaction().commit();
        em.close();
    }

    public Precinct findPrecinct(List<Precinct> precincts, String precinctId){
        for(Precinct p : precincts){
            if(p.getGeoId().equals(precinctId)){
                return p;
            }
        }
        return null;
    }

    public void sortDistrictings(){
        Collections.sort(districtings, (a,b) -> a.getMedian().compareTo(b.getMedian()));
    }

    public void calculateDistrictVap(District newDistrict, List<Precinct> precincts){
        double sumVap = 0;
        double totVap = 0;
        double hispVap = 0;
        double blackVap = 0;
        double aianVap = 0;
        double asianVap = 0;
        for(Precinct precinct : newDistrict.findPrecincts()){
            // Precinct precinct = findPrecinct(precincts, precinctId);
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

    public Districting findDistrictings(String districtingId){
        for(Districting d : districtings){
            if(d.getDistrictingId().equals(districtingId)){
                return d;
            }
        }
        return null;
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

    @Column(name = "minDistricting")
    public String getMinDistricting() {
        return this.minDistricting;
    }

    public void setMinDistricting(String minDistricting) {
        this.minDistricting = minDistricting;
    }

    @Column(name = "maxDistricting")
    public String getMaxDistricting() {
        return this.maxDistricting;
    }

    public void setMaxDistricting(String maxDistricting) {
        this.maxDistricting = maxDistricting;
    }    

    @Column(name = "randomDistricting")
    public String getRandomDistricting() {
        return this.randomDistricting;
    }

    public void setRandomDistricting(String randomDistricting) {
        this.randomDistricting = randomDistricting;
    }
}
