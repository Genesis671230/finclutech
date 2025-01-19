import { constant } from 'constant';
import React, { useEffect, useState } from 'react';

const EmployeeOfTheMonth = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${constant.baseUrl}/api/lead/employee-of-the-month`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const employee = data[0]; // Assuming the endpoint returns an array with one object
                    console.log('Employee data:', employee); // Log the employee data
                    setEmployeeData(employee);
                } else {
                    throw new Error('No Employee of the Month data available');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!employeeData) {
        return <div>Loading...</div>;
    }

    const { employee, totalLeads, totalBudget } = employeeData;
    const employeeName = employee.name;
    const profilePictureArray = employee.profilePicture;
    const profilePicture = profilePictureArray && profilePictureArray[0]; // Assuming the profilePicture array contains at least one URL

    // Replace backslashes with forward slashes in the profile picture URL
    const formattedProfilePicture = profilePicture?.replace(/\\/g, '/');
    const profilePictureURL = `http://127.0.0.1:5001/${formattedProfilePicture}`;

    console.log('Profile Picture URL:', profilePictureURL); // Log the profile picture URL

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {profilePicture && (
                <div style={{ marginLeft: '6px' }}>
                    <img src={profilePictureURL} alt={`${employeeName}'s profile`} style={{ width: '90px', height: '90px', borderRadius: '50%' }} />
                </div>
            )}
            <div style={{ flex: 1, marginLeft: '6px' }}>

                <p>Name: {employeeName}</p>
                <p>Total Leads: {totalLeads}</p>
                <p>Total Budget: {totalBudget}</p>
            </div>

        </div>
    );
};

export default EmployeeOfTheMonth;
