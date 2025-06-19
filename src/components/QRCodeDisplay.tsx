import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw, AlertTriangle, QrCode as QrCodeIcon } from 'lucide-react';

interface QRCodeDisplayProps {
  /** Interval in seconds for refreshing the QR code. Defaults to 30 seconds. */
  refreshIntervalSeconds?: number;
  /** Size of the QR code image in pixels (width and height). Defaults to 200. */
  qrCodeSize?: number;
}

type QRStatus = 'loading' | 'active' | 'expired' | 'error';

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  refreshIntervalSeconds = 30,
  qrCodeSize = 200,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<QRStatus>('loading');
  const [countdown, setCountdown] = useState<number>(refreshIntervalSeconds);
  const [error, setError] = useState<string | null>(null);

  const generateQrData = () => {
    // Generate unique data for the QR code to ensure it changes on refresh
    return `WhatsAppWebCloneSession_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  const fetchQRCode = useCallback(async () => {
    console.log('QRCodeDisplay: Fetching new QR code...');
    setStatus('loading');
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const data = generateQrData();
      // Using SVG format for better quality and scalability
      const newQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrCodeSize}x${qrCodeSize}&data=${encodeURIComponent(data)}&format=svg&qzone=1`;
      
      // Simulate a random error for demonstration
      // if (Math.random() < 0.15) { // 15% chance of error
      //   throw new Error("Simulated network error. Failed to fetch QR code.");
      // }

      setQrCodeUrl(newQrCodeUrl);
      setStatus('active');
      setCountdown(refreshIntervalSeconds);
    } catch (err) {
      console.error("QRCodeDisplay: Error fetching QR code", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while fetching the QR code.");
      setStatus('error');
      setQrCodeUrl(null); 
    }
  }, [refreshIntervalSeconds, qrCodeSize]);

  useEffect(() => {
    console.log('QRCodeDisplay loaded');
    fetchQRCode();
  }, [fetchQRCode]);

  // Countdown timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (status === 'active' && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (status === 'active' && countdown === 0) {
      setStatus('expired'); 
    }
    return () => clearInterval(timerId);
  }, [status, countdown]);

  // Effect for handling expiry and initiating refresh
  useEffect(() => {
    if (status === 'expired') {
      console.log('QRCodeDisplay: QR code expired, initiating refresh...');
      const refreshTimer = setTimeout(() => {
        fetchQRCode();
      }, 1500); // Show "expired" state briefly before fetching new code
      return () => clearTimeout(refreshTimer);
    }
  }, [status, fetchQRCode]);


  const handleManualRefresh = () => {
    fetchQRCode();
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Skeleton style={{ height: qrCodeSize, width: qrCodeSize }} className="rounded-lg" />
            <p className="text-muted-foreground">Loading QR Code...</p>
          </div>
        );
      case 'active':
        return (
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="Scan this QR Code with WhatsApp on your phone" 
                style={{ width: qrCodeSize, height: qrCodeSize }}
                className="rounded-lg border bg-white p-1" // Added simple styling for the QR code image
              />
            ) : (
              <div 
                style={{ height: qrCodeSize, width: qrCodeSize }} 
                className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                <QrCodeIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              QR code refreshes in {countdown}s
            </p>
          </div>
        );
      case 'expired':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <div 
              style={{ height: qrCodeSize, width: qrCodeSize }} 
              className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
            >
              <p className="text-muted-foreground font-semibold">QR code has expired.</p>
              <p className="text-sm text-muted-foreground mt-2">Attempting to refresh...</p>
              <Loader2 className="mt-3 h-6 w-6 animate-spin text-primary" />
            </div>
            <Button onClick={handleManualRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Now
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-center w-full">
            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Error Loading QR Code</AlertTitle>
              <AlertDescription>
                {error || "Could not load QR code. Please check your connection and try again."}
              </AlertDescription>
            </Alert>
            <div 
              style={{ height: qrCodeSize, width: qrCodeSize }} 
              className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <QrCodeIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            </div>
            <Button onClick={handleManualRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        );
      default:
        // Should not happen
        return <p>An unexpected state occurred.</p>;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold">Link with WhatsApp</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground px-2">
          To use WhatsApp on your computer:
          <ol className="list-decimal list-inside text-left mt-3 space-y-1.5 text-xs sm:text-sm">
            <li>Open WhatsApp on your phone.</li>
            <li>Go to <strong>Settings</strong> <span className="text-muted-foreground/80">(iOS)</span> or <strong>Menu</strong> <span className="text-muted-foreground/80">(Android)</span> &gt; <strong>Linked Devices</strong>.</li>
            <li>Tap <strong>Link a Device</strong>.</li>
            <li>Point your phone at this screen to scan the code.</li>
          </ol>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6" style={{ minHeight: qrCodeSize + 100 }}>
        {renderContent()}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center pt-4 pb-6 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Having trouble? <a href="https://faq.whatsapp.com/general/web-and-desktop/how-to-link-a-device" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Learn how to link a device.
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-2">QR code is session-specific and refreshes periodically.</p>
      </CardFooter>
    </Card>
  );
};

export default QRCodeDisplay;