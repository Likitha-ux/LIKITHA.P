import React, { useState, useEffect } from 'react';
import { Thermometer, Power, RotateCcw, Zap, Monitor } from 'lucide-react';

interface TemperatureReading {
  timestamp: string;
  temperature: number;
  counter: number;
}

function App() {
  const [temperature, setTemperature] = useState<number>(23.5);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Simulate temperature sensor readings
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate realistic temperature fluctuations
      setTemperature(prev => {
        const variation = (Math.random() - 0.5) * 2; // ±1°C variation
        const newTemp = prev + variation;
        return Math.max(15, Math.min(35, newTemp)); // Keep within realistic range
      });

      const now = new Date().toLocaleTimeString();
      setLastUpdate(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handlePowerToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  };

  const handleCounterIncrement = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    
    // Log reading to serial monitor
    const reading: TemperatureReading = {
      timestamp: new Date().toLocaleTimeString(),
      temperature,
      counter: newCounter
    };
    
    setReadings(prev => [reading, ...prev.slice(0, 9)]); // Keep last 10 readings
  };

  const handleReset = () => {
    setCounter(0);
    setTemperature(23.5);
    setReadings([]);
    setLastUpdate('');
  };

  const formatTemperature = (temp: number) => {
    return temp.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-400">
            Temperature Monitoring System
          </h1>
          <p className="text-gray-400">CODTECH Internship Project</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LCD Display Panel */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                LCD Display
              </h2>
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>

            {/* LCD Screen */}
            <div className="bg-black p-6 rounded-lg border-4 border-gray-600 mb-6">
              <div className="bg-green-900 text-green-400 p-4 rounded font-mono text-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm opacity-75">TEMPERATURE</div>
                    <div className="text-3xl font-bold">
                      {formatTemperature(temperature)}°C
                    </div>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">COUNTER</div>
                    <div className="text-3xl font-bold">
                      {counter.toString().padStart(3, '0')}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 text-sm opacity-75">
                  Status: {isActive ? 'ACTIVE' : 'STANDBY'}
                </div>
                {lastUpdate && (
                  <div className="text-center mt-2 text-xs opacity-50">
                    Last Update: {lastUpdate}
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handlePowerToggle}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 ${
                  isActive 
                    ? 'bg-green-600 border-green-500 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Power className="w-6 h-6" />
                <span className="text-sm font-semibold">
                  {isActive ? 'STOP' : 'START'}
                </span>
              </button>

              <button
                onClick={handleCounterIncrement}
                className="p-4 rounded-lg border-2 border-blue-500 bg-blue-600 text-white transition-all duration-200 flex flex-col items-center gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95"
              >
                <Zap className="w-6 h-6" />
                <span className="text-sm font-semibold">COUNT</span>
              </button>

              <button
                onClick={handleReset}
                className="p-4 rounded-lg border-2 border-red-500 bg-red-600 text-white transition-all duration-200 flex flex-col items-center gap-2 hover:bg-red-700 hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-6 h-6" />
                <span className="text-sm font-semibold">RESET</span>
              </button>
            </div>
          </div>

          {/* Serial Monitor */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Serial Monitor
            </h2>

            <div className="bg-black p-4 rounded-lg h-96 overflow-y-auto">
              <div className="text-green-400 text-sm">
                <div className="mb-2 text-yellow-400">
                  === Temperature Sensor Initialized ===
                </div>
                <div className="mb-4 text-gray-400">
                  Baud Rate: 9600 | Status: Ready
                </div>
                
                {readings.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Waiting for readings... Press START to begin monitoring.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {readings.map((reading, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-blue-400">[{reading.timestamp}]</span>
                        <span>Temp: {formatTemperature(reading.temperature)}°C</span>
                        <span className="text-yellow-400">Count: {reading.counter}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {readings.length > 0 ? Math.max(...readings.map(r => r.temperature)).toFixed(1) : '0.0'}°C
                </div>
                <div className="text-sm text-gray-400">Max Temperature</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">
                  {readings.length > 0 ? Math.min(...readings.map(r => r.temperature)).toFixed(1) : '0.0'}°C
                </div>
                <div className="text-sm text-gray-400">Min Temperature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Information */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Circuit Design Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Components Used:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Arduino Uno/Nano</li>
                <li>• DS18B20 Temperature Sensor</li>
                <li>• 16x2 LCD Display</li>
                <li>• Push Button</li>
                <li>• 4.7kΩ Pull-up Resistor</li>
                <li>• 10kΩ Potentiometer (LCD contrast)</li>
                <li>• Breadboard & Jumper Wires</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Pin Connections:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Temperature Sensor: Digital Pin 2</li>
                <li>• LCD RS: Digital Pin 7</li>
                <li>• LCD Enable: Digital Pin 8</li>
                <li>• LCD D4-D7: Digital Pins 9-12</li>
                <li>• Push Button: Digital Pin 3</li>
                <li>• LED Indicator: Digital Pin 13</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;