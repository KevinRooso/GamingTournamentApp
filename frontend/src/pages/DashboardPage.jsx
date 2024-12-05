import React from "react";
import withAuth from "../guards/Authguard"

const Dashboard = () => {
    return(
        <div className="container">
            <h1>Dashboard</h1>
        </div>
    )
}

export default withAuth(Dashboard);