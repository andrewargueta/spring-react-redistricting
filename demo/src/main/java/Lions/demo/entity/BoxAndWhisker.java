package Lions.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="BoxAndWhiskers")
public class BoxAndWhisker {
    private String districtingId;
    private Double median;
    private Double q1;
    private Double q3;
    private Double min;
    private Double max;
    private int jobId;

    public BoxAndWhisker(double median, double q1, double q3, double min, double max, String districtingId, int jobId) {
        this.median = median;
        this.q1 = q1;
        this.q3 = q3;
        this.min = min;
        this.max = max;
        this.districtingId = districtingId;
        this.jobId = jobId;
    }

    public BoxAndWhisker(){
        
    }

    @Id
    @Column(name="districtingId")
    public String getDistrictingId() {
        return this.districtingId;
    }

    public void setDistrictingId(String districtingId) {
        this.districtingId = districtingId;
    }

    @Column(name="median")
    public Double getMedian() {
        return this.median;
    }

    public void setMedian(Double median) {
        this.median = median;
    }

    @Column(name="q1")
    public Double getQ1() {
        return this.q1;
    }

    public void setQ1(Double q1) {
        this.q1 = q1;
    }

    @Column(name="q3")
    public Double getQ3() {
        return this.q3;
    }

    public void setQ3(Double q3) {
        this.q3 = q3;
    }

    @Column(name="min")
    public Double getMin() {
        return this.min;
    }

    public void setMin(Double min) {
        this.min = min;
    }

    @Column(name="max")
    public Double getMax() {
        return this.max;
    }

    public void setMax(Double max) {
        this.max = max;
    }

    @Column(name="jobId")
    public int getJobId() {
        return this.jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

}
