import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Palette, 
  Shield, 
  Mail, 
  Phone,
  MapPin,
  Building,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  Upload,
  Download
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SettingsManagement: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    site_name: 'GEOCASA GROUP',
    site_description: 'Le Cadastre et L\'Immobilier Facile',
    contact_email: 'contact@geocasagroup.cm',
    contact_phone: '+237 6XX XXX XXX',
    address: 'Douala, Akwa - Cameroun',
    default_language: 'fr',
    currency: 'XAF',
    timezone: 'Africa/Douala'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mtn_mobile_money: true,
    orange_money: true,
    bank_transfer: true,
    credit_card: false,
    commission_rate: 2.5,
    min_reservation_amount: 100000,
    reservation_duration_hours: 48
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    admin_notifications: true,
    user_registration_notify: true,
    property_inquiry_notify: true,
    payment_notify: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_auth: false,
    session_timeout: 24,
    password_min_length: 6,
    require_email_verification: false,
    max_login_attempts: 5,
    lockout_duration: 30
  });

  const tabs = [
    { id: 'general', label: language === 'en' ? 'General' : 'Général', icon: Settings },
    { id: 'payments', label: language === 'en' ? 'Payments' : 'Paiements', icon: CreditCard },
    { id: 'notifications', label: language === 'en' ? 'Notifications' : 'Notifications', icon: Bell },
    { id: 'security', label: language === 'en' ? 'Security' : 'Sécurité', icon: Shield }
  ];

  const handleSaveSettings = async (settingsType: string, settings: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would save to the database
      localStorage.setItem(`geocasa_${settingsType}_settings`, JSON.stringify(settings));
      toast.success(language === 'en' ? 'Settings saved successfully!' : 'Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(language === 'en' ? 'Error saving settings' : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'General Settings' : 'Paramètres Généraux'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Site Name' : 'Nom du Site'}
                </label>
                <input
                  type="text"
                  value={generalSettings.site_name}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Contact Email' : 'Email de Contact'}
                </label>
                <input
                  type="email"
                  value={generalSettings.contact_email}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Contact Phone' : 'Téléphone de Contact'}
                </label>
                <input
                  type="tel"
                  value={generalSettings.contact_phone}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Default Language' : 'Langue par Défaut'}
                </label>
                <select
                  value={generalSettings.default_language}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, default_language: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Site Description' : 'Description du Site'}
              </label>
              <textarea
                value={generalSettings.site_description}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Address' : 'Adresse'}
              </label>
              <input
                type="text"
                value={generalSettings.address}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={() => handleSaveSettings('general', generalSettings)}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Save General Settings' : 'Sauvegarder les Paramètres Généraux'}
            </button>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Payment Settings' : 'Paramètres de Paiement'}
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">{language === 'en' ? 'Payment Methods' : 'Méthodes de Paiement'}</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentSettings.mtn_mobile_money}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, mtn_mobile_money: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded mr-3"
                    />
                    <span>MTN Mobile Money</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentSettings.orange_money}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, orange_money: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded mr-3"
                    />
                    <span>Orange Money</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentSettings.bank_transfer}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, bank_transfer: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded mr-3"
                    />
                    <span>{language === 'en' ? 'Bank Transfer' : 'Virement Bancaire'}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Commission Rate (%)' : 'Taux de Commission (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={paymentSettings.commission_rate}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Min Reservation Amount (XAF)' : 'Montant Min. Réservation (FCFA)'}
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.min_reservation_amount}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, min_reservation_amount: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSaveSettings('payment', paymentSettings)}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Save Payment Settings' : 'Sauvegarder les Paramètres de Paiement'}
            </button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Notification Settings' : 'Paramètres de Notification'}
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? 'Email Notifications' : 'Notifications Email'}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Send notifications via email' : 'Envoyer les notifications par email'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.email_notifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                  className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? 'SMS Notifications' : 'Notifications SMS'}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Send notifications via SMS' : 'Envoyer les notifications par SMS'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.sms_notifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, sms_notifications: e.target.checked }))}
                  className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? 'New User Registration' : 'Nouvelle Inscription'}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Notify admins of new registrations' : 'Notifier les admins des nouvelles inscriptions'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.user_registration_notify}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, user_registration_notify: e.target.checked }))}
                  className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? 'Property Inquiries' : 'Demandes de Propriétés'}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Notify of property inquiries' : 'Notifier des demandes de propriétés'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.property_inquiry_notify}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, property_inquiry_notify: e.target.checked }))}
                  className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                />
              </label>
            </div>

            <button
              onClick={() => handleSaveSettings('notification', notificationSettings)}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Save Notification Settings' : 'Sauvegarder les Paramètres de Notification'}
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Security Settings' : 'Paramètres de Sécurité'}
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{language === 'en' ? 'Two-Factor Authentication' : 'Authentification à Deux Facteurs'}</div>
                  <div className="text-sm text-gray-600">{language === 'en' ? 'Require 2FA for admin accounts' : 'Exiger 2FA pour les comptes admin'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.two_factor_auth}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, two_factor_auth: e.target.checked }))}
                  className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Session Timeout (hours)' : 'Expiration Session (heures)'}
                  </label>
                  <input
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Min Password Length' : 'Longueur Min. Mot de Passe'}
                  </label>
                  <input
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSaveSettings('security', securitySettings)}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Save Security Settings' : 'Sauvegarder les Paramètres de Sécurité'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Settings Management' : 'Gestion des Paramètres'}
        </h1>
        <p className="text-gray-600">
          {language === 'en' ? 'Configure platform settings and preferences' : 'Configurez les paramètres et préférences de la plateforme'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-geocasa-blue text-geocasa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;