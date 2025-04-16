import React, { useEffect,useState } from "react";
import withAuth from "../guards/Authguard"
import { fetchMatchList } from "../services/MatchService";
import { useAuth } from "../guards/AuthContext";
import Chart from "react-apexcharts";

import "../styles/DashboardStyle.css"

const Dashboard = () => {
    const { userData } = useAuth();
    const [matches, setMatches] = useState([]);
    const [chart, setChart] = useState({ options: {}, series: [] });
    const [matchScoresChart, setMatchScoresChart] = useState({ options: {}, series: [] });
    const [winLossChart, setWinLossChart] = useState({ options: {}, series: [] });

    useEffect(()=>{
        fetchMatches()
    },[])

    const fetchMatches = async() => {
        const response = await fetchMatchList()
        if(response.data){
            setMatches(response.data)
            createDashboardChart(response.data);
        }
    }

    const createDashboardChart = (matches) => {
       // Player wins count
       const playerWins = {};
       matches.forEach((match) => {
           const winner = match.winner.username;
           playerWins[winner] = playerWins[winner] ? playerWins[winner] + 1 : 1;
       });

       // Create data for Player Wins chart
       const players = Object.keys(playerWins);
       const wins = players.map((player) => playerWins[player]);

       // Match Scores Comparison for Player 1 and Player 2
       const matchScores = matches.map((match) => ({
           score_player1: match.score_player1,
           score_player2: match.score_player2,
           match_date: new Date(match.match_date).toLocaleDateString(),
       }));

       // Tournament Win/Loss Ratio
       const tournamentStats = {};
       matches.forEach((match) => {
           const tournamentName = match.tournament.name;
           if (!tournamentStats[tournamentName]) {
               tournamentStats[tournamentName] = { wins: 0, losses: 0 };
           }
           if (match.winner.username === match.player1.username) {
               tournamentStats[tournamentName].wins += 1;
           } else {
               tournamentStats[tournamentName].losses += 1;
           }
       });

       // Create Pie chart data for Win/Loss Ratio by Tournament
       const tournaments = Object.keys(tournamentStats);
       const winLossData = tournaments.map((tournament) => ({
           name: tournament,
           data: [
               tournamentStats[tournament].wins,
               tournamentStats[tournament].losses,
           ],
       }));

       // Bar Chart options and series
       setChart({
           options: {
               chart: {
                   id: "player-wins",
                   type: "bar",
                   height: 350,
               },
               xaxis: {
                   categories: players,
               },
               title: {
                   text: "Player Wins",
                   align: "center",
                   style: {
                       fontSize: '20px',
                       fontWeight: 'bold',
                   },
               },
               colors: ['#00E396', '#FF4560'],
               dataLabels: {
                   enabled: true,
               },
           },
           series: [
               {
                   name: "Wins",
                   data: wins,
               },
           ],
       });

       // Bar Chart for Match Scores
       setMatchScoresChart({
        options: {
            chart: {
                id: "match-scores",
                type: "area", // Change the chart type to "area"
                height: 350,
            },
            title: {
                text: "Match Scores",
                align: "center",
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                },
            },
            xaxis: {
                categories: matchScores.map((score) => score.match_date),
                type: 'datetime', // This ensures that the x-axis is based on date-time values
                labels: {
                    formatter: function (value) {
                        const date = new Date(value);
                        const options = { day: '2-digit', month: 'short'};
                        return date.toLocaleDateString('en-GB', options); // en-GB gives you dd MMM yyyy
                    }
                },
                tickAmount: 7,
            },
            dataLabels: {
                enabled: false, // Disables data labels for a cleaner look
            },
            stroke: {
                curve: 'smooth', // Smooth line strokes for a more polished look
            },
            fill: {
                type: "gradient", // Set the fill type to gradient
                gradient: {
                    shadeIntensity: 1, // Gradient intensity
                    opacityFrom: 0.7, // Starting opacity of the gradient
                    opacityTo: 0.9, // Ending opacity of the gradient
                    stops: [0, 90, 100], // Define gradient stops
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                x: {
                    format: 'dd/MM/yy HH:mm' // e.g., "14/12/24 16:30"
                }
            }
        },
        series: [
            {
                name: "Player 1 Score",
                data: matchScores.map((score) => score.score_player1),
            },
            {
                name: "Player 2 Score",
                data: matchScores.map((score) => score.score_player2),
            },
        ],
    });    
    
     
    };

    return(
        <div className="container">
            <h1>Dashboard</h1>
            <div className="scrollable-container">
                <div className="chart">                    
                    <Chart
                        options={chart.options}
                        series={chart.series}
                        type="bar"
                        width="500"
                    />
                </div>
                <div className="chart">                    
                    <Chart
                        options={matchScoresChart.options}
                        series={matchScoresChart.series}
                        type="area"
                        width="500"
                    />
                </div>              
            </div>
        </div>
    )
}

export default withAuth(Dashboard);