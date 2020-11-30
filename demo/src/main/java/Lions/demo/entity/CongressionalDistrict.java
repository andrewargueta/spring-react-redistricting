package Lions.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CongressionalDistricts")
public class CongressionalDistrict {
    private int districtNum;
    private String coordinates;

    public CongressionalDistrict(){
        
    }

    @Id
    @Column(name = "districtNum")
    public int getDistrictNum() {
        return this.districtNum;
    }

    public void setDistrictNum(int districtNum) {
        this.districtNum = districtNum;
    }

    @Column(name = "coordinates")
    public String getCoordinates() {
        return this.coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

}
