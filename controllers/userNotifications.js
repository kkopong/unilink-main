import supabase from '../services/supabaseClient.js';

export const getAllPosts = async (req, res) => {
    
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};
