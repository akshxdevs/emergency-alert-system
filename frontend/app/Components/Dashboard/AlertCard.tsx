import React, { memo } from 'react';
import { motion } from 'framer-motion';

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

interface AlertCardProps {
  alert: Alert;
  index: number;
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

const AlertCard = memo(({
  alert,
  index,
  onUpdateStatus,
  onCancelAlert,
  onShowLocation,
  onShareToMaps,
  onViewDetails,
  isUpdatingAlert,
  updatingAlertId,
  sliderValue,
  CountdownTimer
}: AlertCardProps) => {
  const getPriorityColor = (priority: string | number) => {
    if ((typeof priority === 'string' && priority === 'HIGH') || priority === 3) {
      return 'border-red-500 bg-gradient-to-r from-red-50 to-red-100';
    } else if ((typeof priority === 'string' && priority === 'MEDIUM') || priority === 2) {
      return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100';
    } else {
      return 'border-green-500 bg-gradient-to-r from-green-50 to-green-100';
    }
  };

  const getPriorityBadgeColor = (priority: string | number) => {
    if ((typeof priority === 'string' && priority === 'HIGH') || priority === 3) {
      return 'bg-red-200 text-red-800';
    } else if ((typeof priority === 'string' && priority === 'MEDIUM') || priority === 2) {
      return 'bg-yellow-200 text-yellow-800';
    } else {
      return 'bg-green-200 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'REPORTED') {
      return 'bg-yellow-200 text-yellow-800';
    } else if (status === 'IN_PROCESS') {
      return 'bg-blue-200 text-blue-800';
    } else {
      return 'bg-green-200 text-green-800';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'IN_PROCESS') return '🔄 IN PROGRESS';
    if (status === 'REPORTED') return '📢 REPORTED';
    if (status === 'RESOLVED') return '✅ RESOLVED';
    return status;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRIME': return '🚔';
      case 'FIRE': return '🔥';
      case 'MEDICAL': return '🚑';
      default: return '⚠️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.9, y: -20 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className={`p-5 rounded-xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${getPriorityColor(alert.priority)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">
              {getAlertIcon(alert.type)}
            </span>
            <h3 className="font-bold text-gray-800">{alert.type} Emergency</h3>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityBadgeColor(alert.priority)}`}>
              {typeof alert.priority === 'string' ? alert.priority : 
               alert.priority === 3 ? 'HIGH' : 
               alert.priority === 2 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
          <p className="text-xs text-gray-500">
            📍 {alert.location[0]?.lat?.toFixed(4)}, {alert.location[0]?.long?.toFixed(4)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            🕐 {new Date(alert.timeStamp).toLocaleString()}
          </p>
          
          {/* Location Action Buttons */}
          <div className="flex space-x-2 mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onShowLocation(alert.location[0]?.lat, alert.location[0]?.long)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
            >
              <span>📍</span>
              <span>Show on Map</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onShareToMaps(alert.location[0]?.lat, alert.location[0]?.long)}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
            >
              <span>🗺️</span>
              <span>Get Directions</span>
            </motion.button>
          </div>
          
          {/* Countdown Timer for auto-disappear alerts */}
          {alert.autoDisappearAt && alert.status === 'REPORTED' && (
            <div className="mt-2">
              <CountdownTimer alert={alert} />
            </div>
          )}
          
          {/* Persistent Alert Indicator */}
          {alert.status === 'IN_PROCESS' && (
            <div className="mt-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span>Persistent Alert - Will stay until resolved</span>
              </motion.div>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewDetails(alert)}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          View
        </motion.button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(alert.status)}`}>
          {getStatusText(alert.status)}
        </span>
        
        <div className="flex space-x-2">
          {/* Show Start Response and Cancel buttons only for REPORTED status */}
          {(typeof alert.status === 'string' && alert.status === 'REPORTED') && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateStatus(alert.id, 'IN_PROCESS')}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Response
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCancelAlert(alert.id)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </motion.button>
            </>
          )}
          
          {/* Show Resolve button only for IN_PROCESS status */}
          {(typeof alert.status === 'string' && alert.status === 'IN_PROCESS') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(alert.id, 'RESOLVED')}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Resolve
            </motion.button>
          )}
        </div>
      </div>

      {/* Enhanced Slider for alert updates */}
      {isUpdatingAlert && updatingAlertId === alert.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="text-sm font-medium text-blue-700">Updating Alert Status...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
              style={{ width: `${sliderValue}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-blue-600 mt-2 text-center">{Math.round(sliderValue)}% Complete</p>
        </motion.div>
      )}
    </motion.div>
  );
});

AlertCard.displayName = 'AlertCard';

export default AlertCard; 