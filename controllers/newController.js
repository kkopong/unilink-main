import supabase from '../services/supabaseClient.js';

export const createNews = async (req, res) => {
  const { title, description, category } = req.body;

  const { data, error } = await supabase
    .from('news')
    .insert([{ 
      title, 
      description, 
      category,
      published_at: new Date()
    }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllNews = async (req, res) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteNews = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};