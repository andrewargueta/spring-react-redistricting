package Lions.demo.handlers;

import Lions.demo.enums.*;
import Lions.demo.*;
import Lions.demo.entity.*;

public class SeaWulfHandler {

    public SeaWulfHandler(){
        
    }

    /**
     * pass all data required to run algorithm to the seawulf shared folder
     * @param path to seawulf shared folder
     */
    public void passData(String path){

    }

    /**
     * package and send the script for the seawulf to run
     * @param scriptPath location of the python script
     */
    public void packageAndSend(String scriptPath){

    }

    /**
     * run the job on the seawulf after sending appropriate files
     * @param jobId -> jobId for the job created for the run
     * @param config -> JSON/string with the injected params from the user
     */
    public void runSeaWulfJob(int jobId, InputParam config, State selectedState){

    }

    /**
     * @param jobId Id passed client for all created batches
     * @return progress of the job on the seawulf
     */
    public Progress checkStatus(int jobId){
        return null;
    }

    /**
     * cancel the job on the seawulf conresponding to the jobId passed from the user
     * @param jobId Id of the job 
     */
    public void cancelSeaWulfJob(int jobId){

    }

    /**
     * fetch the results (graph) from the seawulf
     * @param path to the shared folder where the result of the algorithm is stored
     */
    public void fetchResult(String path){

    }

    public void processResult(String json){

    }
}
