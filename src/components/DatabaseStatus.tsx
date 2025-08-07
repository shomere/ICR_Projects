import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Settings, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MigrationHelper from './MigrationHelper';

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [showMigrationHelper, setShowMigrationHelper] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Try to access the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        setStatus('error');
        setError(error.message);
        setIsVisible(true);
      } else {
        // Test a signup to see if trigger works
        try {
          const testEmail = `test-${Date.now()}@example.com`;
          const { error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'testpass123456'
          });
          
          if (signupError && signupError.message.includes('Database error')) {
            setStatus('error');
            setError('Database triggers missing');
            setIsVisible(true);
          } else {
            setStatus('healthy');
            setIsVisible(false);
          }
        } catch {
          setStatus('healthy');
          setIsVisible(false);
        }
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Unknown database error');
      setIsVisible(true);
    }
  };

  const showFixHelper = () => {
    setShowMigrationHelper(true);
  };

  if (!isVisible || status === 'healthy') {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Database Configuration Issue</div>
              <div className="text-red-100 text-sm">
                User signup is currently disabled due to missing database setup.
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={showFixHelper}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Fix Now</span>
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-red-200 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {showMigrationHelper && <MigrationHelper />}
    </>
  );
};

export default DatabaseStatus;
