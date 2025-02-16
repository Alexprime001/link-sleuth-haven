
import { ShortenedUrl } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { Copy, ExternalLink, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LinkCardProps {
  link: ShortenedUrl;
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const shortUrl = `${window.location.origin}/${link.short_code}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied to clipboard",
        description: "The shortened URL has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Original URL</p>
            <a
              href={link.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {link.original_url.substring(0, 50)}
              {link.original_url.length > 50 ? "..." : ""}
              <ExternalLink size={14} />
            </a>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Clicks</p>
            <p className="text-lg font-semibold">{link.clicks}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Shortened URL</p>
            <p className="font-mono text-sm">{shortUrl}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="hover:bg-primary/5"
          >
            <Copy size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowQR(!showQR)}
            className="hover:bg-primary/5"
          >
            <QrCode size={18} />
          </Button>
        </div>

        {showQR && (
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeCanvas
              value={shortUrl}
              size={200}
              level="H"
              includeMargin
              className="animate-fade-in"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
