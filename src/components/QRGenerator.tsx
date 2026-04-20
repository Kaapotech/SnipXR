'use client';

import { useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator() {
  const [text, setText] = useState('');

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <section className="py-12 px-4 bg-black/20 animate-fade-in animate-slide-in-from-bottom">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-gray rounded-3xl p-6 md:p-12 shadow-2xl border border-brand-magenta/20 transition-all hover:border-brand-magenta/40">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="p-3 bg-brand-magenta/10 rounded-2xl w-fit">
              <QrCode className="w-8 h-8 text-brand-magenta" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">QR Code Generator</h2>
              <p className="text-gray-400 text-sm md:text-base">Generate high-quality QR codes for your links</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content to encode</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-magenta/50 focus:border-brand-magenta transition-all"
                />
              </div>
              {text && (
                <button
                  onClick={downloadQR}
                  className="w-full bg-brand-magenta hover:bg-brand-magenta/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-xl min-h-[300px]">
              {text ? (
                <QRCodeSVG
                  id="qr-code-svg"
                  value={text}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#1a1a1a"
                />
              ) : (
                <div className="text-gray-400 text-center flex flex-col items-center gap-4">
                  <QrCode className="w-16 h-16 opacity-20" />
                  <p>Enter text or URL to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
