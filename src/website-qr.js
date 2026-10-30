import qrcode from 'qrcode-generator';

export function websiteQrDataUrl(url) {
  try {
    const qr=qrcode(0,'M');
    qr.addData(url);
    qr.make();
    return qr.createDataURL(5,20);
  } catch {
    // A very long configured URL can exceed QR capacity; keep the website link usable.
    return null;
  }
}
