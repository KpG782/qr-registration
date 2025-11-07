"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  categoryId: string;
  categoryName: string;
  eventName?: string;
}

export function QRCodeDisplay({
  categoryId,
  categoryName,
  eventName,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    generateQRCode();
  }, [categoryId]);

  const generateQRCode = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${baseUrl}/check-in/${categoryId}`;
    setQrUrl(url);

    if (canvasRef.current) {
      try {
        await QRCode.toCanvas(canvasRef.current, url, {
          width: 512,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      } catch (error) {
        console.error("Failed to generate QR code:", error);
        toast.error("Failed to generate QR code");
      }
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-${categoryName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = url;
      link.click();
      toast.success("QR code downloaded");
    } catch (error) {
      toast.error("Failed to download QR code");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {eventName && <div className="text-sm text-gray-600 mb-1">{eventName}</div>}
          <div>{categoryName}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <canvas ref={canvasRef} />
        </div>

        <div className="text-sm text-gray-600 text-center max-w-md break-all">
          {qrUrl}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button onClick={handleCopyLink} variant="outline">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
