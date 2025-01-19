import { useEffect, useState } from "react";
import { getApi } from "services/api"; // Ensure this is imported
import KPICard from "./components/KPICard"; // Import KPICard
import ABCBankLogo from '../../../assets/img/BankABCLogo.jpg';
import XYZBankLogo from '../../../assets/img/XYZBANK.webp';
import GlobalBlankLogo from '../../../assets/img/globalBank.jpg';
import ABCWalletLogo from '../../../assets/img/ABCWallet.png';
import QuickPayLogo from '../../../assets/img/quickpay.png';
import FlashWalletLogo from '../../../assets/img/flashwallet.webp';


const bankLogos = {
  "101": XYZBankLogo,
  "102": ABCBankLogo,
  "103": GlobalBlankLogo,
  "501": ABCWalletLogo,
  "502": QuickPayLogo,
  "503": FlashWalletLogo
  };
const UserDashboard = () => {
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [mostUsedService, setMostUsedService] = useState(null);
  const [highestEntryPerson, setHighestEntryPerson] = useState(null);
  const [error, setError] = useState(null);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  useEffect(() => {
    fetchAnalytics();
    fetchServices();
  }, []);


  const fetchServices = async () => {
    try {
      const response = await getApi('api/services');
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
      console.error(err);
    }
  };
  const fetchAnalytics = async () => {
    try {
      const monthlyResponse = await getApi('api/services/analytics/monthly');
      const weeklyResponse = await getApi('api/services/analytics/weekly');
      const mostUsedResponse = await getApi('api/services/analytics/most-used');
      const entryStatsResponse = await getApi('api/services/stats'); 

      setMonthlyReport(monthlyResponse.data);
      setWeeklyReport(weeklyResponse.data);
    
      setMostUsedService(mostUsedResponse.data); 
      setHighestEntryPerson(entryStatsResponse.data); 
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="flex  gap-4">

      {/* Most Used Service */}
      {mostUsedService && (
        <KPICard
          title="Most Used Service"
          value={mostUsedService.serviceDetails?.name}
          trend={mostUsedService.count}
          subtitle="Entries"
          metric={`Total Entries: ${mostUsedService.count}`}
          isPositive={mostUsedService.count > 0}
          additionalDetails={[
            { icon: null, text: `Service ID: ${mostUsedService._id}` },
            { icon: null, text: `Service Name: ${mostUsedService?.serviceDetails?.name}` }
          ]}
        />
      )}

      {/* Weekly Report Insights */}
      {weeklyReport.length > 0 && (
        <KPICard
          title="Weekly Report"
          value={weeklyReport.reduce((acc, curr) => acc + curr.count, 0) || 0}
          trend={weeklyReport.length > 0 ? (weeklyReport[weeklyReport.length - 1].count - weeklyReport[0].count) / weeklyReport[0].count * 100 : 0}
          subtitle="Total Entries This Week"
          metric={`Entries: ${weeklyReport.length}`}
          isPositive={weeklyReport.length > 0}
          additionalDetails={weeklyReport.map(data => ({
            icon: null, 
            text: `Week ${data._id}: ${data.count} entries`
          }))}
        />
      )}

      {monthlyReport.length > 0 && (
        <KPICard
          title="Monthly Report"
          value={monthlyReport.reduce((acc, curr) => acc + curr.count, 0) || 0}
          trend={monthlyReport.length > 0 ? (monthlyReport[monthlyReport.length - 1].count - monthlyReport[0].count) / monthlyReport[0].count * 100 : 0}
          subtitle="Total Entries This Month"
          metric={`Entries: ${monthlyReport.length}`}
          isPositive={monthlyReport.length > 0}
          additionalDetails={monthlyReport.map(data => ({
            icon: null, 
            text: `Month ${data._id}: ${data.count} entries`
          }))}
        />
      )}
      </div>

      {highestEntryPerson && (
        <KPICard
          title="Person with Highest Entries"
          value={highestEntryPerson.name}
          trend={highestEntryPerson.totalEntries}
          subtitle="Total Entries"
          metric={`Total Entries: ${highestEntryPerson.totalEntries}`}
          isPositive={highestEntryPerson.totalEntries > 0}
          additionalDetails={[
            { icon: null, text: `Person ID: ${highestEntryPerson._id}` },
            { icon: null, text: `Name: ${highestEntryPerson.name}` }
          ]}
        />
      )}

<div>
      <div className=" gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-8">Select Your Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full">
                {services?.map(service => (
                  <div
                    key={service.id}
                    // onClick={() => {
                    //   setSelectedService(service);
                    //   setFormData({});
                    // }}
                    className={`p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105
                      ${selectedService?.id === service.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'}`}
                  >
                    <img
                      src={bankLogos[service.id]}
                      alt={service.name}
                      className="h-full w-full object-contain  rounded-md mb-2 mx-auto"
                    />
                    <h3 className="text-lg font-semibold -mt-2 text-center">{service.name}</h3>
                  </div>
                ))}
              </div>
            </div>

          </div>
      </div>

    </div>
  );
};

export default UserDashboard;