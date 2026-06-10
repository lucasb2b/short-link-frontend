import React, { useState, useRef } from 'react';
import { User, Camera, Lock, Eye, EyeOff, Save, Trash2, Key, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';

interface SettingsPanelProps {
  currentUser: { email: string; name: string; avatarUrl?: string };
  onUpdateProfile: (data: { name?: string; password?: string; avatarUrl?: string }) => void;
  onDeleteAccount: () => void;
  registeredUsers: Array<{ email: string; name: string; password?: string; avatarUrl?: string }>;
}

export default function SettingsPanel({
  currentUser,
  onUpdateProfile,
  onDeleteAccount,
  registeredUsers,
}: SettingsPanelProps) {
  const [name, setName] = useState(currentUser.name);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  
  // Password inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password input visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Submitting loaders
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
  // Status feedbacks
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [securityErr, setSecurityErr] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  // Danger zone confirmations
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lookup actual password for validation in state
  const foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
  );
  const actualPassword = foundUser?.password || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileErr('O retrato tá pesado demais, sô! O limite é de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setProfileErr(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfileErr(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileErr('O seu nome não pode ficar em branco, uai!');
      return;
    }

    setIsSubmittingProfile(true);

    setTimeout(() => {
      onUpdateProfile({
        name: name !== currentUser.name ? name : undefined,
        avatarUrl: avatarUrl !== currentUser.avatarUrl ? avatarUrl : undefined,
      });
      setIsSubmittingProfile(false);
      setProfileSuccess('Seu retrato e nome foram salvos com sucesso, sô!');
    }, 800);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErr(null);
    setSecuritySuccess(null);

    if (!currentPassword) {
      setSecurityErr('Preencha a sua senha atual para segurança do trem, sô!');
      return;
    }

    if (currentPassword !== actualPassword) {
      setSecurityErr('Sua senha atual está incorreta, uai. Dá uma olhadinha e tente de novo.');
      return;
    }

    if (!newPassword) {
      setSecurityErr('A nova senha não pode ser vazia, sô!');
      return;
    }

    if (newPassword.length < 3) {
      setSecurityErr('Sua senha secreta precisa ser mais forte, escolha pelo menos 3 caracteres!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityErr('As senhas novas não estão batendo! Confirme direitinho.');
      return;
    }

    setIsSubmittingPassword(true);

    setTimeout(() => {
      onUpdateProfile({
        password: newPassword,
      });
      setIsSubmittingPassword(false);
      setSecuritySuccess('Senha do seu passe alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 800);
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarUrl('');
  };

  const handleConfirmDeleteAccount = () => {
    if (deleteConfirmName !== currentUser.name) {
      alert('Por favor, digite seu nome exatamente igual para prosseguir.');
      return;
    }
    onDeleteAccount();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BANNER AREA (Mineiro Style) */}
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        {/* Decorative subtle background grid dots pattern to suggest rustic fabric */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23442a22' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-2xl shadow-sm hidden sm:block shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-primary tracking-tight">Ajustes da Conta</h2>
            <p className="text-sm font-sans text-on-surface-variant font-medium mt-1">
              Mude seus dados por aqui, uai. Deixe tudo com a sua cara.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT FORM GRID */}
      <div className="space-y-8 max-w-3xl">
        
        {/* Section 1: Informações Pessoais */}
        <section className="bg-surface-container-high rounded-3xl p-6 md:p-8 shadow-xs border border-outline-variant/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-125 duration-700 ease-in-out pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-secondary shrink-0" />
            <h3 className="font-serif font-black text-xl text-primary">Informações Pessoais</h3>
          </div>

          {profileErr && (
            <div className="mb-4 p-3.5 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
              {profileErr}
            </div>
          )}

          {profileSuccess && (
            <div className="mb-4 p-3.5 bg-tertiary-container/10 text-tertiary text-xs rounded-xl font-bold border border-tertiary-container/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-tertiary" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              
              {/* Avatar Uploader container */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-surface-variant border-2 border-surface flex-shrink-0 relative group/avatar cursor-pointer shadow-sm overflow-hidden flex items-center justify-center text-3xl font-extrabold text-primary"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Atual" className="w-full h-full object-cover" />
                ) : (
                  name ? name.charAt(0).toUpperCase() : 'U'
                )}
                
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>

              {/* Input for name bonitão */}
              <div className="flex-1 w-full">
                <label className="block text-xs font-extrabold text-on-surface-variant mb-1.5" htmlFor="username">
                  Nome bonitão (Nome de Usuário)
                </label>
                <input 
                  id="username"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome bonito" 
                  className="w-full bg-surface border border-outline-variant/80 rounded-xl px-4 py-3 h-[52px] text-on-surface font-sans text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/50 focus:outline-hidden outline-hidden transition-all shadow-xs"
                />
                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  É assim que as pessoas vão te ver por aqui.
                </p>

                {avatarUrl && (
                  <button 
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-error mt-3.5 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover retrato de perfil</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={handleSaveProfile}
                disabled={isSubmittingProfile}
                className="bg-primary text-white font-serif font-black px-6 py-3 rounded-xl shadow-[0_4px_12px_rgba(78,52,46,0.15)] hover:shadow-[0_6px_16px_rgba(78,52,46,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmittingProfile ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Salvando trem...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Segurança */}
        <section className="bg-surface-container-high rounded-3xl p-6 md:p-8 shadow-xs border border-outline-variant/60 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
            <Lock className="w-5 h-5 text-secondary shrink-0" />
            <h3 className="font-serif font-black text-xl text-primary">Segurança</h3>
          </div>

          {securityErr && (
            <div className="mb-4 p-3.5 bg-error-container/20 text-error text-xs rounded-xl font-bold border border-error-container">
              {securityErr}
            </div>
          )}

          {securitySuccess && (
            <div className="mb-4 p-3.5 bg-tertiary-container/10 text-tertiary text-xs rounded-xl font-bold border border-tertiary-container/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-tertiary" />
              <span>{securitySuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            {/* Current Password Field */}
            <div>
              <label className="block text-xs font-extrabold text-on-surface-variant mb-1.5" htmlFor="current-password">
                Senha Atual
              </label>
              <div className="relative">
                <input 
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant/80 rounded-xl px-4 py-3 h-[52px] text-on-surface font-sans text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/50 focus:outline-hidden outline-hidden transition-all shadow-xs pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {showCurrentPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="pt-2">
              <label className="block text-xs font-extrabold text-on-surface-variant mb-1.5" htmlFor="new-password">
                Sua senha secreta (Nova Senha)
              </label>
              <div className="relative mb-4">
                <input 
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Sua nova senha bacana"
                  className="w-full bg-surface border border-outline-variant/80 rounded-xl px-4 py-3 h-[52px] text-on-surface font-sans text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/50 focus:outline-hidden outline-hidden transition-all shadow-xs pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {showNewPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <label className="block text-xs font-extrabold text-on-surface-variant mb-1.5" htmlFor="confirm-password">
                Confirma pra gente (Confirmar Nova Senha)
              </label>
              <div className="relative">
                <input 
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme a nova senha do trilho"
                  className="w-full bg-surface border border-outline-variant/80 rounded-xl px-4 py-3 h-[52px] text-on-surface font-sans text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/50 focus:outline-hidden outline-hidden transition-all shadow-xs pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSubmittingPassword}
                className="bg-surface border-2 border-outline-variant text-on-surface font-serif font-black px-6 py-3 rounded-xl hover:bg-surface-variant hover:border-secondary/80 transition-all cursor-pointer flex items-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmittingPassword ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span>Trocando senha...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4.5 h-4.5" />
                    <span>Trocar Senha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Section 3: Zona de Perigo */}
        <section className="bg-[#fcf0f0] border border-[#f5c6c6] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-error"></div>
          
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-error shrink-0 mt-1" />
            <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif font-black text-lg text-[#93000a] mb-1">Zona de Perigo</h3>
                <p className="text-xs text-[#93000a]/85 font-medium leading-relaxed">
                  Cuidado, sô! Essa ação não tem volta. Apaga tudo de uma vez.
                </p>
              </div>
              <button 
                onClick={() => {
                  setDeleteConfirmName('');
                  setShowDeleteModal(true);
                }}
                className="bg-white border border-[#f5c6c6] text-error font-serif font-black px-4 py-2.5 rounded-xl hover:bg-error/10 transition-all active:scale-95 whitespace-nowrap cursor-pointer text-xs"
              >
                Excluir minha conta
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* CONFIRM DELETE MODAL (Warm Mineiro Dialogue) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-outline-variant rounded-3xl w-full max-w-md p-6 overflow-hidden relative shadow-lg space-y-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full -mr-12 -mt-12 blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-error/10 text-error rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-black text-xl text-primary">Tem certeza mesmo, sô?</h4>
            </div>

            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Ao confirmar, todos os seus <strong>links encurtados</strong> e <strong>retratos hospedados</strong> vão sumir do mapa, igual poeira na estrada. Essa viagem não tem passagem de volta!
            </p>

            <div className="space-y-1.5 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
              <label className="block text-[11px] font-extrabold text-on-surface-variant" htmlFor="confirm-del-input">
                Para confirmar, digite seu nome exatamente: <strong className="text-secondary select-all">{currentUser.name}</strong>
              </label>
              <input 
                id="confirm-del-input"
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder="Digite seu nome completo aqui..."
                className="w-full bg-surface border border-outline-variant/80 rounded-lg px-3 py-2 text-xs focus:outline-hidden text-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 text-xs font-serif font-black text-on-surface-variant hover:bg-surface-container rounded-xl transition cursor-pointer"
              >
                Não, deixa quieto
              </button>
              <button
                onClick={handleConfirmDeleteAccount}
                disabled={deleteConfirmName !== currentUser.name}
                className="px-4 py-2.5 bg-error text-white font-serif font-black text-xs rounded-xl hover:bg-error/90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Sim, pode apagar tudo!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
