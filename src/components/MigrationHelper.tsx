import React, { useState } from 'react';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';

const MigrationHelper: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const migrationSQL = `-- COPY THIS ENTIRE BLOCK INTO SUPABASE SQL EDITOR
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

SELECT 'DATABASE MIGRATION COMPLETED! User signup should now work!' AS status;`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(migrationSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 Fix Database Configuration
        </h2>
        
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-800">
            User signup is currently disabled due to missing database configuration.
            Follow these steps to fix it:
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <span className="font-medium">Open Supabase SQL Editor</span>
              <a 
                href="https://app.supabase.com/project/auudigdqyfsyhloofkfu/sql" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                Open SQL Editor <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <span className="font-medium">Copy the SQL migration code</span>
              <button
                onClick={copyToClipboard}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm inline-flex items-center"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy SQL
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="font-medium">Paste it into the SQL Editor and click "Run"</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <span className="font-medium">Come back here and try signing up again</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">SQL Migration Code:</h3>
          <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded border overflow-auto max-h-60">
            {migrationSQL}
          </pre>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            I've Run the Migration - Test Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default MigrationHelper;
