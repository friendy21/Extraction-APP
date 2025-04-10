"use client"

import { useState } from "react";
import Button from "@/components/ui/button";
import { 
  CheckCircle2, 
  BarChart2, 
  Users,
  Shield,
  ArrowRight,
  Monitor,
  Mail, 
  MessageSquare, 
  Video, 
  Archive
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/organization');
  };

  return (
    <main className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Welcome to Glynac
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Gain powerful insights into your workplace dynamics and improve collaboration with Glynac's advanced analytics platform.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Connect to your workplace platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Discover valuable communication patterns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Protect employee privacy with advanced anonymization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Make data-driven decisions with confidence</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md flex items-center gap-2"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-md"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-center mb-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md w-full"
                  >
                    Set up your analytics dashboard in minutes
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Data Insights</span>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Team Collaboration</span>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-2 mb-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">Privacy Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* Platform Integration Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-gray-700 text-lg mb-8">
            Connects with your favorite workplace platforms
          </h2>
          <div className="flex justify-between items-center gap-6">
            {/* Microsoft 365 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="w-10 h-10">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                  <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                  <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                  <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                </svg>
              </div>
            </div>
            
            {/* Google Workspace */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 92" className="w-10 h-10">
                  <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                  <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                </svg>
              </div>
            </div>
            
            {/* Slack */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8" className="w-10 h-10">
                  <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"/>
                  <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"/>
                  <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"/>
                  <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"/>
                </svg>
              </div>
            </div>
            
            {/* Zoom */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 145" className="w-10 h-10">
                  <path d="M 219.348 54.785 C 219.348 42.652 219.348 30.521 219.348 18.39 C 245.176 18.442 271.002 18.442 296.83 18.39 C 296.766 30.521 296.766 42.652 296.83 54.785 C 271.002 54.838 245.176 54.838 219.348 54.785 Z" fill="#4a8cff"/>
                  <path d="M 219.348 61.692 C 245.176 61.692 271.002 61.692 296.83 61.692 C 296.83 85.818 296.83 109.943 296.83 134.068 C 270.938 134.068 245.048 134.068 219.156 134.068 C 219.194 134.054 219.181 134.026 219.156 134.021 C 219.156 109.909 219.156 85.8 219.156 61.692 C 219.22 61.692 219.284 61.692 219.348 61.692 Z" fill="#4a8cff"/>
                  <path d="m 80.468 18.39 c 12.996 -0.109 25.993 -0.012 38.99 -0.048 c 0.224 0.024 0.275 0.148 0.288 0.336 c 0.013 38.755 0.013 77.508 0 116.261 c -0.013 0.186 -0.064 0.312 -0.288 0.336 c -12.997 -0.035 -25.994 0.061 -38.99 -0.048 c -22.834 -0.872 -42.77 -20.471 -42.274 -45.077 C 38.67 68.051 56.62 48.828 80.468 45.844 c 0 -9.154 0 -18.308 0 -27.454 z" fill="#4a8cff"/>
                  <path d="m 426.1 18.39 c 1.839 0.01 3.678 0.01 5.517 0 c 0.095 0.109 0.224 0.148 0.385 0.145 c 15.002 0.013 30.004 0.008 45.006 0.003 c 10.211 0.199 19.253 7.465 21.738 17.39 c 1.242 4.463 1.22 9.176 0.032 13.645 c -1.951 8.655 -9.255 15.701 -17.989 17.101 c 2.636 0.753 5.173 1.972 7.45 3.443 c 7.351 4.71 12.234 13.343 12.214 22.109 c 0.228 10.632 -5.485 20.728 -14.708 25.657 c -5.648 3.087 -12.042 4.306 -18.404 4.188 c -13.472 0.02 -26.942 0.005 -40.413 0.008 c -0.109 -0.01 -0.22 -0.017 -0.33 -0.024 c -0.002 -34.557 -0.002 -69.114 0 -103.67 c 0.011 -0.002 0.024 -0.002 0.035 -0.003 l -0.532 0.008 z m 21.707 40.333 c 7.318 -0.003 14.636 0.005 21.956 -0.003 c 4.093 0.226 8.11 -2.176 9.552 -6.055 c 1.525 -3.498 0.694 -7.834 -1.996 -10.525 c -2.294 -2.522 -5.761 -3.548 -9.096 -3.52 c -6.805 0.011 -13.611 -0.003 -20.416 0.008 c 0 6.699 0 13.396 0 20.095 z m 0 42.988 c 8.467 -0.019 16.936 0.016 25.403 -0.016 c 4.584 0.037 9.023 -2.834 10.526 -7.158 c 1.741 -4.571 0.291 -10.072 -3.371 -13.202 c -2.544 -2.345 -6.046 -3.317 -9.404 -3.16 c -7.718 0.016 -15.434 -0.002 -23.153 0.011 c -0.002 7.841 -0.002 15.682 0 23.524 z" fill="#4a8cff"/>
                  <path d="m 141.823 45.68 c 14.669 -3.379 30.835 -0.57 43.241 8.323 c 16.123 11.254 25.315 32.429 21.691 52.003 c -2.96 17.679 -15.129 33.114 -31.683 40.138 c -17.384 7.701 -38.437 5.081 -53.411 -6.692 c -17.119 -13.001 -25.388 -36.286 -19.756 -57.068 c 4.537 -18.433 19.317 -33.507 37.686 -38.335 c 0.745 0.602 1.49 1.205 2.234 1.807 c 0.01 3.988 0.005 7.976 0.003 11.964 c -12.506 3.534 -22.03 16.329 -21.175 29.511 c 0.165 12.944 9.881 24.69 22.562 27.489 c 11.008 2.699 23.078 -1.505 29.859 -10.862 c 7.647 -10.054 7.551 -24.97 -0.244 -34.923 c -6.546 -8.62 -18.141 -12.816 -28.74 -10.343 c -0.088 -4.327 -0.048 -8.656 -0.032 -12.985 c -0.746 -0.009 -1.492 -0.019 -2.236 -0.027 z" fill="#4a8cff"/>
                  <path d="m 367.6 45.844 c 16.131 -4.273 33.943 -1.845 47.641 8.339 c 16.729 11.914 26.343 33.598 23.648 54.044 c -1.98 16.485 -12.154 31.556 -26.465 40.04 c -14.201 8.666 -32.342 10.484 -48.2 5.133 c -15.658 -5.067 -28.857 -17.271 -35.201 -32.385 c -4.734 -10.882 -5.847 -23.342 -3.206 -34.984 c 3.047 -14.098 11.345 -26.795 23.108 -34.854 c 5.938 -4.184 12.778 -7.135 19.93 -8.647 c -0.013 4.341 -0.032 8.683 0.008 13.024 c -12.592 3.935 -22.263 16.585 -21.585 29.944 c -0.027 12.123 8.322 23.345 19.883 27.09 c 11.971 4.229 26.079 -0.257 33.736 -10.506 c 7.895 -10.223 7.839 -25.594 -0.135 -35.751 c -6.865 -9.011 -19.165 -12.74 -29.886 -9.374 c -0.13 -4.417 -0.036 -8.835 -0.048 -13.254 c -0.075 -0.03 -0.151 -0.061 -0.228 -0.091 z" fill="#4a8cff"/>
                  <path d="m 535.735 46.133 c 14.456 -4.153 30.604 -2.197 43.447 5.734 c 0.079 4.983 0.017 9.968 0.032 14.951 c -0.807 -0.447 -1.604 -0.906 -2.44 -1.307 c -11.324 -5.715 -25.586 -5.775 -36.901 -0.024 c -12.789 6.261 -21.317 20.377 -20.693 34.707 c 0.04 14.32 9.254 27.777 22.302 33.64 c 10.001 4.651 22.067 4.452 31.954 -0.384 c 1.897 -0.856 3.704 -1.869 5.466 -3.019 c 0.086 4.505 0.022 9.015 0.032 13.522 c -15.015 9.347 -34.552 10.174 -50.286 2.266 c -14.068 -6.792 -25.164 -19.803 -29.897 -34.825 c -3.685 -11.133 -3.858 -23.359 -0.548 -34.6 c 5.489 -19.754 22.479 -36.014 42.533 -40.662 z" fill="#4a8cff"/>
                  <path d="M 219.348 54.785 C 219.348 42.652 219.348 30.521 219.348 18.39 C 245.176 18.442 271.002 18.442 296.83 18.39 C 296.766 30.521 296.766 42.652 296.83 54.785 C 271.002 54.838 245.176 54.838 219.348 54.785 Z" fill="#4a8cff"/>
                </svg>
              </div>
            </div>
            
            {/* Dropbox - Updated to match your image */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 40" className="w-10 h-10">
                  <path d="M12.5 0L0 8.1l8.7 7L21.2 7 12.5 0zm17.5 0L21.2 7 33.7 15.1l8.8-7L30 0zM0 22.1L12.5 30l8.7-7.1L8.7 15 0 22.1zm38.7-7.1L26.2 22.9l8.8 7.1L47.5 22.1l-8.8-7.1zM12.6 32.9l8.6 7 8.6-7-8.6-7.1-8.6 7.1z" fill="#0061ff"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}