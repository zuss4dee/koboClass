import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface EnvironmentStatus {
  supabaseUrl: boolean;
  supabaseAnonKey: boolean;
  allConfigured: boolean;
}

const EnvironmentCheck: React.FC = () => {
  const [envStatus, setEnvStatus] = useState<EnvironmentStatus>({
    supabaseUrl: false,
    supabaseAnonKey: false,
    allConfigured: false
  });

  useEffect(() => {
    const status = {
      supabaseUrl: isSupabaseConfigured,
      supabaseAnonKey: isSupabaseConfigured,
      allConfigured: isSupabaseConfigured
    };
    
    setEnvStatus(status);
  }, []);

  // Don't show anything if everything is configured
  if (envStatus.allConfigured) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-golden-yellow border border-deep-orange rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-deep-orange mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-charcoal-black mb-2">
              Supabase Configuration Required
            </h3>
            <p className="text-sm text-charcoal-black mb-3">
              To enable authentication and database features, please click "Connect to Supabase" in the top right corner.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                {envStatus.supabaseUrl ? (
                  <CheckCircle className="w-4 h-4 text-forest-green" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-brick-red" />
                )}
                <span className={envStatus.supabaseUrl ? 'text-forest-green' : 'text-brick-red'}>
                  Supabase URL
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {envStatus.supabaseAnonKey ? (
                  <CheckCircle className="w-4 h-4 text-forest-green" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-brick-red" />
                )}
                <span className={envStatus.supabaseAnonKey ? 'text-forest-green' : 'text-brick-red'}>
                  Supabase Anon Key
                </span>
              </div>
            </div>

            <p className="text-xs text-charcoal-black">
              Once connected, you'll be able to use authentication, user profiles, and all database features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentCheck;