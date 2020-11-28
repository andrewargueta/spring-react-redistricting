package Lions.demo.handlers;

import java.util.*;
import Lions.demo.*;
import Lions.demo.enums.*;
import Lions.demo.entity.*;

public class JobHandler {
    private List<Job> createdJobs;
    private int nextId;

    public JobHandler(){
        this.createdJobs = new ArrayList<Job>();
    }

    /**
     *  create the actual job class and store it in presistance layer
     * @param config user inputed fields to be injected and passed
     * @param location Location to run the algorithm
     * @return the jobId of the created job
     */
    public Job createJob(InputParam param, Location location, String stateName){
        int newJobId = 1;
        if(createdJobs.size() != 0){
            newJobId = createdJobs.get(createdJobs.size() - 1).getJobId() +1;
        }
        int numOfPlans = param.getNumOfPlans();
        // Compactness compactness = Compactness.VERYCOMPACT;
        // switch(param.getCompactness()){
        //     case "Somewhat Compact":
        //         compactness = Compactness.SOMEWHATCOMPACT;
        //         break;
        //     case "Compact":
        //         compactness = Compactness.COMPACT;
        //         break;
        // }
        double populationVariation = param.getPopulationVariation();
        List<MinorityGroup> minorityGroups = new ArrayList<MinorityGroup>();
        for(String s : param.getMinorityGroups()){
            switch(s){
                case "African-Americans":
                    minorityGroups.add(MinorityGroup.AFRICAN);
                    break;
                case "Asian Americans":
                    minorityGroups.add(MinorityGroup.ASIAN);
                    break;
                case "Hispanics":
                    minorityGroups.add(MinorityGroup.HISPANIC);
                    break;
                case "Native Americans":
                    minorityGroups.add(MinorityGroup.NATIVE);
                    break;
            }
        }
        Location runLoc = location;
        // Job newJob = new Job(stateName, newJobId, numOfPlans, compactness, populationVariation, minorityGroups, runLoc, Progress.WAITING);
        Job newJob = new Job(stateName, newJobId, numOfPlans, param.getCompactness(), populationVariation, minorityGroups, "Local", "Waiting");
        addJob(newJob);
        //persist job in em
        return newJob;
    }

    /**
     * add the job passed in to the list of created Jobs
     * @param job The created job 
     */
    public void addJob(Job job){
        createdJobs.add(job);
    }

    /**
     * fetch the job from the list of jobs matching the Id passed by user
     * @param jobId Id of the job clicked by the user
     * @return the job class with matching Id
     */
    public Job getJob(int jobId){
        for(Job j : createdJobs){
            if(j.getJobId() == jobId){
                return j;
            }
        }
        return null;
    }

    /**
     * delete the job from the presistance layer and from the list of jobs
     * @param jobId Id of the job clicked by the user
     */
    public void deleteJob(int jobId){
        for(int i =0; i < createdJobs.size(); i++){
            if(createdJobs.get(i).getJobId() == jobId){
                createdJobs.remove(i);
                break;
            }
        }
        //remove from em
    }

    public void updateStatus(int jobId, Progress status){

    }

    public void processResult(int jobId){

    }

    public List<Job> getCreatedJobs() {
        return this.createdJobs;
    }

    public void setCreatedJobs(List<Job> createdJobs) {
        this.createdJobs = createdJobs;
    }

    public int getNextId() {
        return this.nextId;
    }

    public void setNextId(int nextId) {
        this.nextId = nextId;
    }
}
