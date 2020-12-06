import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

let config={};

config.layout = {
    // autosize: true,
    height: 600,
    width: 800,
    yaxis: {
      title: 'Voting Age Population',
      zeroline: false
    },
    xaxis: {
      title: 'Districts',
      zeroline: false
    },
    boxmode: 'group'
};

class BocWhisker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plotData:{},
            // trace1: {
            //     y: [0, 0, 0, 0],
            //     x: ['1', '1', '1', '1'],
            //     name: 'Orginal',
            //     marker: {color: '#3D9970'},
            //     type: 'box'
            // },
            trace2: this.props.trace2?this.props.trace2:{
                y: this.props.plotData[0]?[this.props.plotData[0].min,this.props.plotData[0].q1,
                    this.props.plotData[0].median,this.props.plotData[0].q3, this.props.plotData[0].max]: [0,0,0,0,0] ,/*min  ?? ?? max*/
                x: ['1', '1', '1', '1', '1'],
                name: 'New',
                marker: {color: '#FF4136'},
                type: 'box'
            },
            
        };
        
      }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.plotData);
        if(prevProps.plotData !== this.props.plotData){
            this.setState({trace2: this.props.plotData});
        }    
      }


    render() {
        // var trace1= this.state.trace1;
        var trace2 = this.state.trace2;
        return (
                <Plot
                    data={[
                        // trace1,
                        trace2,
                    ]}
                    layout={config.layout}
                />
        );
    }
}

export default BocWhisker;