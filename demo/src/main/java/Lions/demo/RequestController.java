package Lions.demo;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostConstruct
    private void postConstruct() {
        try{
            FileInputStream ip= new FileInputStream("demo/src/main/resources/config.properties");
            prop.load(ip);
        }catch (Exception e) {
            e.printStackTrace();
        }
        
    }

    @PostMapping(value = "state/setState")
    public @ResponseBody Optional<State> getState(@RequestBody Map<String, String> map) {
        String stateName = map.get("name");
        System.out.println(stateName);
        Optional<State> temp = stateRepository.findById(stateName);
        State selectedState = temp.get();
        // System.out.println(selectedState.getName());
        System.out.println(selectedState.getPrecincts().get(0).getNeighbors());
        return stateRepository.findById(stateName);
        // return stateRepository.findAll();
    }

    public Location determineRunLocation(InputParam param){
        System.out.println("plan limit : " + Integer.parseInt(prop.getProperty("planLimit")));
        if(param.getNumOfPlans() < Integer.parseInt(prop.getProperty("planLimit"))){
            return Location.LOCAL;        
        }else{
            return Location.SEAWULF;
        }
    }

    @PostMapping(value = "job/runJob")
    public Job runJob(@RequestBody InputParam param){
        Location runLoc = determineRunLocation(param);
        // System.out.println(param.getNumOfPlans());
        // Location runLoc;
        // if(param.getServer().equals("Local")){
        //     runLoc = Location.LOCAL;
        // }else{
        //     runLoc = Location.SEAWULF;
        // }
        // System.out.println(param.getServer());
        System.out.println(runLoc);
        System.out.println(param.getState());
        Job job = jobHandler.createJob(param, runLoc, param.getState());
        State state = stateRepository.findById(param.getState()).get();
        List<Precinct> precincts = state.getPrecincts();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.setPrettyPrinting().create();
        // String JSONObject = gson.toJson(precincts);
        // try (FileWriter file = new FileWriter("demo/src/main/resources/static/test.json")) {
        //     file.write(JSONObject);
        //     file.flush();
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
        if(runLoc == Location.LOCAL){
            localHandler.runLocalJob(job.getJobId(), param, selectedState);
        }else{
            seaWulfHandler.runSeaWulfJob(job.getJobId(), param, selectedState);
        }
        return job;
    }

    @DeleteMapping(value = "/job/{Id}/cancel")
    public int cancelJob(@PathVariable int Id){
        System.out.println(Id);
        //cancel based on run location
        jobHandler.deleteJob(Id);
        return Id;
    }
    
    public List<Job> getAllJobs(){
        return null;
    }

    @GetMapping(value = "/job/{Id}")
    public int getJob(@PathVariable int Id){
        System.out.println(Id);
        Job job = jobHandler.getJob(Id);
        return job.getJobId();
    }

    @DeleteMapping(value = "/job/{Id}/delete")
    public int deleteJob(@PathVariable int Id){
        System.out.println(Id);
        jobHandler.deleteJob(Id);
        return Id;
    }

    public List<PlotData> getPlotDatas(int jobId){
        return null;
    }

    public void processResult(String json){

    }

    public List<Progress> getStatus(List<Integer> jobIds){
        return null;
    }

    public void getHeatMap(List<MinorityGroup> minGroups){
        
    }
}
