import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Check,
  Phone,
  Shield,
  List,
} from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import Booking from "./component/Booking";
import History from "./component/History";

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            <Booking />
          </div>
          <div className="lg:col-span-1">
            <History />
          </div>
        </div>
      </div>
    </div>
  );
}
