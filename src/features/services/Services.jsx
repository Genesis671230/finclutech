import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart } from 'react-chartjs-2';
import { format } from 'date-fns';
import { getApi, postApi } from "services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ABCBankLogo from '../../assets/img/BankABCLogo.jpg';
import XYZBankLogo from '../../assets/img/XYZBANK.webp';
import GlobalBlankLogo from '../../assets/img/globalBank.jpg';
import ABCWalletLogo from '../../assets/img/ABCWallet.png';
import QuickPayLogo from '../../assets/img/quickpay.png';
import FlashWalletLogo from '../../assets/img/flashwallet.webp';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const bankLogos = {
  "101": XYZBankLogo,
  "102": ABCBankLogo,
  "103": GlobalBlankLogo,
  "501": ABCWalletLogo,
  "502": QuickPayLogo,
  "503": FlashWalletLogo
  };

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterService, setFilterService] = useState('');
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [mostUsedService, setMostUsedService] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchStats();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchServiceEntries();
    }
  }, [selectedService, currentPage, sortField, sortOrder,filterService]);

  const fetchServices = async () => {
    try {
      const response = await getApi('api/services');
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const customerId = JSON.parse(localStorage.getItem("user"));
      const response = await getApi(`api/services/stats`);
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch stats');
      console.error(err);
    }
  };
  const fetchServiceEntries = async () => {
    try {
      setIsLoading(true);
      const response = await getApi(
        `api/services/${selectedService.id}/entries?page=${currentPage}&sortBy=${sortField}&order=${sortOrder}`
      );
      console.log(response,"response");
      setEntries(response.data.entries);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to fetch entries');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentPage(1);
    setFormData({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedService) return;

    // Validate form data against selected service's required fields
    const isValid = selectedService.required_fields.every(field => {
      // if (field.required) {
        return formData[field.name] && new RegExp(field.validation).test(formData[field.name]);
      // }
      // return true; // If not required, skip validation
    });

    if (!isValid) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    try {
      setIsLoading(true);
      const customerId = JSON.parse(localStorage.getItem("user"));
      console.log(customerId,"customerId");
      const response = await postApi(`api/services/${selectedService.id}/entries`, {
        data: formData,
        customerId: customerId._id,
        timestamp: new Date().toISOString(),
        serviceId: selectedService?._id
      });
      const latestEntries = entries?.length > 0 ? [response.data, ...entries] : [response.data];
      setEntries(latestEntries);

      // Refresh entries after submission
      fetchServiceEntries();
      setFormData({});
      
    } catch (err) {
      setError('Failed to submit form');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'option':
        return (
          <select
            name={field.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              [field.name]: e.target.value
            }))}
            value={formData[field.name] || ''}
            required
            className="w-full bg-white/5 border-2 border-purple-500/30 rounded-xl py-3 px-4 text-white
              placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50
              transition-all duration-300"
          >
            <option value="">{field.placeholder.en}</option>
            {field.options?.map(option => (
              <option key={option.name} value={option.name}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              [field.name]: e.target.value
            }))}
            value={formData[field.name] || ''}
            required
            className="w-full bg-white/5 border-2 border-purple-500/30 rounded-xl py-3 px-4 text-white
              placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50
              transition-all duration-300"
          />
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder.en}
            maxLength={field.max_length > 0 ? field.max_length : undefined}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              [field.name]: e.target.value
            }))}
            value={formData[field.name] || ''}
            required
            pattern={field.validation}
            className="w-full bg-white/5 border-2 border-purple-500/30 rounded-xl py-3 px-4 text-white
              placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50
              transition-all duration-300"
          />
        );
    }
  };

  const fetchAnalytics = async () => {
    try {
      const monthlyResponse = await getApi('api/services/analytics/monthly');
      const weeklyResponse = await getApi('api/services/analytics/weekly');
      const mostUsedResponse = await getApi('api/services/analytics/most-used');
      
      // setMonthlyReport(monthlyResponse.data);
      // setWeeklyReport(weeklyResponse.data);
      // setMostUsedService(mostUsedResponse.data);
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Premium Banking Services
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience seamless banking with our cutting-edge digital services platform
          </p>
        </motion.div>

        {/* Service Selection Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-8">Select Your Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services?.map(service => (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setFormData({});
                    }}
                    className={`p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105
                      ${selectedService?.id === service.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'}`}
                  >
                    <img
                      src={bankLogos[service.id]}
                      alt={service.name}
                      className="h-[10rem] w-[10rem] object-contain mb-2 mx-auto"
                    />
                    <h3 className="text-lg font-semibold -mt-2 text-center">{service.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Logo Display */}
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center"
              >
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <img
                    src={bankLogos[selectedService.id]}
                    alt={selectedService.name}
                    className="h-32 object-contain filter brightness-150"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Dynamic Form */}
          <AnimatePresence mode="wait">
            {selectedService && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="mt-12 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedService?.required_fields?.map(field => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-300">
                        {field.label.en}
                        <span className="text-xs text-gray-400 ml-2">({field.label.ar})</span>
                      </label>
                      {renderField(field)}
                      {formData[field.name] && field.validation && !new RegExp(field.validation).test(formData[field.name]) && (
                        <p className="text-red-400 text-sm mt-1">
                          {field.validation_error_message.en}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      px-8 py-4 rounded-xl text-white font-medium text-lg
                      transition-all duration-300 transform hover:scale-105
                      ${isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      }
                      shadow-lg hover:shadow-purple-500/25
                    `}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Submit'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      

    
      </div>
    </div>
  );
};

export default Services;