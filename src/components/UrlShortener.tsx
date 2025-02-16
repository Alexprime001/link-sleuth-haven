
import { useState } from 'react';
import { customAlphabet } from 'nanoid';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

export const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const shortCode = customSlug || nanoid();
      const { data, error } = await supabase
        .from('shortened_urls')
        .insert([
          {
            original_url: url,
            short_code: shortCode,
            clicks: 0,
            custom_slug: customSlug || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "URL shortened successfully!",
        description: `Your shortened URL: ${window.location.origin}/${shortCode}`,
      });

      setUrl('');
      setCustomSlug('');
    } catch (error) {
      toast({
        title: "Error shortening URL",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto animate-fade-in">
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Enter your URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 px-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          required
        />
        <Input
          type="text"
          placeholder="Custom slug (optional)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          className="h-12 px-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
      >
        {isLoading ? "Shortening..." : "Shorten URL"}
      </Button>
    </form>
  );
};
