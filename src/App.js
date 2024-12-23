
import './App.css';
import React, { useState } from "react";
import AddResData from './AddData';
import Nav from './Nav';
import ViewRecords from './ViewRecords';
import NatAnalytics from './NatAnalytics';
const appStyles = {
  backgroundColor: '#f8f9fa', 
  minHeight: '100vh', 
  padding: '20px', 
  fontFamily: 'Arial, sans-serif',   
};

const App = () => {
  const [activeTab, setActiveTab] = useState("viewRecords");

  return (
    <div style={appStyles}>
      <Nav setActiveTab={setActiveTab} />

      {activeTab === "addRecord" && <AddResData />}
      {activeTab === "viewRecords" && <ViewRecords />} {/* Add ViewRecords tab */}
      {activeTab==="viewAnalytics"&& <NatAnalytics/>}
    </div>
  );
};

export default App;
