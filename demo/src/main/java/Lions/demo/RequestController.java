package Lions.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.PostConstruct;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.util.*;
import java.io.*;
import Lions.demo.enums.*;
import Lions.demo.handlers.*;
import Lions.demo.repository.*;
import Lions.demo.entity.*;

@CrossOrigin(origins = "http://localhost:4000")
@RestController
public class RequestController {
    private JobHandler jobHandler = new JobHandler();
    private LocalHandler localHandler = new LocalHandler();
    private SeaWulfHandler seaWulfHandler = new SeaWulfHandler();
    private Properties prop = new Properties();
    private static State selectedState;

    @Autowired
    private PrecinctRepository precinctRepository;
    @Autowired
    private CongressionalRepository congressionalRepository;
    @Autowired
    private StateRepository stateRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private BoxAndWhiskerRepository boxAndWhiskerRepository;
    // @Autowired
    // private DistrictingRepository districtingRepository;

    @PostConstruct
    private void postConstruct() {
        try{
            FileInputStream ip= new FileInputStream("demo/src/main/resources/config.properties");
            prop.load(ip);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping(value = "job/previous-jobs")
    public @ResponseBody Iterable<Job> getPreviousJobs(){
        Iterable<Job> jobs = jobRepository.findAll();
        List<Job> temp = new ArrayList<>();
        for(Job j: jobs){
            temp.add(j);
        }
        Collections.sort(temp, (a,b) -> a.getJobId() - b.getJobId());
        for(Job j : temp){
            jobHandler.addJob(j);
        }
        return jobs;
    }

    @PostMapping(value = "state/set-state")
    public @ResponseBody Optional<State> getState(@RequestBody Map<String, String> input) {
        String stateName = input.get("name");
        System.out.println(stateName);
        Iterable<Job> jobs = jobRepository.findAll();
        System.out.println(jobs.toString());
        return stateRepository.findById(stateName);
    }

    public Location determineRunLocation(InputParam param){
        System.out.println("plan limit : " + Integer.parseInt(prop.getProperty("planLimit")));
        if(param.getNumOfPlans() < Integer.parseInt(prop.getProperty("planLimit"))){
            return Location.LOCAL;        
        }else{
            return Location.SEAWULF;
        }
    }

    @PostMapping(value = "job/run-job")
    public Job runJob(@RequestBody InputParam param){
        Location runLoc = determineRunLocation(param);
        System.out.println(runLoc);
        System.out.println(param.getState());
        Job job = jobHandler.createJob(param, runLoc, param.getState());
        State state = stateRepository.findById(param.getState()).get();
        List<Precinct> precincts = state.getPrecincts();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.setPrettyPrinting().create();
        String JSONObject = gson.toJson(precincts);
        // try (FileWriter file = new FileWriter("demo/src/main/resources/static/texas.json")) {
        //     file.write(JSONObject);
        //     file.flush();
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
        if(runLoc == Location.LOCAL){
            localHandler.runLocalJob(job.getJobId(), param, selectedState, JSONObject);
            String path = "demo/src/main/resources/static/result_" + param.getState() + ".json";
            job.processGraph(path, precincts);
            jobHandler.updateStatus(job.getJobId(), "Completed");
        }else{
            seaWulfHandler.runSeaWulfJob(job.getJobId(), param, selectedState);
        }
        return job;
    }
    
    public List<Job> getAllJobs(){
        return null;
    }

    @GetMapping(value = "/job/{id}/averageDistricting")
    public List<District> getAverageDistricting(@PathVariable int id){
        System.out.println(id);
        Job job = jobRepository.findById(id).get();
        String districtingId = job.getAverageDistricting();
        System.out.println(districtingId);
        List<District> districting = districtRepository.findByDistrictingId(districtingId);
        System.out.println(districting.size());
        return districting;
    }

    @GetMapping(value = "/job/{id}/extremeDistricting")
    public List<District> getExtremeDistricting(@PathVariable int id){
        System.out.println(id);
        Job job = jobRepository.findById(id).get();
        String districtingId = job.getExtremeDistricting();
        List<District> districting = districtRepository.findByDistrictingId(districtingId);
        return districting;
    }

    @GetMapping(value = "/job/{id}/randomDistricting")
    public List<District> getRandomDistricting(@PathVariable int id){
        System.out.println(id);
        Job job = jobRepository.findById(id).get();
        String districtingId = job.getRandomDistricting();
        List<District> districting = districtRepository.findByDistrictingId(districtingId);
        return districting;
    }

    @GetMapping(value = "/job/{id}")
    public List<BoxAndWhisker> getJob(@PathVariable int id){
        System.out.println(id);
        List<BoxAndWhisker> jobBoxAndWhiskers = boxAndWhiskerRepository.findByJobId(id);
        Collections.sort(jobBoxAndWhiskers, (a,b)-> a.getMedian().compareTo(b.getMedian()));
        System.out.println(jobBoxAndWhiskers.size());
        return jobBoxAndWhiskers;
    }

    @DeleteMapping(value = "/job/{id}/delete")
    @Transactional
    public int deleteJob(@PathVariable int id){
        System.out.println(id);
        jobHandler.deleteJob(id);
        boxAndWhiskerRepository.deleteByJobId(id);
        districtRepository.deleteByJobId(id);
        return id;
    }

    @DeleteMapping(value = "/job/{id}/cancel")
    @Transactional
    public int cancelJob(@PathVariable int id){
        System.out.println(id);
        //cancel based on run location
        jobHandler.deleteJob(id);
        //test function for non updated job history
        boxAndWhiskerRepository.deleteByJobId(id);
        districtRepository.deleteByJobId(id);
        return id;
    }
}
