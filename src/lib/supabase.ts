import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mnywgwbpjpjtsrwejqzh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXdnd2JwanBqdHNyd2VqcXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTgxMDUsImV4cCI6MjA2NDE3NDEwNX0.dj85HrK-CkhLiyubFRxvsmSYyNAVktdFqRPgjhMzAs4";

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Tables = {
  expenses: {
    id: string;
    user_id: string;
    title: string;
    amount: number;
    currency: string;
    category: string;
    date: string;
    notes?: string;
    created_at: string;
  };
  currency_preferences: {
    user_id: string;
    currency: string;
    created_at: string;
  };
};
