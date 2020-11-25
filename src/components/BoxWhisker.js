import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

let config={};

config.layout = {
    // autosize: true,
    height: 400,
    width: 600,
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
            x: ['1', '1', '1', '1', '2', '2', '2', '2', '3', '3', '3', '3', '4', '4', '4', '4'],
            trace1: {
                y: [0.2, 0.2, 0.5, 0.1, 0.5, 0.4, 0.2, 0.7, 0.9, 0.8, 0.7, 1.2, 1.1, 1.5, 1.9, 1.3],
                x: ['1', '1', '1', '1', '2', '2', '2', '2', '3', '3', '3', '3', '4', '4', '4', '4'],
                name: 'Orginal',
                marker: {color: '#3D9970'},
                type: 'box'
            },
            trace2: {
                y: [0.5, 0.7, 0.9, 1.0, 0.6, 0.8, 0.9, 1.1, 0.9, 0.8, 0.7, 1.0, 1.3, 1.2, 1.6, 1.3],
                x: ['1', '1', '1', '1', '2', '2', '2', '2', '3', '3', '3', '3', '4', '4', '4', '4'],
                name: 'New',
                marker: {color: '#FF4136'},
                type: 'box'
            },
            
        };
        
      }


    render() {
        var trace1= this.state.trace1;
        var trace2 = this.state.trace2;
        return (
                <Plot
                    data={[
                        trace1,
                        trace2,
                    ]}
                    layout={config.layout}
                />
        );
    }
}

export default BocWhisker;