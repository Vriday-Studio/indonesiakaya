import React, { useEffect, useState } from "react";
import { getTodayServerFromStartNovember } from "../../lib/firebase/todayServer";
import ApexCharts from "react-apexcharts";

const Dashboard = () => {
    const today = new Date();
    today.setUTCDate(today.getUTCDate() - 7);
    today.setUTCHours(0, 0, 0, 0); 
    const sevenDaysAgo = today.toISOString();
    
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [type, setType] = useState("user-login");

    const optionsLine = {
        chart: {
            type: "bar",
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        yaxis: {
            min: 0,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setHours(23, 59, 59, 999);

                const countTitle = {
                    artwork: "scan",
                    "user-login": "login",
                };

                const dataTodayServer = await getTodayServerFromStartNovember(adjustedEndDate.toISOString(), startDate);
                const mappedData = dataTodayServer.map((item) => {
                    const date = new Date(item.date);
                    const countItem = item.count[countTitle[type]] ? item.count[countTitle[type]] : 0;
                    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
                    return [utcDate, countItem];
                });
                setData(mappedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [startDate, endDate, type]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const tableTitle = {
        artwork: "Artwork Scan",
        "user-login": "User Login",
    };

    return (
        <div className="p-10">
            <h1 className="text-xl font-bold mb-4">Dashboard</h1>
            <div className="mb-4 flex flex-wrap gap-4">
                <div>
                    <label htmlFor="type" className="block mb-2">
                        Type
                    </label>
                    <select id="type" className="input input-bordered w-full" value={type} onChange={handleTypeChange}>
                        <option value="artwork">Artwork</option>
                        <option value="user-login">User Login</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="startDate" className="block mb-2">
                        Start Date
                    </label>
                    <input type="date" id="startDate" value={startDate.split("T")[0]} onChange={handleStartDateChange} className="input input-bordered" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block mb-2">
                        End Date
                    </label>
                    <input type="date" id="endDate" value={endDate.split("T")[0]} onChange={handleEndDateChange} className="input input-bordered" />
                </div>
            </div>

            <h1 className="text-center font-bold text-xl">{tableTitle[type]} Count per Day</h1>
            <ApexCharts
                options={{
                    ...optionsLine,
                    xaxis: {
                        min: new Date(startDate).getTime(),
                        max: new Date(endDate).getTime(),
                        type: "datetime",
                        tickAmount: 30,
                    },
                }}
                series={[
                    {
                        name: "User Login Count",
                        data: data,
                    },
                ]}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default Dashboard;
