import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Check, Copy, Tag, User, ShieldAlert, Sparkles, Loader2, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface PhotoUploaderProps {
  onUpload: (file: File, tags: string[], isPrivate: boolean) => Promise<PhotoItem>;
  isLoggedIn?: boolean;
}

export default function PhotoUploader({ onUpload, isLoggedIn = false }: PhotoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [tagsString, setTagsString] = useState('');
  const [isPrivate, setIsPrivate] = useState(!isLoggedIn);

  useEffect(() => {
    setIsPrivate(!isLoggedIn);
  }, [isLoggedIn]);
  
  // Upload status states
  const [uploading, setUploading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<PhotoItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Uai, selecione somente arquivos de imagem, por favor!');
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB, sô!');
      return;
    }
    setFile(selectedFile);
    setUploadedPhoto(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const performUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadedPhoto(null);

    const finalTags = tagsString
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      const newPhoto = await onUpload(file, finalTags, isPrivate);
      setUploadedPhoto(newPhoto);
      setFile(null);
      setPreviewUrl('');
      setTagsString('');
    } catch (err) {
      // O erro já será lidado pelo catch do AppContext que exibe um Toast.
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = () => {
    if (!uploadedPhoto) return;
    navigator.clipboard.writeText(uploadedPhoto.imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const copyShareUrl = () => {
    if (!uploadedPhoto) return;
    const shareUrl = `${window.location.origin}/i/${uploadedPhoto.id.replace('photo-', '')}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
      
      {/* Accent sparkles in background */}
      <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
        <UploadCloud className="w-40 h-40 text-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-extrabold text-xl text-primary">Hospedagem de Fotos</h3>
            <p className="text-xs text-on-surface-variant font-medium">Guarde suas imagens de Minas e do mundo</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!file && !uploading && !uploadedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleButtonClick}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 mb-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] bg-surface/50 ${
                dragActive
                  ? 'border-primary bg-surface-container-high'
                  : 'border-outline-variant hover:border-primary hover:bg-surface-container-low/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleChange}
              />
              <UploadCloud className="w-12 h-12 text-primary/80 mb-3 animate-bounce" />
              <p className="font-bold text-sm text-primary">Arraste seu arquivo de foto aqui</p>
              <p className="text-xs text-on-surface-variant mt-1">Ou clique para procurar nas pastas do seu computador</p>
              <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md mt-4 border border-outline-variant/40 font-mono">
                PNG, JPG, WEBP, GIF (Até 2MB)
              </span>
            </motion.div>
          )}

          {file && previewUrl && !uploading && (
            <motion.form
              key="upload-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={performUpload}
              className="space-y-4"
            >
              {/* Preview and form fields side-by-side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5 flex flex-col items-center bg-surface p-3 rounded-2xl border border-outline-variant/60">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-surface-container flex items-center justify-center relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-on-surface-variant mt-2 px-1">
                    <span className="truncate max-w-[160px] font-bold">{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1 flex items-center gap-1.5 pb-1">
                      <Tag className="w-3.5 h-3.5 text-secondary" />
                      Tags/Marcadores (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      value={tagsString}
                      onChange={(e) => setTagsString(e.target.value)}
                      placeholder="ex: belo-horizonte, comida, trembao"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant text-sm focus:ring-1 focus:ring-primary focus:border-primary text-primary font-medium font-mono"
                    />
                  </div>

                  {isLoggedIn ? (
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-secondary" />
                        Privacidade do Retrato
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPrivate(false)}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            !isPrivate
                              ? 'bg-secondary/10 border-secondary text-secondary shadow-xs'
                              : 'bg-white hover:bg-surface-container-low/40 border-outline-variant text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Público</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPrivate(true)}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isPrivate
                              ? 'bg-primary/10 border-primary text-primary shadow-xs'
                              : 'bg-white hover:bg-surface-container-low/40 border-outline-variant text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Privado</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-1.5 font-semibold">
                        {!isPrivate 
                          ? '🌍 Qualquer pessoa poderá ver esta foto na Galeria Pública!' 
                          : '🔒 Apenas você verá essa foto no seu painel privado.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-surface/50 rounded-xl border border-outline-variant/60 space-y-1">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-secondary" />
                        Privacidade do Retrato
                      </span>
                      <p className="text-xs font-bold text-primary flex items-center gap-1">🔒 Privado por padrão</p>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        Como usuário não identificado, esta foto será enviada como privada. Somente quem possuir o link de compartilhamento poderá visualizá-la.
                      </p>
                    </div>
                  )}

                  {!isLoggedIn && (
                    <div className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/50 text-[11px] text-on-surface-variant leading-relaxed">
                      💡 Sô, se você <span className="font-bold">entrar na sua conta</span>, suas fotos não expiram em 30 dias e ficam guardadas no seu painel pessoal! Suas fotos subirão como "Usuário Não Identificado".
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-primary font-bold hover:bg-surface-container-low transition cursor-pointer"
                >
                  Limpar Foto
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-surface font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container transition shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <span>Subir este Retrato</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.form>
          )}

          {uploading && (
            <motion.div
              key="uploader-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center space-y-4"
            >
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
              <p className="text-sm font-serif italic text-primary animate-pulse">Hospedando seu trem na nuvem...</p>
            </motion.div>
          )}

          {uploadedPhoto && (
            <motion.div
              key="upload-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 p-5 border border-tertiary-container/40 bg-tertiary-container/10 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <div className="flex items-center space-x-2.5 text-tertiary font-serif font-extrabold text-base">
                  <div className="p-1.5 bg-tertiary/10 rounded-lg">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Uai, subiu trem bão demais!</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                  uploadedPhoto.isPrivate 
                    ? 'bg-error/10 text-error border border-error/20' 
                    : 'bg-tertiary/10 text-tertiary border border-tertiary/20'
                }`}>
                  {uploadedPhoto.isPrivate ? '🔒 Link Privado (Não listado na página inicial)' : '🌍 Público na Galeria'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center bg-white p-4 rounded-xl border border-outline-variant/40 shadow-xs">
                <div className="relative aspect-video w-full md:w-40 h-28 shrink-0 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center">
                  <img
                    src={uploadedPhoto.imageUrl}
                    alt={uploadedPhoto.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow space-y-3.5 min-w-0">
                  <div>
                    <p className="text-xs font-serif font-extrabold text-primary truncate max-w-full" title={uploadedPhoto.fileName}>
                      {uploadedPhoto.fileName}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">Espaço ocupado: {uploadedPhoto.size}</p>
                  </div>

                  {/* 1. Share link to Photo Page */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-primary uppercase tracking-wide">
                      🔗 Link de Compartilhamento (Página do Retrato)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/i/${uploadedPhoto.id.replace('photo-', '')}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant font-mono text-xs select-all bg-surface-container-low text-primary font-bold truncate"
                      />
                      <button
                        onClick={copyShareUrl}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition shrink-0 cursor-pointer flex items-center justify-center space-x-1 min-w-[100px] ${
                          copiedShare
                            ? 'bg-tertiary text-surface'
                            : 'bg-primary text-surface hover:bg-primary-container'
                        }`}
                      >
                        {copiedShare ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2. Direct embedded image URL */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wide">
                      🖼️ Link Direto do Arquivo (Para tags HTML)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={uploadedPhoto.imageUrl}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant font-mono text-xs select-all bg-surface-container-low text-on-surface-variant font-medium truncate"
                      />
                      <button
                        onClick={copyUrl}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition shrink-0 cursor-pointer flex items-center justify-center space-x-1 min-w-[100px] ${
                          copied
                            ? 'bg-tertiary text-surface'
                            : 'bg-secondary text-surface hover:bg-secondary-container'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setUploadedPhoto(null)}
                  className="px-4 py-2 bg-primary text-surface font-extrabold text-xs rounded-xl hover:bg-primary-container transition cursor-pointer"
                >
                  Subir Outra Foto
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
