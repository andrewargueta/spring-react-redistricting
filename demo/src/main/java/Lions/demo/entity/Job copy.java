// package Lions.demo.entity;

// import Lions.demo.*;
// import java.util.*;

// import javax.persistence.Column;
// import javax.persistence.Entity;
// import javax.persistence.GeneratedValue;
// import javax.persistence.Id;
// import javax.persistence.Table;

// import Lions.demo.enums.*;

// // @Entity
// // @Table(name = "job")
// public class Job {
//     private List<Districting> districtings;
//     private int averageDistricting;
//     private int extremeDistricting;

//     private int jobId;
//     private String stateName;
//     private int numberOfPlans;
//     private Compactness compactness;
//     private double populationThreshold;
//     private List<MinorityGroup> minorityGroups;
//     private Location runLocation;
    
//     private Progress status;

//     public Job(String stateName, int newJobId, int numOfPlans, Compactness compactness, double populationVariation, List<MinorityGroup> minorityGroups, Location runLoc, Progress status){
//         this.stateName = stateName;
//         this.jobId = newJobId;
//         this.numberOfPlans = numOfPlans;
//         this.compactness = compactness;
//         this.populationThreshold = populationVariation;
//         this.minorityGroups = minorityGroups;
//         this.runLocation = runLoc;
//         this.status = status;
//         this.districtings = null;
//         this.averageDistricting = -1;
//         this.extremeDistricting = -1;
//     }

//     /**
//      * takes the graph returned by algorithim and process it
//      * generating all the district and districting classes
//      */
//     public void processGraph(){

//     }

//     /**
//      * find the average districting form the list of districtings generated from the graph
//      * @param l list of the voting age populations from each districting
//      * @return districting with average voting age popluation average
//      */
//     public Districting calculateAverage(List<List<Double>> l){
//         return null;
//     }

//     public void setAverageDistricting(){

//     }

//     /**
//      * find an extreme districting from the list of districtings
//      * @return extreme districting
//      */
//     public Districting calculateExtreme(){
//         return null;
//     }

//     public void setExtremeDistricting(){

//     }

//     /**
//      * select a districting from the list of districtings at random
//      * @return random districting
//      */
//     public Districting getRandom(){
//         return null;
//     }

//     /**
//      * @return List of plotdata from each districting
//      */
//     public List<PlotData> getPlotDatas(){
//         return null;
//     }

//     /**
//      * when processing the graphs, add a districting to  the distrincts once it is generted from a graph
//      * @param d district to append
//      */
//     public void appendDistricting(Districting d){

//     }

//     /**
//      * @return JSON of the generated summary (TA provIded)
//      */
//     public String generateSummary(){
//         return null;
//     }

//     public List<Districting> getDistrictings() {
//         return this.districtings;
//     }

//     public void setDistrictings(List<Districting> districtings) {
//         this.districtings = districtings;
//     }

//     public int getAverageDistricting() {
//         return this.averageDistricting;
//     }


//     public int getExtremeDistricting() {
//         return this.extremeDistricting;
//     }

//     // @Id
//     // @GeneratedValue
//     // @Column(name = "Id")
//     public int getJobId() {
//         return this.jobId;
//     }

//     public void setJobId(int jobId) {
//         this.jobId = jobId;
//     }

//     // @Column(name = "state_name")
//     public String getStateName() {
//         return this.stateName;
//     }

//     public void setStateName(String stateName) {
//         this.stateName = stateName;
//     }

//     // @Column(name = "plans")
//     public int getNumberOfPlans() {
//         return this.numberOfPlans;
//     }

//     public void setNumberOfPlans(int numberOfPlans) {
//         this.numberOfPlans = numberOfPlans;
//     }

//     // @Column(name = "compactness")
//     public Compactness getCompactness() {
//         return this.compactness;
//     }

//     public void setCompactness(Compactness compactness) {
//         this.compactness = compactness;
//     }

//     // @Column(name = "population_threshold")
//     public double getPopulationThreshold() {
//         return this.populationThreshold;
//     }

//     public void setPopulationThreshold(double populationThreshold) {
//         this.populationThreshold = populationThreshold;
//     }

//     public List<MinorityGroup> getMinorityGroups() {
//         return this.minorityGroups;
//     }

//     public void setMinorityGroups(List<MinorityGroup> minorityGroups) {
//         this.minorityGroups = minorityGroups;
//     }

//     public Location getRunLocation() {
//         return this.runLocation;
//     }

//     public void setRunLocation(Location runLocation) {
//         this.runLocation = runLocation;
//     }

//     public Progress getStatus() {
//         return this.status;
//     }

//     public void setStatus(Progress status) {
//         this.status = status;
//     }
// }
