import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface AlertDetailsModalProps {
  selectedAlert: Alert | null;
  showAlertDetails: boolean;
  onClose: () => void;
  onUpdateStatus: (alertId: string, newStatus: string) => void;
  onCancelAlert: (alertId: string) => void;
  onShowLocation: (lat: number, lng: number) => void;
  onShareToMaps: (lat: number, lng: number) => void;
}

const AlertDetailsModal = memo(({
  selectedAlert,
  showAlertDetails,
  onClose,
  onUpdateStatus,
  onCancelAlert,
  onShowLocation,
  onShareToMaps
}: AlertDetailsModalProps) => {
  if (!selectedAlert) return null;

  const getPriorityColor = (priority: string | number) => {
    if ((typeof priority === 'string' && priority === 'HIGH') || priority === 3) {
      return 'text-red-600';
    } else if ((typeof priority === 'string' && priority === 'MEDIUM') || priority === 2) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'REPORTED') {
      return 'text-yellow-600';
    } else if (status === 'IN_PROCESS') {
      return 'text-blue-600';
    } else {
      return 'text-green-600';
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
    <AnimatePresence>
      {selectedAlert && showAlertDetails && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Alert Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getAlertIcon(selectedAlert.type)}
                </span>
                <div>
                  <label className="font-semibold text-gray-600">Type:</label>
                  <p className="text-gray-800 font-medium">{selectedAlert.type}</p>
                </div>
              </div>
              
              <div>
                <label className="font-semibold text-gray-600">Description:</label>
                <p className="text-gray-800">{selectedAlert.description}</p>
              </div>
              
              <div>
                <label className="font-semibold text-gray-600">Priority:</label>
                <p className={`font-medium ${getPriorityColor(selectedAlert.priority)}`}>
                  {typeof selectedAlert.priority === 'string' ? selectedAlert.priority : 
                   selectedAlert.priority === 3 ? 'HIGH' : 
                   selectedAlert.priority === 2 ? 'MEDIUM' : 'LOW'}
                </p>
              </div>
              
              <div>
                <label className="font-semibold text-gray-600">Status:</label>
                <p className={`font-medium ${getStatusColor(selectedAlert.status)}`}>
                  {getStatusText(selectedAlert.status)}
                </p>
              </div>
              
              <div>
                <label className="font-semibold text-gray-600">Location:</label>
                <p className="text-gray-800">
                  📍 {selectedAlert.location[0]?.lat?.toFixed(4)}, {selectedAlert.location[0]?.long?.toFixed(4)}
                </p>
                
                {/* Location Action Buttons in Modal */}
                <div className="flex space-x-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onShowLocation(selectedAlert.location[0]?.lat, selectedAlert.location[0]?.long);
                      onClose();
                    }}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <span>📍</span>
                    <span>Show on Map</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onShareToMaps(selectedAlert.location[0]?.lat, selectedAlert.location[0]?.long)}
                    className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
                  >
                    <span>🗺️</span>
                    <span>Get Directions</span>
                  </motion.button>
                </div>
              </div>
              
              <div>
                <label className="font-semibold text-gray-600">Reported:</label>
                <p className="text-gray-800">🕐 {new Date(selectedAlert.timeStamp).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              {/* Show Start Response and Cancel buttons only for REPORTED status */}
              {(typeof selectedAlert.status === 'string' && selectedAlert.status === 'REPORTED') && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onUpdateStatus(selectedAlert.id, 'IN_PROCESS');
                      onClose();
                    }}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Start Response
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onCancelAlert(selectedAlert.id);
                      onClose();
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Cancel Alert
                  </motion.button>
                </>
              )}
              
              {/* Show Resolve button only for IN_PROCESS status */}
              {(typeof selectedAlert.status === 'string' && selectedAlert.status === 'IN_PROCESS') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onUpdateStatus(selectedAlert.id, 'RESOLVED');
                    onClose();
                  }}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Mark Resolved
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AlertDetailsModal.displayName = 'AlertDetailsModal';

export default AlertDetailsModal; 