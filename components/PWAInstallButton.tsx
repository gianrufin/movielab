"use client";

import { useState } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function PWAInstallButton({ className = "" }: { className?: string }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow when prompt event captured
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        type="button"
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-pill bg-base-800 hover:bg-base-700 text-ink-200 hover:text-ink-100 border border-base-700 px-3 py-1.5 text-xs font-medium transition-all shadow-sm active:scale-95 ${className}`}
        title="Install MovieLab as an app"
      >
        <Download size={14} className="text-accent" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-pill bg-base-800 hover:bg-base-700 text-ink-200 hover:text-ink-100 border border-base-700 px-3 py-1.5 text-xs font-medium transition-all shadow-sm active:scale-95 ${className}`}
          title="Install MovieLab on iOS"
        >
          <Download size={14} className="text-accent" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-pwa-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-sm rounded-card bg-base-900 border border-base-700 p-5 shadow-2xl text-ink-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-base-800">
                <h3 className="text-sm font-semibold text-ink-100">Install MovieLab on iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="text-ink-500 hover:text-ink-200 p-1 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-xs text-ink-300">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-base-800 text-accent shrink-0">
                    <Share size={15} />
                  </div>
                  <p className="pt-0.5">
                    1. Tap the <strong className="text-ink-100">Share</strong> icon in the Safari navigation bar at the bottom.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-base-800 text-accent shrink-0">
                    <PlusSquare size={15} />
                  </div>
                  <p className="pt-0.5">
                    2. Scroll down and select <strong className="text-ink-100">Add to Home Screen</strong>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-pill bg-base-800 hover:bg-base-700 py-2 text-xs font-medium text-ink-100 transition-colors border border-base-700"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser manual install banner
  return (
    <>
      <button
        id="pwa-install-manual-btn"
        type="button"
        onClick={() => setShowHelp(true)}
        className={`inline-flex items-center gap-1.5 rounded-pill bg-base-800 hover:bg-base-700 text-ink-200 hover:text-ink-100 border border-base-700 px-3 py-1.5 text-xs font-medium transition-all shadow-sm active:scale-95 ${className}`}
        title="Install MovieLab"
      >
        <Download size={14} className="text-accent" />
        <span>Install App</span>
      </button>

      {showHelp && (
        <div
          id="manual-pwa-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-card bg-base-900 border border-base-700 p-5 shadow-2xl text-ink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-base-800">
              <h3 className="text-sm font-semibold text-ink-100">Install MovieLab App</h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-ink-500 hover:text-ink-200 p-1 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-xs text-ink-300">
              <p>
                To install MovieLab as a desktop or mobile application:
              </p>
              <ul className="list-disc list-inside space-y-1 text-ink-400 pl-1">
                <li><strong className="text-ink-200">Chrome / Edge:</strong> Click the install icon in the right side of the address bar.</li>
                <li><strong className="text-ink-200">Android:</strong> Tap the 3-dot menu and choose &quot;Add to Home Screen&quot;.</li>
                <li><strong className="text-ink-200">iOS Safari:</strong> Tap Share, then &quot;Add to Home Screen&quot;.</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full rounded-pill bg-base-800 hover:bg-base-700 py-2 text-xs font-medium text-ink-100 transition-colors border border-base-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
