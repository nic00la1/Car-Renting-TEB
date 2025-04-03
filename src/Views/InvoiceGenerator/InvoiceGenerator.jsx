import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import wtyczki

const InvoiceGenerator = ({ reservation }) => {
  const generateInvoice = () => {
    const doc = new jsPDF();

    // Ustawienie czcionki na Helvetica
    doc.setFont("helvetica");

    // Nagłówek faktury
    doc.setFontSize(20);
    doc.text("Faktura za wynajem samochodu", 20, 20);

    // Nagłówek szczegółów rezerwacji
    doc.setFontSize(12);
    doc.text(`Faktura nr: ${reservation.carName}_${reservation.date}`, 20, 40);
    doc.text(`Data wystawienia: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text("Szczegoly rezerwacji:", 20, 60);

    // Tabela z danymi rezerwacji
    doc.autoTable({
      startY: 70,
      head: [['Lokalizacja', 'Dni', 'Laczna cena (zl)', 'Data rezerwacji']],
      body: [
        [reservation.location, reservation.days, reservation.totalPrice, reservation.date]
      ],
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7] }, // Kolor nagłówka tabeli
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { top: 10, left: 20, right: 20 },
    });

    // Dodanie stopki faktury
    const footerY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("Dziekujemy za skorzystanie z naszej uslugi!", 20, footerY);

    // Zapisanie faktury w pliku PDF
    doc.save(`faktura_${reservation.carName}_${reservation.date}.pdf`);
  };

  return (
    <button onClick={generateInvoice}>Pobierz fakture</button>
  );
};

export default InvoiceGenerator;
