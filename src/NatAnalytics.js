import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';
import { Scatter, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './NatAnalytics.css'; // Import CSS file for additional styling
import { BarElement } from 'chart.js';
import Plot from 'react-plotly.js'; // Import Plotly for React

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

const NatAnalytics = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsCollection = collection(db, 'NAT');
        const recordSnapshot = await getDocs(recordsCollection);
        const recordList = recordSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecords(recordList);
      } catch (error) {
        console.error('Error fetching records: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);
  const iqMapping = {
    high: 1,
    low: 2,
    average: 3
  };

  const socioEconMapping = {
    'below poverty line': 'Below Poverty Line',
    'above poverty line': 'Above Poverty Line',
    'on poverty line': 'On Poverty Line',
  };

  const studyMap={
    excellent:1,
    good:2,
    poor:3

    
  };
  const schoolMap={
    private:1,
    public:2
    
  };
  const academic_des={
    outstanding :1,
    satisfactory: 2,
    didnotmeetexpectation:3,
    fairlysatisfactory:4,
    verysatisfactory:5
  };
  // Prepare the data for the scatter plots
  const recordList = {
    datasets: [
      {
        label: 'Academic Performance vs Age',
        data: records.map(item => ({
          x: item.age,
          y: item.academic_perfromance
        })),
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        pointStyle: 'triangle', 
        pointRadius: 5 
      },
      {
        label: 'Age vs IQ',
        data: records.map(item => ({
            x: item.age,
          y: iqMapping[item.IQ.toLowerCase()] || 0
        })),
        backgroundColor: 'rgba(255,99,132,1)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        pointStyle: 'circle', 
        pointRadius: 5 
      },
      {
        label: 'Type of School vs NAT Results',
        data: records.map(item => ({
           
          
          y: schoolMap[item.type_school.toLowerCase()] || 0,
          x: item.NAT_Results
        })),
        backgroundColor: 'rgba(255,223,0,1)', 
        borderColor: 'rgba(255,165,0,1)',    
        borderWidth: 1,
        pointStyle: 'star', 
        pointRadius: 5 
      },
      {
        label: ' Study Habit Vs NAT Results',
        data: records.map(item => ({
            x: studyMap[item.Study_Habit.toLowerCase()] || 0,
            y: item.NAT_Results
        
        })),
        backgroundColor: 'rgba(255,223,0,1)', 
        borderColor: 'rgba(255,165,0,1)',     
        borderWidth: 1,
        pointStyle: 'cross', 
        pointRadius: 5 
      }
      ,
      {
        label: 'Academic Performance vs NAT Result',
        data: records.map(item => ({
            x: item.academic_perfromance,
          y: item.NAT_Results
        })),
        backgroundColor: 'rgba(255,223,0,1)', 
        borderColor: 'rgba(255,165,0,1)',     
        borderWidth: 1,
        pointStyle: 'crossRot', 
        pointRadius: 5 
      }
      ,
      {
        label: 'Academic Description vs NAT Result',
        data: records.map(item => ({
            x: academic_des[item.adamemic_description.toLowerCase().replace(/\s+/g, '')
            ] || 0,

          y: item.NAT_Results
        })),
        backgroundColor: 'rgba(255,223,0,1)', 
        borderColor: 'rgba(255,165,0,1)',     
        borderWidth: 1,
        pointStyle: 'rect',
        pointRadius: 5 
      }
      ,
      {
        label: 'Age vs NAT Results with School Type and IQ',
        data: records.map(item => ({
          x: item.age,
          y: item.NAT_Results,
          r: (iqMapping[item.IQ.toLowerCase()] || 1) * 3 
        })),
        backgroundColor: records.map(item =>
          schoolMap[item.type_school.toLowerCase()] === 1 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(255, 99, 132, 0.7)'
        ), 
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1
      }
      
    ]
  };

  // Prepare the data for the histogram
  const natResults = records.map((item) => item.NAT_Results || 0); 
  const histogramData = {
    labels: Array.from(new Set(natResults)).sort((a, b) => a - b), 
    datasets: [
      {
        label: 'NAT Results Distribution',
        data: natResults.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {}),
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare the options for the histogram
  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Optional: Hide legend for a cleaner look
      },
      title: {
        display: true,
        text: 'Distribution of NAT Results',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'NAT Results',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  };

  const iqAcademicData = {
    datasets: [
      {
        label: 'IQ vs Academic Performance',
        data: records.map(item => ({
          x: iqMapping[item.IQ.toLowerCase()] || 0, // Map IQ to numeric value
          y: item.academic_perfromance || 0, // Academic performance
        })),
        backgroundColor: 'rgba(75, 192, 192, 1)', // Set point color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointStyle: 'circle', // Use circle for points
        pointRadius: 5,
      },
    ],
  };

    // Options to ensure the x-axis uses categorical labels
    const iqAcademicOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'IQ vs Academic Performance',
        },
      },
      scales: {
        x: {
          type: 'category', // Use category for x-axis
          labels: ['High', 'Low', 'Average'], // Define custom labels for the x-axis
          title: {
            display: true,
            text: 'IQ Level',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Academic Performance',
          },
        },
      },
    };
  

   // Check if socio_economic_status exists and map correctly
   const mapSocioEconStatus = (status) => {
    if (!status) return 'Unknown'; 
    const lowerCaseStatus = status.toLowerCase();
    return socioEconMapping[lowerCaseStatus] || 'Unknown'; 
  };

  // Prepare data for Violin Plot (Study Habit vs Socio-economic Status)
  const studyHabitData = {
    type: 'violin',
    x: records.map((item) => mapSocioEconStatus(item.socio_economic_status)), 
    y: records.map((item) => item.Study_Habit || 0), 
    box: { visible: true }, 
    line: { color: 'Yellow' }, 
    marker: { color: 'rgba(75, 192, 192, 0.6)' }, 
    name: 'Study Habit',
    scalemode: 'count',
  };


  const academicPerformanceData = {
    type: 'violin',
    x: records.map((item) => mapSocioEconStatus(item.socio_economic_status)), 
    y: records.map((item) => item.academic_perfromance || 0),
    box: { visible: true }, 
    line: { color: 'purple' }, 
    marker: { color: 'rgba(153, 102, 255, 0.6)' },
    name: 'Academic Performance',
    scalemode: 'count',
  };

  // Combine the data for both violin plots
  const plotData = [studyHabitData, academicPerformanceData];

  // Layout for the violin plot
  const layout = {
    title: 'Violin Plot: Study Habit & Academic Performance by Socio-economic Status',
    xaxis: {
      title: 'Socio-economic Status',
      type: 'category',
      tickvals: ['Below Poverty Line', 'Above Poverty Line', 'On Poverty Line'],
      ticktext: ['Below Poverty Line', 'Above Poverty Line', 'On Poverty Line'],
    },
    yaxis: {
      title: 'Value',
    },
    showlegend: true,
  };

  return (
    <div className="nat-analytics-container">
      <h2 className="page-title">Dashboard</h2>
   

      {loading ? (
        <div className="loader">Loading...</div> 
      ) : (
        
        <div className="chart-container">
           
         <div className="item_1"> <Scatter   data={recordList} />
         </div>
        
         <div className="item_2">
            <Bar data={histogramData} options={histogramOptions} /> {}
          </div>

          <div className="item_3">  <Scatter data={iqAcademicData} options={iqAcademicOptions} />
          </div> 

          <div className="item_4"> <Plot data={plotData} layout={layout} />
         </div>
        </div>
        
        
        
      )}
    </div>
  );
};

export default NatAnalytics;
