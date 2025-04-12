"use client"

import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { ImageIcon, Upload, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStep } from '../StepContext';

const OrganizationSetup = () => {
    const router = useRouter();
    const { setCurrentStep } = useStep();
    const [logo, setLogo] = useState(null);
    const [organizationName, setOrganizationName] = useState('');
    const [industry, setIndustry] = useState('');
    const [organizationSize, setOrganizationSize] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [agreedToPolicy, setAgreedToPolicy] = useState(false);
    const [formError, setFormError] = useState('');
    
    // Additional fields for expanded details
    const [website, setWebsite] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateProvince, setStateProvince] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    const handleLogoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setLogo(event.target.files[0]);
        }
    };

    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleSubmit = () => {
        // Reset error message
        setFormError('');

        // Validate required fields
        if (!organizationName.trim()) {
            setFormError('Please enter your organization name');
            return;
        }

        if (!agreedToPolicy) {
            setFormError('Please agree to the privacy policy and terms of service');
            return;
        }

        // If validation passes, save data and navigate
        console.log({
            organizationName,
            industry,
            organizationSize,
            logo,
            // Include additional details if shown
            ...(showDetails && {
                website,
                phoneNumber,
                address: {
                    street: streetAddress,
                    city,
                    stateProvince,
                    zipCode,
                    country
                }
            }),
            agreedToPolicy
        });

        // Navigate to connection page
        router.push('/components/FirstTimeSetUp/ConnectionSetup');
        setCurrentStep(1); // Move to Connection step
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="rounded-lg shadow-lg w-full max-w-3xl bg-white">
                {/* Header with blue background */}
                <div className="bg-blue-600 rounded-t-lg p-6">
                    <h1 className="text-2xl font-bold mb-2 text-center text-white">
                        Tell us about your organization
                    </h1>
                    <p className="text-base text-center text-white opacity-90">
                        We'll customize your analytics experience based on this information.
                    </p>
                </div>

                {/* Main content with white background */}
                <div className="p-8">
                    {/* Logo Section */}
                    <div className="mb-8">
                        <label className="text-base font-medium mb-2 block">Organization Logo</label>
                        <p className="text-sm text-gray-500 mb-4">Optional, but recommended</p>
                        
                        <div className="flex items-center space-x-6">
                            {/* Logo Preview Area */}
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                {logo ? (
                                    <img 
                                        src={URL.createObjectURL(logo)} 
                                        alt="Organization Logo" 
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-400">Add logo</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Button */}
                            <div className="flex-1">
                                <Button
                                    variant="outline"
                                    className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                                    onClick={() => document.getElementById('logo-upload').click()}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Logo</span>
                                </Button>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Required Information</h2>
                    </div>

                    {/* Organization Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label className="text-base font-medium mb-1 block">
                                Organization Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                                placeholder="Enter your organization name"
                            />
                        </div>

                        <div>
                            <label className="text-base font-medium mb-1 block">Industry</label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="">Select Industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Non-profit">Non-profit</option>
                                <option value="Retail">Retail</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-base font-medium mb-1 block">Organization Size</label>
                            <select
                                value={organizationSize}
                                onChange={(e) => setOrganizationSize(e.target.value)}
                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501+">501+ employees</option>
                            </select>
                        </div>
                    </div>

                    {/* Toggle Additional Details Button */}
                    <Button
                        variant="outline"
                        className="text-blue-600 hover:text-blue-800 px-3 py-1.5 border-blue-200 hover:border-blue-400 rounded-md transition-colors font-medium"
                        onClick={handleToggleDetails}
                    >
                        {showDetails ? 'Hide' : 'Show'} additional details
                    </Button>

                    {/* Additional Details Section */}
                    {showDetails && (
                        <div className="mt-6 mb-6 space-y-6 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-base font-medium mb-1 block">Website</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                            https://
                                        </span>
                                        <input
                                            type="text"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="border border-gray-300 rounded-r-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="www.example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-base font-medium mb-1 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-medium">Address Information</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-base font-medium mb-1 block">Street Address</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value)}
                                            className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="123 Main St"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-base font-medium mb-1 block">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-base font-medium mb-1 block">State / Province</label>
                                            <input
                                                type="text"
                                                value={stateProvince}
                                                onChange={(e) => setStateProvince(e.target.value)}
                                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="State"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-base font-medium mb-1 block">ZIP / Postal Code</label>
                                            <input
                                                type="text"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Postal Code"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-base font-medium mb-1 block">Country</label>
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                            <option value="JP">Japan</option>
                                            <option value="IN">India</option>
                                            <option value="BR">Brazil</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms and Agreement */}
                    <div className="mt-6">
                        <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToPolicy}
                                onChange={() => setAgreedToPolicy(!agreedToPolicy)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                required
                            />
                            <span className="text-sm">
                                I agree to the <a href="#" className="text-blue-600 hover:underline">privacy policy</a> and <a href="#" className="text-blue-600 hover:underline">terms of service</a> <span className="text-red-500">*</span>
                            </span>
                        </label>
                    </div>

                    {/* Error message */}
                    {formError && (
                        <div className="mt-4 text-red-500 text-sm font-medium">
                            {formError}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        <Button 
                            onClick={handleBack} 
                            variant="outline"
                            className="px-4 py-2 border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-4 h-4" /> 
                            <span>Back</span>
                        </Button>
                        
                        <Button 
                            onClick={handleSubmit} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!organizationName.trim() || !agreedToPolicy}
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrganizationSetup;