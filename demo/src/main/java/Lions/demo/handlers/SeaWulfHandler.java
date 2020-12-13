package Lions.demo.handlers;

import Lions.demo.enums.*;

import java.io.*;

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

    private void printProcessOutput(Process process) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }
            String result = builder.toString();
            System.out.println(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * run the job on the seawulf after sending appropriate files
     * @param jobId -> jobId for the job created for the run
     * @param config -> JSON/string with the injected params from the user
     */
    public void runSeaWulfJob(int jobId, InputParam config, State selectedState){
        System.out.println("Seawulf Run");
        try {
            ProcessBuilder pb = new ProcessBuilder("bash", "demo/src/main/resources/runSeawulf.sh", String.valueOf(jobId), String.valueOf(config.getNumOfPlans()), String.valueOf(config.getPopulationVariation()), String.valueOf(config.getState()));
            pb.redirectErrorStream(true);
            Process process = pb.start();
            printProcessOutput(process);
        } catch (IOException e) {
            e.printStackTrace();
        }
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
        System.out.println("CANCEL");
        try {
            ProcessBuilder pb = new ProcessBuilder("bash", "demo/src/main/resources/cancelSeawulf.sh", String.valueOf(jobId));
            pb.redirectErrorStream(true);
            Process process = pb.start();
            printProcessOutput(process);
        } catch (IOException e) {
            e.printStackTrace();
        }
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
