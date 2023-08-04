import React, { useRef, useState } from 'react'
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';

const QrCode = () => {
    const [qrValue, setQRValue] = useState(''); 

    const pdf = new jsPDF()
    const qrCodeRef = useRef(null);

    const handleInputChange = (event) => {
      setQRValue(event.target.value);
    };
  
    

    return (
      <div>
        <h2>Generate QR Code</h2>
        <input
          type="text"
          placeholder="Masukkan teks atau URL"
          value={qrValue}
          onChange={handleInputChange}
        />
        {qrValue && <QRCodeCanvas value={qrValue}  ref={qrCodeRef}  />}
      </div>
    );
  }
export default QrCode