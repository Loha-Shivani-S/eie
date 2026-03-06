import React, { useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (rollNo: string) => void;
  isActive: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, isActive }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const lastScannedRef = useRef<string>("");
  const scanCooldownRef = useRef<number>(0);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!containerRef.current || starting) return;
    
    setStarting(true);
    setError("");

    // Clean up any existing scanner
    await stopScanner();

    try {
      // Direct getUserMedia call in click handler for mobile compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      // Stop the test stream immediately - Html5Qrcode will create its own
      stream.getTracks().forEach((t) => t.stop());

      const scannerId = "barcode-scanner-container";
      containerRef.current.id = scannerId;

      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 140 }, aspectRatio: 1.5 },
        (decodedText) => {
          const rollNo = decodedText.trim().toUpperCase();
          const now = Date.now();
          // Prevent duplicate rapid scans
          if (rollNo && (rollNo !== lastScannedRef.current || now - scanCooldownRef.current > 3000)) {
            lastScannedRef.current = rollNo;
            scanCooldownRef.current = now;
            onScan(rollNo);
          }
        },
        () => {}
      );

      setScanning(true);
    } catch (err) {
      console.error("Scanner error:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else {
        setError("Could not access camera. Make sure no other app is using it.");
      }
    } finally {
      setStarting(false);
    }
  }, [onScan, stopScanner, starting]);

  const handleStopScanner = useCallback(async () => {
    await stopScanner();
  }, [stopScanner]);

  if (!isActive) return null;

  return (
    <div className="space-y-3">
      {!scanning && (
        <button
          onClick={startScanner}
          disabled={starting}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {starting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Starting Camera...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Tap to Open Camera
            </>
          )}
        </button>
      )}

      <div
        ref={containerRef}
        className={`w-full rounded-xl overflow-hidden border-2 border-primary/30 ${scanning ? "block" : "hidden"}`}
        style={{ minHeight: scanning ? 280 : 0 }}
      />

      {scanning && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Point camera at barcode on student ID
          </p>
          <button
            onClick={handleStopScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium active:scale-[0.98] transition-transform"
          >
            <CameraOff className="w-4 h-4" />
            Stop Scanner
          </button>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
      )}
    </div>
  );
};

export default BarcodeScanner;
