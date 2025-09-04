import supabase from '../services/supabaseClient.js';

export const createPost = async (req, res) => {
  const { title, description, author } = req.body;

  const { data, error } = await supabase
    .from('posts')
    .insert([{ 
      title, 
      description, 
      author,
      created_at: new Date()
    }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};