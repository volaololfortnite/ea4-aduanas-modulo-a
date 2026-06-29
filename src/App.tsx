import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  Check, 
  Clock, 
  User, 
  Mail, 
  RefreshCw,
  ShieldCheck
} from "lucide-react";

export default function App() {
  // Form States
  const [documentType, setDocumentType] = useState<"RUT" | "Pasaporte">("RUT");
  const [docNumber, setDocNumber] = useState("");
  const [email, setEmail] = useState("");
  const [withMinors, setWithMinors] = useState(false);
  const [minorName, setMinorName] = useState("");
  const [minorDoc, setMinorDoc] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Set initial time and update occasionally
  useEffect(() => {
    const formatDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      return now.toLocaleDateString('es-CL', options);
    };
    setCurrentTime(formatDate());
    const interval = setInterval(() => {
      setCurrentTime(formatDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format RUT helpers
  const formatRut = (value: string) => {
    // Remove dots and dashes
    const clean = value.replace(/[^0-9kK]/g, "");
    if (clean.length <= 1) return clean;
    
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();
    
    let formatted = "";
    let count = 0;
    for (let i = body.length - 1; i >= 0; i--) {
      formatted = body.charAt(i) + formatted;
      count++;
      if (count === 3 && i !== 0) {
        formatted = "." + formatted;
        count = 0;
      }
    }
    return formatted ? `${formatted}-${dv}` : dv;
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (documentType === "RUT") {
      setDocNumber(formatRut(val));
    } else {
      setDocNumber(val);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate legacy server delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFinished(true);
    }, 800);
  };

  const handleReset = () => {
    setDocNumber("");
    setEmail("");
    setWithMinors(false);
    setMinorName("");
    setMinorDoc("");
    setAttachedFile(null);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-sans text-gray-800">
      {/* 16:9 PC/Notebook simulation container matching "Professional Polish" layout */}
      <div className="w-full max-w-[1024px] bg-[#f4f4f4] flex flex-col items-center justify-start overflow-hidden border border-gray-300 shadow-xl" style={{ fontFamily: "'Helvetica', 'Arial', sans-serif" }}>
        
        {/* Top brand accent bar */}
        <div className="w-full h-2 bg-[#003399]"></div>

        {/* Brand header */}
        <header className="w-full bg-white border-b border-gray-300 px-10 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 border border-gray-400 flex flex-col items-center justify-center text-[8px] text-center font-bold uppercase p-1 select-none">
              <div className="w-full h-1/2 bg-[#003399] flex items-center justify-center text-white text-[7px]">CHILE</div>
              <div className="w-full h-1/2 bg-[#d52b1e] flex items-center justify-center text-white text-[7px]">ADUANA</div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#003399] uppercase leading-none mb-1">Servicio Nacional de Aduanas</h1>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Gobierno de Chile</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Sistema Integrado de Control Fronterizo</p>
            <p className="text-xs text-gray-600 font-mono capitalize">{currentTime || "Sábado, 27 de junio de 2026"}</p>
          </div>
        </header>

        {/* Central screen form area */}
        <main className="flex-1 w-full flex items-center justify-center p-8 md:p-12">
          {!isFinished ? (
            <form onSubmit={handleFinish} className="w-[800px] bg-white border border-gray-300 shadow-sm p-10 flex flex-col space-y-6">
              
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-bold text-gray-700 uppercase">Declaración de Ingreso / Egreso de Pasajeros</h2>
              </div>

              {/* Grid of inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* RUT / Pasaporte container with selector */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="doc_number" className="text-xs font-bold uppercase text-gray-600">
                      {documentType} o Número de Pasaporte <span className="text-[#003399]">*</span>
                    </label>
                    <div className="flex space-x-3 text-[10px] font-bold uppercase">
                      <label className="inline-flex items-center space-x-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="docType" 
                          checked={documentType === "RUT"} 
                          onChange={() => {
                            setDocumentType("RUT");
                            setDocNumber("");
                          }}
                          className="w-3 h-3 text-[#003399] border-gray-400 focus:ring-0"
                        />
                        <span className={documentType === "RUT" ? "text-[#003399]" : "text-gray-400"}>RUT</span>
                      </label>
                      <label className="inline-flex items-center space-x-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="docType" 
                          checked={documentType === "Pasaporte"} 
                          onChange={() => {
                            setDocumentType("Pasaporte");
                            setDocNumber("");
                          }}
                          className="w-3 h-3 text-[#003399] border-gray-400 focus:ring-0"
                        />
                        <span className={documentType === "Pasaporte" ? "text-[#003399]" : "text-gray-400"}>Pasaporte</span>
                      </label>
                    </div>
                  </div>
                  
                  <input 
                    id="doc_number"
                    type="text" 
                    required
                    value={docNumber}
                    onChange={handleDocChange}
                    placeholder={documentType === "RUT" ? "Ej: 12.345.678-9" : "Ej: A12345678"} 
                    className="w-full p-2 border border-gray-400 bg-gray-50 focus:bg-white text-base focus:outline-none focus:border-[#003399] font-mono uppercase"
                  />
                </div>

                {/* Email address container */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase text-gray-600">
                    Correo Electrónico <span className="text-[#003399]">*</span>
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@dominio.cl" 
                    className="w-full p-2 border border-gray-400 bg-gray-50 focus:bg-white text-base focus:outline-none focus:border-[#003399] font-mono"
                  />
                </div>
              </div>

              {/* Central Box for Minor verification and Attaching documents */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-gray-50 border border-gray-200 p-4 gap-4">
                <div className="flex items-center space-x-3">
                  <input 
                    id="with_minors"
                    type="checkbox" 
                    checked={withMinors}
                    onChange={(e) => setWithMinors(e.target.checked)}
                    className="w-4 h-4 border border-gray-400 text-[#003399] cursor-pointer focus:ring-0"
                  />
                  {/* HU-02: Formulario de declaración de menores activado */}
                  <label htmlFor="with_minors" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    ¿Viaja con menores de edad?
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input 
                    type="file" 
                    id="document-attachment" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    required
                  />
                  <label 
                    htmlFor="document-attachment"
                    className="px-4 py-2 bg-[#e0e0e0] border border-gray-400 text-xs font-bold uppercase shadow-sm hover:bg-gray-200 cursor-pointer select-none flex items-center space-x-1.5 active:bg-gray-300"
                  >
                    <Upload className="w-3.5 h-3.5 text-gray-600" />
                    <span>Adjuntar archivo</span>
                  </label>
                  
                  <div className="border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-500 max-w-[200px] truncate font-mono">
                    {attachedFile ? attachedFile.name : "Ningún archivo seleccionado"}
                  </div>
                </div>
              </div>

              {/* Dynamic minor registry panel */}
              {withMinors && (
                <div className="bg-gray-50 border border-gray-200 p-4 space-y-3">
                  <div className="text-xs font-bold text-gray-600 uppercase border-b border-gray-200 pb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-[#003399]" />
                    <span>Información Adicional del Menor de Edad</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">Nombre Completo del Menor</label>
                      <input
                        type="text"
                        value={minorName}
                        onChange={(e) => setMinorName(e.target.value)}
                        placeholder="Ej: Sofía González Silva"
                        className="p-2 border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#003399]"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">RUT o Pasaporte del Menor</label>
                      <input
                        type="text"
                        value={minorDoc}
                        onChange={(e) => setMinorDoc(e.target.value)}
                        placeholder="Ej: 25.123.456-K"
                        className="p-2 border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#003399]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom footer: QR simulation block & Finalize action */}
              <div className="flex items-start space-x-10 pt-4 border-t border-gray-200">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-32 h-32 border border-gray-400 flex items-center justify-center p-2 bg-white shadow-sm">
                    {/* Simulated flat vector QR code */}
                    <svg width="100" height="100" viewBox="0 0 100 100" className="text-black" aria-hidden="true">
                      {/* Corners */}
                      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                      
                      <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                      
                      <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                      
                      {/* Random blocks */}
                      <rect x="40" y="5" width="10" height="10" fill="currentColor" />
                      <rect x="55" y="0" width="10" height="15" fill="currentColor" />
                      <rect x="40" y="25" width="15" height="10" fill="currentColor" />
                      <rect x="15" y="40" width="15" height="10" fill="currentColor" />
                      <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                      <rect x="50" y="50" width="10" height="10" fill="white" />
                      <rect x="0" y="50" width="10" height="10" fill="currentColor" />
                      <rect x="75" y="40" width="15" height="15" fill="currentColor" />
                      <rect x="85" y="70" width="15" height="10" fill="currentColor" />
                      <rect x="70" y="85" width="15" height="15" fill="currentColor" />
                      <rect x="45" y="75" width="10" height="15" fill="currentColor" />
                      <rect x="35" y="85" width="10" height="10" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Código QR de Trámite</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-end h-32 space-y-4">
                  <p className="text-xs text-gray-500 italic leading-snug">
                    Al hacer clic en 'Finalizar y Salir', usted declara bajo juramento que los datos suministrados en este formulario son verídicos y están sujetos a fiscalización posterior según la normativa aduanera vigente.
                  </p>
                  <div className="flex justify-end">
                    <button
                      id="submit-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-[#0055b8] text-white font-bold uppercase tracking-wide border-b-4 border-[#003366] hover:bg-[#004499] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <span>Finalizar y Salir</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </form>
          ) : (
            // Form success panel matching "Professional Polish" guidelines
            <div className="w-[800px] bg-white border border-gray-300 shadow-sm p-10 flex flex-col space-y-6">
              
              <div className="border-b border-gray-200 pb-4 text-center">
                <div className="w-14 h-14 bg-[#e6f4ea] border border-[#a3cfbb] text-[#157347] flex items-center justify-center rounded-full mx-auto mb-3 shadow-sm">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-[#003399] uppercase">Trámite Completado Correctamente</h2>
                <p className="text-xs text-gray-500 mt-1">
                  La declaración ha sido registrada de manera conforme en el Sistema de Control de Fronteras del Servicio Nacional de Aduanas.
                </p>
              </div>
              <div className="flex flex-col items-center py-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ID-TRAMITE-${Math.floor(Math.random()*1000000)}-VALIDADO`} 
                  alt="Código QR de validación" 
                  className="w-32 h-32 border border-gray-300 p-1"
                />
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">Código QR de Trámite</p>
              </div>

              {/* Receipt details */}
              <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col space-y-4 font-mono text-xs">
                <div className="border-b border-gray-200 pb-2 flex justify-between font-bold text-[#003399]">
                  <span>RESUMEN OFICIAL DE REGISTRO</span>
                  <span>FOLIO: {Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                  <span className="font-bold uppercase">Documento de Viaje:</span>
                  <span>{documentType}: {docNumber || "N/A"}</span>
                  
                  <span className="font-bold uppercase">Correo de Contacto:</span>
                  <span className="break-all">{email || "N/A"}</span>
                  
                  <span className="font-bold uppercase">Viaje con menores:</span>
                  <span>{withMinors ? `SÍ (${minorName || "Menor de edad registrado"})` : "NO"}</span>
                  
                  {withMinors && (
                    <>
                      <span className="font-bold uppercase">Doc. Menor:</span>
                      <span>{minorDoc || "N/A"}</span>
                    </>
                  )}

                  <span className="font-bold uppercase">Fichero Respaldado:</span>
                  <span className="truncate">{attachedFile ? attachedFile.name : "No se adjuntó archivo"}</span>

                  <span className="font-bold uppercase">Fecha del Trámite:</span>
                  <span>{currentTime || "27 de junio de 2026"}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center space-x-4 bg-white p-3 border border-dashed border-gray-300">
                  <div className="border border-gray-400 p-1 bg-white flex-shrink-0">
                    <svg width="60" height="60" viewBox="0 0 100 100" className="text-black" aria-hidden="true">
                      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                      <rect x="40" y="5" width="10" height="10" fill="currentColor" />
                      <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                      <rect x="75" y="40" width="15" height="15" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    <p className="font-bold text-gray-700 uppercase mb-0.5">Verificación en Punto Aduanero</p>
                    <p>Muestre este código QR impreso o en su dispositivo móvil al oficial a cargo del punto de inspección fronteriza para agilizar el cruce.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#eaeaea] border border-gray-400 hover:bg-gray-200 active:bg-gray-300 text-xs font-bold uppercase shadow-sm cursor-pointer transition-colors"
                >
                  Nueva Declaración
                </button>
              </div>

            </div>
          )}
        </main>

        {/* Flat professional footer */}
        <footer className="w-full bg-[#f0f0f0] border-t border-gray-300 py-4 px-10 flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
          <div>© 2024 Servicio Nacional de Aduanas - Chile</div>
          <div className="flex space-x-6">
            <span>Mesa de Ayuda: 600 570 7040</span>
            <span className="hover:underline cursor-pointer">Términos y Condiciones</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
