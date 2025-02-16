
import { useEffect, useState } from 'react';
import { UrlShortener } from '@/components/UrlShortener';
import { LinkCard } from '@/components/LinkCard';
import { supabase, type ShortenedUrl } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [links, setLinks] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('shortened_urls')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLinks(data || []);
      } catch (error) {
        toast({
          title: "Error fetching links",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('links')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shortened_urls' }, () => {
        fetchLinks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Link Sleuth
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shorten, track, and manage your links with elegance
          </p>
        </div>

        <div className="mb-12">
          <UrlShortener />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Links</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : links.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No links yet. Create your first shortened URL above!
            </p>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
