package Lions.demo.handlers;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Component;

import Lions.demo.*;
import Lions.demo.enums.*;
import Lions.demo.repository.JobRepository;
import Lions.demo.entity.*;

@Component
public class JobHandler {
    private List<Job> createdJobs;
    private int nextId;

    public JobHandler(){
        this.createdJobs = new ArrayList<Job>();
    }

    public Job createJob(InputParam param, Location location, String stateName){
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistence");
        EntityManager em = emf.createEntityManager();

        int newJobId = 1;
        if(createdJobs.size() != 0){
            newJobId = createdJobs.get(createdJobs.size() - 1).getJobId() +1;
        }
        int numOfPlans = param.getNumOfPlans();
        double populationVariation = param.getPopulationVariation();
        List<MinorityGroup> minorityGroups = new ArrayList<MinorityGroup>();
        String miniorityGroupString = "";
        for(String s : param.getMinorityGroups()){
            miniorityGroupString += s +" ";
        }
        Location runLoc = location;
        System.out.println(newJobId);
        Job newJob = new Job(stateName, newJobId, numOfPlans, param.getCompactness(), populationVariation, miniorityGroupString, "Local", "Waiting");
        addJob(newJob);
        em.getTransaction().begin();
        em.persist(newJob);
        em.getTransaction().commit();
        //persist job in em
        em.close();
        return newJob;
    }

    public void addJob(Job job){
        createdJobs.add(job);
    }

    public Job getJob(int jobId){
        for(Job j : createdJobs){
            if(j.getJobId() == jobId){
                return j;
            }
        }
        return null;
    }

    public void deleteJob(int jobId){
        for(int i =0; i < createdJobs.size(); i++){
            if(createdJobs.get(i).getJobId() == jobId){
                createdJobs.remove(i);
                break;
            }
        }
        //remove from em
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistence");
        EntityManager em = emf.createEntityManager();
        Job job = em.find(Job.class, jobId);
        em.getTransaction().begin();
        em.remove(job);
        em.getTransaction().commit();
        em.close();
    }

    public void updateStatus(int jobId, String status){
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistence");
        EntityManager em = emf.createEntityManager();
        Job job = em.find(Job.class, jobId);
        em.getTransaction().begin();
        job.setStatus(status);
        em.getTransaction().commit();
        em.close();
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
