import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

function App() {
     
  //     STATE MANAGEMENT
     
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState({ name: "", address: "" });
  const [items, setItems] = useState([]);
  

     
  //     GENERATE INVOICE NUMBER AUTOMATICALLY
    
  useEffect(() => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const counter = localStorage.getItem("invoiceCounter") || 1;
    const newInvoice = `INV-${dateStr}-${String(counter).padStart(3, "0")}`;
    setInvoiceNumber(newInvoice);
    setDate(today.toISOString().slice(0, 10));
  }, []);

    
  //     ADD ITEM FUNCTION
     
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

     
  //     UPDATE ITEM FUNCTION
     
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

    
  //     DELETE ITEM FUNCTION
    
  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

    
  //     CALCULATIONS
    
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

   
  //     PDF EXPORT
    
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${invoiceNumber}`, 10, 10);
    doc.text(`Date: ${date}`, 10, 20);
    doc.text(`Client: ${client.name}`, 10, 30);
    doc.text(`Address: ${client.address}`, 10, 40);
    doc.text("Items:", 10, 60);

    items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.description} - Qty: ${item.quantity} @ ${item.rate}`,
        10,
        70 + i * 10
      );
    });

    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 10, 130);
    doc.text(`Tax (${tax}%): ${taxAmount.toFixed(2)}`, 10, 140);
    doc.text(`Total: ${total.toFixed(2)}`, 10, 150);

    doc.save(`${invoiceNumber}.pdf`);
  };

     
  //     RENDER
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex justify-center items-center p-6">

      <div className="card-glass w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Invoice Builder
        </h1>

        {/* Invoice Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700">Invoice #</label>
            <input
              type="text"
              className="input-modern"
              value={invoiceNumber}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Date</label>
            <input
              type="date"
              className="input-modern"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700">Client Name</label>
          <input
            type="text"
            className="input-modern mb-3"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
          />
          <label className="font-semibold text-gray-700">Client Address</label>
          <textarea
            className="input-modern"
            rows="3"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
          />
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Line Items</h2>
          {items.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-2 mb-2 items-center bg-white/70 p-2 rounded-xl shadow-sm"
            >
              <input
                type="text"
                className="input-modern"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
              />
              <input
                type="number"
                className="input-modern"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(i, "quantity", Number(e.target.value))
                }
              />
              <input
                type="number"
                className="input-modern"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
              />
              <button
                onClick={() => deleteItem(i)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={addItem} className="btn-primary mt-3">
            + Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="text-right space-y-2 font-semibold text-gray-700">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax ({tax}%): ₹{taxAmount.toFixed(2)}</p>
          <p className="text-xl text-indigo-700">Total: ₹{total.toFixed(2)}</p>
        </div>

        {/* PDF Button */}
        <div className="text-center mt-6">
          <button onClick={generatePDF} className="btn-primary">
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
