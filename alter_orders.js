import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Need service role key to alter table if using RPC, but wait, Supabase JS doesn't have an alter table method.
// We might need to use postgres directly or if there is an rpc function.
