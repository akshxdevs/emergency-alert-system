import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface RoleHeaderProps {
  userRole: string;
  receivedAlerts: any[];
}

const RoleHeader = memo(({ userRole, receivedAlerts }: RoleHeaderProps) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'POLICE':
        return {
          title: 'Police Command Center',
          description: 'Monitoring Crime & Accidents',
          icon: '🚔',
          gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
        };
      case 'FIRE':
        return {
          title: 'Fire Department Hub',
          description: 'Monitoring Fire Emergencies',
          icon: '🚒',
          gradient: 'bg-gradient-to-r from-red-500 to-red-600'
        };
      case 'MEDICAL':
        return {
          title: 'Medical Emergency Station',
          description: 'Monitoring Medical Emergencies',
          icon: '🚑',
          gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        };
      default:
        return {
          title: 'Emergency Dashboard',
          description: 'Monitoring Emergencies',
          icon: '⚠️',
          gradient: 'bg-gradient-to-r from-gray-500 to-gray-600'
        };
    }
  };

  const roleConfig = getRoleConfig(userRole);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`absolute top-[100px] left-5 z-40 max-w-[420px] w-full ${roleConfig.gradient} text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 2 
          }}
          className="text-3xl"
        >
          {roleConfig.icon}
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-wide">
            {roleConfig.title}
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Active Alerts: <span className="font-bold text-yellow-300">{receivedAlerts.length}</span>
          </p>
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs opacity-75 mt-1"
          >
            {roleConfig.description}
          </motion.div>
          <div className="mt-2 text-xs opacity-60">
            <span className="bg-white/20 px-2 py-1 rounded-full">
              Role: {userRole} | ID: {userRole?.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

RoleHeader.displayName = 'RoleHeader';

export default RoleHeader; 