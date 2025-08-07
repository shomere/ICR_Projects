import React, { useState } from 'react';
import { AlertTriangle, Copy, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react';

interface SignupErrorFixProps {
  error: string;
  onRetry: () => void;
}

const SignupErrorFix: React.FC<SignupErrorFixProps> = ({ error, onRetry }) => {
  const [copied, setCopied] = useState(false);

  if (!error.includes('Database error')) {
    return null;
  }

  const fixSQL = `-- COMPLETE DATABASE FIX FOR SIGNUP ERROR
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'client'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

SELECT 'Database setup completed successfully!' as status;`;

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(fixSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: select text
      const textArea = document.createElement('textarea');
      textArea.value = fixSQL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium mb-2">Database Configuration Error</div>
          <p className="text-sm mb-4">
            User signup is currently disabled because the database isn't configured yet. 
            This is a one-time setup that takes 30 seconds.
          </p>
          
          <div className="bg-red-100 border border-red-300 p-3 rounded text-sm mb-4">
            <div className="font-medium mb-2">🔧 Quick Fix (30 seconds):</div>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              <li>Click the "Copy Database Fix" button below</li>
              <li>Click "Open Supabase SQL Editor" button</li>
              <li>Paste the SQL and click "Run"</li>
              <li>Come back and click "Try Again"</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={copySQL}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Database Fix</span>
                </>
              )}
            </button>
            
            <a
              href="https://app.supabase.com/project/auudigdqyfsyhloofkfu/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Supabase SQL Editor</span>
            </a>
            
            <button
              onClick={onRetry}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium mb-2">
              👀 View the SQL that will be copied
            </summary>
            <pre className="text-xs bg-red-100 p-2 rounded border overflow-auto max-h-40">
              {fixSQL}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default SignupErrorFix;
