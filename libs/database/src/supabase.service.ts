import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration:');
      console.error('SUPABASE_URL:', supabaseUrl ? 'Set ✓' : 'Missing ✗');
      console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'Set ✓' : 'Missing ✗');
      throw new Error('Supabase URL and anon key must be provided');
    }

    console.log('Connecting to Supabase at:', supabaseUrl);
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
