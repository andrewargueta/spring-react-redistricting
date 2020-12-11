package Lions.demo.entity;

public class JobSummary {
    private int jobId;
    private String stateName;
    private int numberOfPlans;
    private String compactness;
    private double populationThreshold;
    private String runLocation;
    private String status;
    private String minorityGroups;
    private String[] minorities;
    private Districting averageDistricting;
    private Districting minDistricting;
    private Districting maxDistricting;
    private Districting randomDistricting;

    public JobSummary(Job job){
        this.stateName = job.getStateName();
        this.jobId = job.getJobId();
        this.numberOfPlans = job.getNumberOfPlans();
        this.compactness = job.getCompactness();
        this.populationThreshold = job.getPopulationThreshold();
        this.runLocation = job.getRunLocation();
        this.status = job.getStatus();
        this.minorityGroups = job.getMinorityGroups();
        this.minorities = this.minorityGroups.split(" ");
        this.averageDistricting = job.findDistrictings(job.getAverageDistricting());
        this.minDistricting = job.findDistrictings(job.getMinDistricting());
        this.maxDistricting = job.findDistrictings(job.getMaxDistricting());
    }
}
