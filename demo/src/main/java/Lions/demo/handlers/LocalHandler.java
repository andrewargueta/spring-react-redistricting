package Lions.demo.handlers;

import java.io.*;

import Lions.demo.enums.*;
import Lions.demo.*;
import Lions.demo.entity.*;

public class LocalHandler {

    public LocalHandler(){
        
    }

    /**
     * run the job on the local sever after sending appropriate files
     * @param jobId -> jobId for the job created for the run
     * @param config -> JSON/string with the injected params from the user
     */
    public void runLocalJob(int jobId, InputParam config, State selectedState, String JSONObject){
        try {
            System.out.println("here");
            ProcessBuilder pb = new ProcessBuilder("C:/Users/Spriors/AppData/Local/Programs/Python/Python39/python.exe", "demo/src/main/resources/algorithm.py", "demo/src/main/resources/static/mississippi.json", String.valueOf(config.getPopulationVariation()), config.getState());
            pb.redirectErrorStream(true);
            Process process = pb.start();
            printProcessOutput(process);
        } catch (IOException e) {
            e.printStackTrace();
        }
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
     * @param jobId Id passed client for all created batches
     * @return progress of the job on the seawulf
     */
    public Progress checkStatus(int jobId){
        return null;
    }

    /**
     * cancel the job on the local server conresponding to the jobId passed from the user
     * @param jobId Id of the job 
     */
    public void cancelLocalJob(int jobId){

    }

    public void processResult(String json){

    }
}
