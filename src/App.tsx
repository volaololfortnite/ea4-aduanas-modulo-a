import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  FileCheck, 
  Clock, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  FileText,
  ChevronRight,
  Upload,
  Download,
  Calendar,
  Mail,
  MapPin,
  HelpCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function App() {
  // Step navigation
  const [step, setStep] = useState<number>(1);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [step2Visited, setStep2Visited] = useState<boolean>(false);
  const [step3Visited, setStep3Visited] = useState<boolean>(false);

  // Paso 1 Form fields
  const [tdoc, setTdoc] = useState<string>('');
  const [ndoc, setNdoc] = useState<string>('');
  const [nom, setNom] = useState<string>('');
  const [ape, setApe] = useState<string>('');
  const [fnac, setFnac] = useState<string>('');
  const [nac, setNac] = useState<string>('Chilena');
  const [mail, setMail] = useState<string>('');

  // Paso 2 Declaraciones
  const [d1, setD1] = useState<string>('NO');
  const [d2, setD2] = useState<string>('NO');
  const [d3, setD3] = useState<string>('NO');
  const [d4, setD4] = useState<string>('NO');
  const [d5, setD5] = useState<string>('NO');
  const [d6, setD6] = useState<string>('NO');

  // Paso 3 Menores
  const [vm, setVm] = useState<boolean>(false);
  const [mnom, setMnom] = useState<string>('');
  const [mrut, setMrut] = useState<string>('');
  const [med, setMed] = useState<string>('');
  const [mrel, setMrel] = useState<string>('');
  const [fileName, setFileName] = useState<string>('Ningún archivo seleccionado');
  const [fileAttached, setFileAttached] = useState<boolean>(false);

  // Institutional clock
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  // Folio, validation errors
  const [folio, setFolio] = useState<string>('');
  const [errorStep1, setErrorStep1] = useState<string>('');
  const [errorFile, setErrorFile] = useState<boolean>(false);

  // Time & date system update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-CL', { hour12: false }));
      setDate(now.toLocaleDateString('es-CL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).toUpperCase());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate unique folio
  const makeFolioCode = (docNum: string, nameVal: string) => {
    const cleanNum = docNum.replace(/[^a-zA-Z0-9]/g, '');
    const cleanNom = nameVal.replace(/\s+/g, '');
    const prefix = (cleanNum + cleanNom).toUpperCase().slice(0, 5);
    const randomSuffix = 1000 + Math.floor(Math.random() * 9000);
    return `LIB-${prefix}-${randomSuffix}`;
  };

  // Keep folio in sync with main identification fields
  useEffect(() => {
    if (ndoc.trim() && nom.trim()) {
      if (!folio) {
        setFolio(makeFolioCode(ndoc, nom));
      }
    } else {
      setFolio('');
    }
  }, [ndoc, nom, folio]);

  // Compile short text optimized for standard QR scanning as a raw text note
  const getQRTextContent = () => {
    const ts = new Date().toLocaleString('es-CL');
    const lines = [
      'SNA-LOS LIBERTADORES',
      `FOLIO:${folio || 'PENDIENTE'}`,
      `FECHA:${ts}`,
      '---VIAJERO---',
      `${tdoc || 'S/D'}:${ndoc || 'S/D'}`,
      `NOMBRE:${nom || 'S/D'} ${ape || 'S/D'}`,
      `NAC:${nac}`,
      `CORREO:${mail || 'S/D'}`,
      '---DECLARACIONES---',
      `DINERO>=10K:${d1}`,
      `ALIMENTOS:${d2}`,
      `ANIMALES:${d3}`,
      `MERCANCIAS:${d4}`,
      `MEDICAMENTOS:${d5}`,
      `ARMAS:${d6}`,
      '---MENORES---',
      vm ? `MENOR:SI|${mnom || 'S/D'}|${mrut || 'S/D'}|${med || '0'}a|${mrel || 'S/D'}` : 'MENOR:NO',
      'CIFRADO:AES-256'
    ];
    return lines.join('\n');
  };

  // Compile full text file format for preview and downloads
  const getFullTextContent = () => {
    const ts = new Date().toLocaleString('es-CL');
    return [
      '================================================================',
      '  SERVICIO NACIONAL DE ADUANAS - REPUBLICA DE CHILE',
      '  SISTEMA INTEGRADO DE CONTROL FRONTERIZO',
      '  Complejo Los Libertadores - Modulo A',
      '================================================================',
      '',
      `FOLIO          : ${folio || 'LIB-PENDIENTE'}`,
      `FECHA Y HORA   : ${ts}`,
      'ESTADO         : REGISTRADO - PENDIENTE VALIDACION PRESENCIAL',
      '',
      '----------------------------------------------------------------',
      'SECCION 1 - IDENTIFICACION DEL VIAJERO',
      '----------------------------------------------------------------',
      `Tipo documento : ${tdoc || 'No especificado'}`,
      `N documento    : ${ndoc || 'No especificado'}`,
      `Nombres        : ${nom || 'No especificado'}`,
      `Apellidos      : ${ape || 'No especificado'}`,
      `Fecha nac.     : ${fnac || 'No especificada'}`,
      `Nacionalidad   : ${nac}`,
      `Correo         : ${mail || 'No especificado'}`,
      '',
      '----------------------------------------------------------------',
      'SECCION 2 - DECLARACION ADUANERA (JURADA)',
      '----------------------------------------------------------------',
      `Dinero >= USD 10.000          : ${d1}`,
      `Alimentos / plantas           : ${d2}`,
      `Animales / prod. animal       : ${d3}`,
      `Mercancias > USD 500          : ${d4}`,
      `Medicamentos controlados      : ${d5}`,
      `Armas / objetos peligrosos    : ${d6}`,
      '',
      '----------------------------------------------------------------',
      'SECCION 3 - MENORES DE EDAD',
      '----------------------------------------------------------------',
      `Viaja con menor : ${vm ? 'SI' : 'NO'}`,
    ].concat(vm ? [
      `Nombre menor   : ${mnom || 'No especificado'}`,
      `RUT menor      : ${mrut || 'No especificado'}`,
      `Edad           : ${med || '0'} años`,
      `Relacion       : ${mrel || 'No especificada'}`,
      'Autorizacion   : ADJUNTADA',
    ] : ['(No aplica)']).concat([
      '',
      '----------------------------------------------------------------',
      'SEGURIDAD',
      '----------------------------------------------------------------',
      'Cifrado        : AES-256',
      `ID unico       : ${folio || 'LIB-PENDIENTE'}`,
      '',
      '================================================================',
      'ADVERTENCIA LEGAL: Declaracion falsa es sancionable',
      'segun Art. 168 de la Ordenanza de Aduanas.',
      'Contacto: www.aduana.cl | Fono: 600 200 2020',
      '================================================================',
    ]).join('\n');
  };

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(`✅ ${e.target.files[0].name}`);
      setFileAttached(true);
      setErrorFile(false);
    }
  };

  // Navigation and step-by-step validations
  const handleContinueToStep2 = () => {
    let hasError = false;
    if (!tdoc) hasError = true;
    if (!ndoc.trim()) hasError = true;
    if (!nom.trim()) hasError = true;
    if (!ape.trim()) hasError = true;
    if (!mail.trim()) hasError = true;

    if (hasError) {
      setErrorStep1('⛔ Complete los campos obligatorios (*)');
    } else {
      setErrorStep1('');
      setStep2Visited(true);
      setStep(2);
    }
  };

  const handleContinueToStep3 = () => {
    setStep3Visited(true);
    setStep(3);
  };

  const handleGeneratePreDeclaration = () => {
    if (vm && !fileAttached) {
      setErrorFile(true);
      return;
    }
    setErrorFile(false);
    setStep(4);
    setConfirmed(true);
  };

  const handleGoBack = (prevStep: number) => {
    setStep(prevStep);
  };

  // Downloader
  const downloadTxtFile = () => {
    const textContent = getFullTextContent();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Declaracion_${folio || 'SNA'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset full state
  const handleReset = () => {
    setTdoc('');
    setNdoc('');
    setNom('');
    setApe('');
    setFnac('');
    setNac('Chilena');
    setMail('');
    setD1('NO');
    setD2('NO');
    setD3('NO');
    setD4('NO');
    setD5('NO');
    setD6('NO');
    setVm(false);
    setMnom('');
    setMrut('');
    setMed('');
    setMrel('');
    setFileName('Ningún archivo seleccionado');
    setFileAttached(false);
    setFolio('');
    setErrorStep1('');
    setErrorFile(false);
    setStep2Visited(false);
    setStep3Visited(false);
    setConfirmed(false);
    setStep(1);
  };

  // Computed properties
  const isFormActive = tdoc && ndoc.trim() && nom.trim() && ape.trim();
  const qrTextEncoded = isFormActive ? encodeURIComponent(getQRTextContent()) : '';
  const qrUrl = isFormActive ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0A1F44&data=${qrTextEncoded}` : '';

  const getStepIndicatorClass = (stepNum: number) => {
    if (confirmed && stepNum === 4) return 'stp ok';
    if (step === stepNum) return 'stp on';
    if (step > stepNum || (stepNum === 2 && step2Visited) || (stepNum === 3 && step3Visited)) return 'stp ok';
    return 'stp';
  };

  return (
    <div className="min-h-screen bg-[#F2F5FA] text-[#0A1F44] flex flex-col font-sans selection:bg-yellow-400 selection:text-[#0A1F44]">
      
      {/* HEADER */}
      <header className="shadow-md">
        <div className="hband"></div>
        <div className="hinner max-w-7xl mx-auto px-4 md:px-6">
          <div className="escudo overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 30 20" className="w-full h-full object-cover">
              <rect x="0" y="0" width="30" height="10" fill="#ffffff" />
              <rect x="0" y="0" width="10" height="10" fill="#002b7f" />
              <rect x="0" y="10" width="30" height="10" fill="#d52b1e" />
              <polygon points="5,2.5 5.75,4.3 7.6,4.3 6.1,5.45 6.7,7.25 5,6.1 3.3,7.25 3.9,5.45 2.4,4.3 4.25,4.3" fill="#ffffff" />
            </svg>
          </div>
          <div className="htxt">
            <h1 className="text-sm md:text-base font-bold uppercase tracking-wide">
              SERVICIO NACIONAL DE ADUANAS — REPÚBLICA DE CHILE
            </h1>
            <p className="text-xs opacity-80">
              Sistema Integrado de Control Fronterizo · Módulo A — Pre-Declaración Digital · Los Libertadores
            </p>
          </div>
          <div className="htag hidden sm:block">KIOSKO</div>
        </div>
      </header>

      {/* PROGRESS STEPPER */}
      <div className="prog">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex items-center justify-between gap-1">
          <div className={getStepIndicatorClass(1)} id="s1">
            <div className="snum">1</div>
            <span>Identificación</span>
          </div>
          <div className="sline"></div>
          <div className={getStepIndicatorClass(2)} id="s2">
            <div className="snum">2</div>
            <span>Declaración</span>
          </div>
          <div className="sline"></div>
          <div className={getStepIndicatorClass(3)} id="s3">
            <div className="snum">3</div>
            <span>Menores</span>
          </div>
          <div className="sline"></div>
          <div className={getStepIndicatorClass(4)} id="s4">
            <div className="snum">4</div>
            <span>Confirmación</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="main max-w-7xl w-full mx-auto px-4 md:px-6 flex-grow">
        
        {/* LEFT COLUMN: ACTIVE STEP FORMS */}
        <div className="flex flex-col">
          
          {/* STEPPER FORM WRAPPER */}
          {!confirmed ? (
            <div id="fsec">

              {/* PASO 1 — IDENTIFICACIÓN */}
              {step === 1 && (
                <div className="card" id="p1">
                  <h2 className="flex items-center gap-2">
                    <User className="w-4.5 h-4.5" />
                    Paso 1 — Identificación
                  </h2>
                  
                  {errorStep1 && (
                    <div id="al1" className="al er block">
                      {errorStep1}
                    </div>
                  )}

                  <div className="row2">
                    <div className="fld">
                      <label htmlFor="tdoc">Tipo doc <span className="req">*</span></label>
                      <select 
                        id="tdoc" 
                        value={tdoc}
                        onChange={(e) => setTdoc(e.target.value)}
                      >
                        <option value="">Seleccionar…</option>
                        <option value="RUT">RUT</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <div className="fld">
                      <label htmlFor="ndoc">N° documento <span className="req">*</span></label>
                      <input 
                        id="ndoc" 
                        placeholder="Ej: 12.345.678-9" 
                        value={ndoc}
                        onChange={(e) => setNdoc(e.target.value)}
                        className={errorStep1 && !ndoc.trim() ? "err" : ""}
                      />
                    </div>
                  </div>

                  <div className="row2">
                    <div className="fld">
                      <label htmlFor="nom">Nombres <span className="req">*</span></label>
                      <input 
                        id="nom" 
                        placeholder="Nombre(s)" 
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={errorStep1 && !nom.trim() ? "err" : ""}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="ape">Apellidos <span className="req">*</span></label>
                      <input 
                        id="ape" 
                        placeholder="Apellido(s)" 
                        value={ape}
                        onChange={(e) => setApe(e.target.value)}
                        className={errorStep1 && !ape.trim() ? "err" : ""}
                      />
                    </div>
                  </div>

                  <div className="row3">
                    <div className="fld">
                      <label htmlFor="fnac">Fecha nac.</label>
                      <input 
                        id="fnac" 
                        type="date" 
                        value={fnac}
                        onChange={(e) => setFnac(e.target.value)}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="nac">Nacionalidad</label>
                      <select 
                        id="nac" 
                        value={nac}
                        onChange={(e) => setNac(e.target.value)}
                      >
                        <option value="Chilena">Chilena</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Peruana">Peruana</option>
                        <option value="Colombiana">Colombiana</option>
                        <option value="Venezolana">Venezolana</option>
                        <option value="Otra">Otra</option>
                      </select>
                    </div>
                    <div className="fld">
                      <label htmlFor="mail">Correo <span className="req">*</span></label>
                      <input 
                        id="mail" 
                        type="email" 
                        placeholder="correo@ejemplo.cl" 
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className={errorStep1 && !mail.trim() ? "err" : ""}
                      />
                    </div>
                  </div>

                  <div className="brow">
                    <button className="btn bpri flex items-center gap-1.5" onClick={handleContinueToStep2}>
                      Continuar <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2 — DECLARACIÓN ADUANERA */}
              {step === 2 && (
                <div className="card" id="p2">
                  <h2 className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5" />
                    Paso 2 — Declaración Aduanera
                  </h2>
                  <p className="text-xs text-[#6B7B94] mb-4">
                    Declaración falsa es sancionable (Art. 168 Ord. de Aduanas).
                  </p>

                  <div className="di">
                    <div className="dt">¿Dinero en efectivo ≥ USD 10.000?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d1" 
                          value="SI" 
                          checked={d1 === 'SI'} 
                          onChange={() => setD1('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d1" 
                          value="NO" 
                          checked={d1 === 'NO'} 
                          onChange={() => setD1('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="di">
                    <div className="dt">¿Alimentos, frutas, plantas o semillas?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d2" 
                          value="SI" 
                          checked={d2 === 'SI'} 
                          onChange={() => setD2('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d2" 
                          value="NO" 
                          checked={d2 === 'NO'} 
                          onChange={() => setD2('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="di">
                    <div className="dt">¿Animales vivos o productos de origen animal?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d3" 
                          value="SI" 
                          checked={d3 === 'SI'} 
                          onChange={() => setD3('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d3" 
                          value="NO" 
                          checked={d3 === 'NO'} 
                          onChange={() => setD3('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="di">
                    <div className="dt">¿Mercancías comerciales &gt; USD 500?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d4" 
                          value="SI" 
                          checked={d4 === 'SI'} 
                          onChange={() => setD4('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d4" 
                          value="NO" 
                          checked={d4 === 'NO'} 
                          onChange={() => setD4('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="di">
                    <div className="dt">¿Medicamentos controlados (narcóticos/psicotrópicos)?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d5" 
                          value="SI" 
                          checked={d5 === 'SI'} 
                          onChange={() => setD5('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d5" 
                          value="NO" 
                          checked={d5 === 'NO'} 
                          onChange={() => setD5('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="di">
                    <div className="dt">¿Armas de fuego u objetos peligrosos?</div>
                    <div className="drg">
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d6" 
                          value="SI" 
                          checked={d6 === 'SI'} 
                          onChange={() => setD6('SI')} 
                        /> Sí
                      </label>
                      <label className="rl">
                        <input 
                          type="radio" 
                          name="d6" 
                          value="NO" 
                          checked={d6 === 'NO'} 
                          onChange={() => setD6('NO')} 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="brow">
                    <button className="btn bout font-semibold" onClick={() => handleGoBack(1)}>
                      ← Volver
                    </button>
                    <button className="btn bpri flex items-center gap-1.5" onClick={handleContinueToStep3}>
                      Continuar <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3 — MENORES DE EDAD */}
              {step === 3 && (
                <div className="card" id="p3">
                  <h2 className="flex items-center gap-2">
                    <FileCheck className="w-4.5 h-4.5" />
                    Paso 3 — Menores de Edad
                  </h2>
                  
                  <div className="tog">
                    <input 
                      type="checkbox" 
                      id="vm" 
                      checked={vm}
                      onChange={(e) => setVm(e.target.checked)}
                    />
                    <label htmlFor="vm" className="font-bold">¿Viaja acompañado de un menor de edad?</label>
                  </div>

                  {vm && (
                    <div id="msec" className="space-y-4 pt-2">
                      <div className="al wa block flex items-center gap-2">
                        <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                        <span>Debe adjuntar autorización notarial o del Juzgado de Familia.</span>
                      </div>
                      
                      <div className="row2">
                        <div className="fld">
                          <label htmlFor="mnom">Nombre menor <span className="req">*</span></label>
                          <input 
                            id="mnom" 
                            placeholder="Nombre completo" 
                            value={mnom}
                            onChange={(e) => setMnom(e.target.value)}
                          />
                        </div>
                        <div className="fld">
                          <label htmlFor="mrut">RUT menor <span className="req">*</span></label>
                          <input 
                            id="mrut" 
                            placeholder="Ej: 23.456.789-0" 
                            value={mrut}
                            onChange={(e) => setMrut(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row2">
                        <div className="fld">
                          <label htmlFor="med">Edad</label>
                          <input 
                            id="med" 
                            type="number" 
                            min="0" 
                            max="17" 
                            placeholder="0-17" 
                            value={med}
                            onChange={(e) => setMed(e.target.value)}
                          />
                        </div>
                        <div className="fld">
                          <label htmlFor="mrel">Relación</label>
                          <select 
                            id="mrel" 
                            value={mrel}
                            onChange={(e) => setMrel(e.target.value)}
                          >
                            <option value="">Seleccionar…</option>
                            <option value="Hijo/a">Hijo/a</option>
                            <option value="Sobrino/a">Sobrino/a</option>
                            <option value="Nieto/a">Nieto/a</option>
                            <option value="Otro (con autorización)">Otro (con autorización)</option>
                          </select>
                        </div>
                      </div>

                      <div 
                        className={`fbox ${fileAttached ? 'ok2' : ''}`} 
                        id="fbox"
                        style={errorFile && !fileAttached ? { borderColor: 'var(--red)' } : undefined}
                      >
                        <label htmlFor="fup" className="fbtn flex items-center gap-1.5 justify-center max-w-xs mx-auto">
                          <Upload className="w-4 h-4" />
                          Adjuntar Autorización (PDF)
                        </label>
                        <input 
                          type="file" 
                          id="fup" 
                          accept=".pdf,.jpg,.png" 
                          onChange={handleFileChange}
                        />
                        <p className="fname" id="fnlbl">{fileName}</p>
                      </div>

                      {errorFile && !fileAttached && (
                        <div id="alfile" className="al er block">
                          ⛔ Debe adjuntar la autorización notarial para continuar.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="brow">
                    <button className="btn bout" onClick={() => handleGoBack(2)}>
                      ← Volver
                    </button>
                    <button className="btn bpri flex items-center gap-1.5" onClick={handleGeneratePreDeclaration}>
                      Generar Pre-Declaración <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            
            /* PASO 4 — CONFIRMACIÓN */
            <div id="conf" className="vis">
              <div className="chead">
                <div className="ic">✅</div>
                <h2 className="text-xl font-bold mt-2">Pre-Declaración Registrada</h2>
                <p className="text-xs opacity-90">
                  Presente el QR en el Kiosko · Al escanearlo se abre el bloc de notas con sus datos
                </p>
                <div className="folio" id="fdis">
                  {folio || 'PENDIENTE'}
                </div>
              </div>

              <div className="card">
                <h2 className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5" />
                  📄 Vista Previa — Bloc de Notas
                </h2>
                
                <pre id="resumen">
                  {getFullTextContent()}
                </pre>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    className="btn bgold flex items-center justify-center gap-2 font-bold flex-1 py-3" 
                    onClick={downloadTxtFile}
                  >
                    <Download className="w-4.5 h-4.5" />
                    💾 Descargar .txt
                  </button>
                  <button 
                    className="btn bout flex items-center justify-center gap-2 font-bold flex-1 py-3" 
                    onClick={handleReset}
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                    🔄 Nueva Declaración
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DYNAMIC QR COMPANION CARD */}
        <div>
          
          {/* QR CODE CARD */}
          <div className="qrcard">
            <h3>🔲 Código QR</h3>
            
            {isFormActive ? (
              <span className="qst act" id="qst">
                ✓ QR Activo — escanee con su celular
              </span>
            ) : (
              <span className="qst pen" id="qst">
                Pendiente de datos
              </span>
            )}

            <div id="qrbox">
              {isFormActive && qrUrl ? (
                <img 
                  src={qrUrl} 
                  alt="Código QR de pre-declaración aduanera" 
                  className="w-44 h-44 object-contain animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="qph">
                  <span className="text-3xl text-slate-300">🔲</span>
                  <p className="text-xs text-[#6B7B94] leading-relaxed">
                    Complete nombre y<br />documento para activar
                  </p>
                </div>
              )}
            </div>

            <p className="qnote leading-relaxed">
              📱 Escanee con la app de qr → se abre el bloc de notas con todos sus datos
            </p>

            <div className="qinfo" id="qinfo">
              {isFormActive ? (
                <div className="space-y-1 text-xs">
                  <div><strong>Folio:</strong> {folio || '—'}</div>
                  <div><strong>Titular:</strong> {nom} {ape}</div>
                  <div><strong>{tdoc}:</strong> {ndoc}</div>
                  <div>
                    <strong>Menor:</strong> {vm ? '⚠️ Sí' : 'No'}
                  </div>
                </div>
              ) : (
                <em className="text-xs text-[#6B7B94]">
                  Los datos aparecerán aquí conforme los ingrese.
                </em>
              )}
            </div>
          </div>

          {/* ADDITIONAL SYSTEM INFO CARD */}
          <div className="card mt-4 p-4 border border-slate-200">
            <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5 text-[#1A4A8A]">
              <Info className="w-4 h-4" />
              ℹ️ Info Fronteriza
            </h2>
            <div className="text-xs space-y-2 text-[#6B7B94] leading-relaxed">
              <p><strong>Complejo:</strong> Los Libertadores</p>
              <p><strong>Ruta:</strong> CH-60 / RN-60</p>
              <p><strong>Horario:</strong> 24/7</p>
              <p><strong>SAG:</strong> Declaración de alimentos obligatoria</p>
              <p><strong>PDI:</strong> Menores requieren autorización notarial</p>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#CBD5E8] bg-white py-6 text-center text-xs text-[#6B7B94]">
        <div className="max-w-7xl mx-auto px-4 space-y-1 font-medium">
          <p>© 2026 SERVICIO NACIONAL DE ADUANAS • POLICÍA DE INVESTIGACIONES DE CHILE (PDI)</p>
          <p className="text-[10px] opacity-75">TODOS LOS DERECHOS RESERVADOS • GOBIERNO DE CHILE</p>
        </div>
      </footer>

    </div>
  );
}
