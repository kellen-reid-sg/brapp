// Script to export drills from old Supabase project
// Run with: node export-drills.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// You'll need to paste your OLD Supabase credentials here
const OLD_SUPABASE_URL = 'YOUR_OLD_PROJECT_URL';
const OLD_SUPABASE_ANON_KEY = 'YOUR_OLD_ANON_KEY';

const supabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);

async function exportDrills() {
  try {
    console.log('Attempting to fetch drills from old Supabase project...');
    
    const { data, error } = await supabase
      .from('drills')
      .select('*');
    
    if (error) {
      console.error('Error fetching drills:', error);
      return;
    }
    
    console.log(`Successfully fetched ${data.length} drills!`);
    
    // Save to JSON file
    fs.writeFileSync(
      'recovered-drills.json',
      JSON.stringify(data, null, 2)
    );
    
    console.log('Drills saved to recovered-drills.json');
    
  } catch (err) {
    console.error('Failed to export:', err.message);
  }
}

exportDrills();
