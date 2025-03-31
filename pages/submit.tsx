import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SubmitPage() {
  const [form, setForm] = useState({
    description: 'Description test',
    lat: '1.00',
    lng: '2.00',
    heading: '3.00',
    pitch: '4.00',
    zoom: '5.00',
    pano_id: 'Pano id test',
    country_code: 'United States test',
    subdivision_code: 'Missouri test',
    pano_date: '2024-03',
    pano_version: '4',
    tags: 'Test A, Test B',
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Parse types + tags
    const data = {
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      heading: parseFloat(form.heading),
      pitch: parseFloat(form.pitch),
      zoom: parseFloat(form.zoom),
      pano_version: parseInt(form.pano_version),
      tags: form.tags.split(',').map((t) => t.trim()), // turn into array
    };

    const { error } = await supabase.from('pano-test').insert([data]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Pano submitted successfully!');
      setForm({
        description: 'Description test',
        lat: '1.00',
        lng: '2.00',
        heading: '3.00',
        pitch: '4.00',
        zoom: '5.00',
        pano_id: 'Pano id test',
        country_code: 'United States test',
        subdivision_code: 'Missouri test',
        pano_date: '2024-03',
        pano_version: '4',
        tags: 'Test A, Test B',
      });
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>📤 Submit a Pano</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="lat" placeholder="Latitude" value={form.lat} onChange={handleChange} />
        <input name="lng" placeholder="Longitude" value={form.lng} onChange={handleChange} />
        <input name="heading" placeholder="Heading" value={form.heading} onChange={handleChange} />
        <input name="pitch" placeholder="Pitch" value={form.pitch} onChange={handleChange} />
        <input name="zoom" placeholder="Zoom" value={form.zoom} onChange={handleChange} />
        <input name="pano_id" placeholder="Pano ID" value={form.pano_id} onChange={handleChange} />
        <input name="country_code" placeholder="Country Code (e.g. US)" value={form.country_code} onChange={handleChange} />
        <input name="subdivision_code" placeholder="Subdivision Code (e.g. MO)" value={form.subdivision_code} onChange={handleChange} />
        <input name="pano_date" placeholder="Pano Date (e.g. 2023-03)" value={form.pano_date} onChange={handleChange} />
        <input name="pano_version" placeholder="Pano Version (0, 1, 2...)" value={form.pano_version} onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </main>
  );
}
