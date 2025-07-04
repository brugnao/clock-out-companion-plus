
import React, { useState, useEffect } from 'react';
import { Clock, Calculator, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [overtime, setOvertime] = useState({ paid: 0, minutini: 0 });
  const [showOvertime, setShowOvertime] = useState(false);

  // Calculate end time when arrival time changes
  useEffect(() => {
    if (arrivalTime) {
      const [hours, minutes] = arrivalTime.split(':').map(Number);
      const arrivalDate = new Date();
      arrivalDate.setHours(hours, minutes, 0, 0);
      
      // Add 8 hours and 45 minutes
      const endDate = new Date(arrivalDate.getTime() + (8 * 60 + 45) * 60 * 1000);
      
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      setEndTime(`${endHours}:${endMinutes}`);
    } else {
      setEndTime('');
    }
  }, [arrivalTime]);

  // Calculate overtime when departure time changes
  useEffect(() => {
    if (arrivalTime && departureTime) {
      const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
      const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
      
      const arrivalDate = new Date();
      arrivalDate.setHours(arrivalHours, arrivalMinutes, 0, 0);
      
      const departureDate = new Date();
      departureDate.setHours(departureHours, departureMinutes, 0, 0);
      
      // If departure is next day (crossed midnight)
      if (departureDate < arrivalDate) {
        departureDate.setDate(departureDate.getDate() + 1);
      }
      
      const workedMinutes = (departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60);
      const standardMinutes = 8 * 60 + 45; // 8h 45min
      const overtimeMinutes = Math.max(0, workedMinutes - standardMinutes);
      
      if (overtimeMinutes <= 30) {
        setOvertime({
          paid: overtimeMinutes >= 30 ? 30 : 0,
          minutini: overtimeMinutes < 30 ? overtimeMinutes : 0
        });
      } else {
        const paidOvertime = 30 + Math.floor((overtimeMinutes - 30) / 15) * 15;
        const remainingMinutes = (overtimeMinutes - 30) % 15;
        setOvertime({
          paid: paidOvertime,
          minutini: remainingMinutes
        });
      }
      
      setShowOvertime(true);
    } else {
      setShowOvertime(false);
      setOvertime({ paid: 0, minutini: 0 });
    }
  }, [arrivalTime, departureTime]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const clearAll = () => {
    setArrivalTime('');
    setDepartureTime('');
    setEndTime('');
    setOvertime({ paid: 0, minutini: 0 });
    setShowOvertime(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-blue-600 p-3 rounded-full">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Time Tracker</h1>
          <p className="text-gray-600">Track your work hours and overtime</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Time Entry
            </CardTitle>
            <CardDescription>
              Enter your arrival time to calculate when you can leave
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Arrival Time */}
            <div className="space-y-2">
              <Label htmlFor="arrival">Arrival Time</Label>
              <Input
                id="arrival"
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* End Time Display */}
            {endTime && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">End Time (8h 45min)</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                    {endTime}
                  </Badge>
                </div>
              </div>
            )}

            <Separator />

            {/* Departure Time */}
            <div className="space-y-2">
              <Label htmlFor="departure">Actual Departure Time (Optional)</Label>
              <Input
                id="departure"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="text-lg"
                placeholder="Enter to calculate overtime"
              />
            </div>

            {/* Overtime Display */}
            {showOvertime && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Overtime Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Paid Overtime:</span>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                      {formatTime(overtime.paid)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Minutini:</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {formatTime(overtime.minutini)}
                    </Badge>
                  </div>
                  {overtime.paid === 0 && overtime.minutini === 0 && (
                    <div className="text-center text-gray-600 text-sm">
                      No overtime worked
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Clear Button */}
            {(arrivalTime || departureTime) && (
              <Button 
                variant="outline" 
                onClick={clearAll}
                className="w-full"
              >
                Clear All
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-indigo-900 mb-3">How overtime works:</h3>
            <div className="space-y-2 text-sm text-indigo-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>First 30 minutes: "minutini" (not paid)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>After 30 minutes: paid in 15-minute blocks</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Remaining minutes under 15: "minutini"</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
