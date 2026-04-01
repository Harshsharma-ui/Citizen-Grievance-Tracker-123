import { supabase, Complaint, ComplaintStatus, isDemoMode } from './supabase';

const LOCAL_STORAGE_KEY = 'citizen_connect_complaints';

const DEFAULT_IMAGES: Record<string, string> = {
  'Potholes': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
  'Waste Management': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
  'Garbage': 'https://images.unsplash.com/photo-1605600611284-195205ef7e8c?auto=format&fit=crop&q=80&w=800',
  'Water Supply': 'https://images.unsplash.com/photo-1585704032915-c3400ca1f963?auto=format&fit=crop&q=80&w=800',
  'Leaking Pipes': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800',
  'Broken Roads': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
  'Street Lights': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
  'Illegal Construction': 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=800',
  'General': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800'
};

function getLocalComplaints(): Complaint[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const samples: Complaint[] = [
    {
      id: 'sample-1',
      category: 'Potholes',
      severity: 'high',
      status: 'SUBMITTED',
      description: 'Large pothole near Rajwada Palace, causing traffic issues.',
      latitude: 22.7196,
      longitude: 75.8577,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      image_url: DEFAULT_IMAGES['Potholes']
    },
    {
      id: 'sample-2',
      category: 'Waste Management',
      severity: 'medium',
      status: 'ASSIGNED',
      description: 'Garbage pileup in Vijay Nagar area.',
      latitude: 22.7533,
      longitude: 75.8937,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 152800000).toISOString(),
      image_url: DEFAULT_IMAGES['Waste Management']
    },
    {
      id: 'sample-3',
      category: 'Water Supply',
      severity: 'high',
      status: 'IN_PROGRESS',
      description: 'Main water pipe burst near Bhanwarkuan.',
      latitude: 22.6916,
      longitude: 75.8677,
      created_at: new Date(Date.now() - 43200000).toISOString(),
      updated_at: new Date(Date.now() - 33200000).toISOString(),
      image_url: DEFAULT_IMAGES['Water Supply']
    },
    {
      id: 'sample-4',
      category: 'Broken Roads',
      severity: 'low',
      status: 'RESOLVED',
      description: 'Minor cracks on the road in Annapurna area.',
      latitude: 22.7016,
      longitude: 75.8377,
      created_at: new Date(Date.now() - 604800000).toISOString(),
      updated_at: new Date(Date.now() - 504800000).toISOString(),
      resolved_at: new Date(Date.now() - 504800000).toISOString(),
      image_url: DEFAULT_IMAGES['Broken Roads']
    },
    {
      id: 'sample-5',
      category: 'Street Lights',
      severity: 'medium',
      status: 'SUBMITTED',
      description: 'Street lights not working on the main road of Saket.',
      latitude: 22.7433,
      longitude: 75.8837,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 259200000).toISOString(),
      image_url: DEFAULT_IMAGES['Street Lights']
    },
    {
      id: 'sample-6',
      category: 'Illegal Construction',
      severity: 'high',
      status: 'ASSIGNED',
      description: 'Unauthorized building construction near the park.',
      latitude: 22.7233,
      longitude: 75.8737,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      updated_at: new Date(Date.now() - 300000000).toISOString(),
      image_url: DEFAULT_IMAGES['Illegal Construction']
    },
    {
      id: 'sample-7',
      category: 'Garbage',
      severity: 'medium',
      status: 'SUBMITTED',
      description: 'Overflowing garbage bin near the community center.',
      latitude: 22.7333,
      longitude: 75.8637,
      created_at: new Date(Date.now() - 50000000).toISOString(),
      updated_at: new Date(Date.now() - 50000000).toISOString(),
      image_url: DEFAULT_IMAGES['Garbage']
    },
    {
      id: 'sample-8',
      category: 'Leaking Pipes',
      severity: 'high',
      status: 'IN_PROGRESS',
      description: 'Severe water leakage from underground pipe in Palasia.',
      latitude: 22.7253,
      longitude: 75.8857,
      created_at: new Date(Date.now() - 150000000).toISOString(),
      updated_at: new Date(Date.now() - 120000000).toISOString(),
      image_url: DEFAULT_IMAGES['Leaking Pipes']
    }
  ];

  if (!stored) {
    saveLocalComplaints(samples);
    return samples;
  }

  const current: Complaint[] = JSON.parse(stored);
  
  // Force update ALL complaints to have relevant images if they are using old placeholders or are missing images
  const updated = current.map(c => {
    const category = c.category as string;
    const defaultImg = DEFAULT_IMAGES[category] || DEFAULT_IMAGES['General'];
    
    // If image is missing or is an old placeholder, update it
    if (!c.image_url || c.image_url.includes('picsum.photos')) {
      return { ...c, image_url: defaultImg };
    }
    return c;
  });

  // Add missing samples
  samples.forEach(sample => {
    if (!updated.find(c => c.id === sample.id)) {
      updated.push(sample);
    }
  });

  return updated;
}

function saveLocalComplaints(complaints: Complaint[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
}

export async function submitComplaint(data: Partial<Complaint>) {
  if (isDemoMode) {
    const category = data.category || 'General';
    const defaultImg = DEFAULT_IMAGES[category] || DEFAULT_IMAGES['General'];
    
    const newComplaint: Complaint = {
      id: Math.random().toString(36).substring(7),
      category,
      severity: data.severity || 'medium',
      status: 'SUBMITTED',
      description: data.description || '',
      latitude: data.latitude || 19.0760,
      longitude: data.longitude || 72.8777,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: data.image_url || defaultImg,
    };
    const current = getLocalComplaints();
    saveLocalComplaints([newComplaint, ...current]);
    return newComplaint;
  }

  const { data: result, error } = await supabase
    .from('complaints')
    .insert([{ ...data, status: 'SUBMITTED' }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  if (isDemoMode) {
    const current = getLocalComplaints();
    const updated = current.map(c => c.id === id ? { 
      ...c, 
      status, 
      updated_at: new Date().toISOString(),
      resolved_at: status === 'RESOLVED' ? new Date().toISOString() : undefined 
    } : c);
    saveLocalComplaints(updated);
    return updated.find(c => c.id === id);
  }

  const { data, error } = await supabase
    .from('complaints')
    .update({ 
      status, 
      updated_at: new Date().toISOString(),
      resolved_at: status === 'RESOLVED' ? new Date().toISOString() : null 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rateComplaint(id: string, rating: number, feedback: string) {
  if (isDemoMode) {
    const current = getLocalComplaints();
    const updated = current.map(c => c.id === id ? { ...c, rating, feedback } : c);
    saveLocalComplaints(updated);
    return updated.find(c => c.id === id);
  }

  const { data, error } = await supabase
    .from('complaints')
    .update({ rating, feedback })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getComplaints() {
  if (isDemoMode) {
    return getLocalComplaints();
  }

  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Complaint[];
}
