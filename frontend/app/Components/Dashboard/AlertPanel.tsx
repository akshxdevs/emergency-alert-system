import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertCard from './AlertCard';
import { AlertIndicator } from './AlertIndicator';

interface Alert {
  id: string;
  type: string;
  reportedBy: string;
  status: string;
  assignedTo: string;
  timeStamp: string;
  description: string;
  priority: string | number;
  location: Array<{ lat: number; long: number }>;
  autoDisappearAt?: number | null;
}

interface AlertPanelProps {
  receivedAlerts: Alert[];
  userRole: string;
  onUpdateStatus: (alertId: string, newStatus: string) => void;
  onCancelAlert: (alertId: string) => void;
  onShowLocation: (lat: number, lng: number) => void;
  onShareToMaps: (lat: number, lng: number) => void;
  onViewDetails: (alert: Alert) => void;
  isUpdatingAlert: boolean;
  updatingAlertId: string | null;
  sliderValue: number;
  CountdownTimer: React.ComponentType<{ alert: any }>;
}

const AlertPanel = memo(({
  receivedAlerts,
  userRole,
  onUpdateStatus,
  onCancelAlert,
  onShowLocation,
  onShareToMaps,
  onViewDetails,
  isUpdatingAlert,
  updatingAlertId,
  sliderValue,
  CountdownTimer
}: AlertPanelProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute top-[250px] left-5 w-[420px] bg-white/95 backdrop-blur-md text-zinc-900 shadow-2xl rounded-2xl border border-white/30 overflow-hidden z-40"
    >
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${
                receivedAlerts.length > 0 ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
            <h2 className="text-lg font-bold">Emergency Alerts</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {receivedAlerts.length} Active
            </span>
          </div>
          <AlertIndicator threat={receivedAlerts.length > 0} />
        </div>
      </div>

      {/* Alerts Content */}
      <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
        {receivedAlerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-gray-500"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📭
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
            <p className="text-sm opacity-75">Emergency alerts will appear here when civilians report incidents</p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-xs text-blue-500"
            >
              Monitoring for {userRole.toLowerCase()} emergencies...
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {receivedAlerts.map((alert, index) => (
                <AlertCard
                  key={`${alert.id}-${alert.timeStamp}-${index}`}
                  alert={alert}
                  index={index}
                  onUpdateStatus={onUpdateStatus}
                  onCancelAlert={onCancelAlert}
                  onShowLocation={onShowLocation}
                  onShareToMaps={onShareToMaps}
                  onViewDetails={onViewDetails}
                  isUpdatingAlert={isUpdatingAlert}
                  updatingAlertId={updatingAlertId}
                  sliderValue={sliderValue}
                  CountdownTimer={CountdownTimer}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
});

AlertPanel.displayName = 'AlertPanel';

export default AlertPanel; 