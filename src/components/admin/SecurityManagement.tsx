import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Eye, 
  AlertTriangle, 
  Lock, 
  Unlock,
  UserCheck,
  UserX,
  Activity,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SecurityManagement: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: false,
    session_timeout: 24,
    max_login_attempts: 5,
    lockout_duration: 30,
    require_strong_passwords: true,
    log_user_activities: true
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    // Mock security data
    const mockLogs = [
      {
        id: '1',
        user_email: 'admin@geocasa.com',
        action: 'login_success',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date().toISOString(),
        location: 'Douala, Cameroun'
      },
      {
        id: '2',
        user_email: 'user@geocasa.com',
        action: 'login_failed',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        location: 'Yaoundé, Cameroun'
      },
      {
        id: '3',
        user_email: 'admin@geocasa.com',
        action: 'property_created',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        location: 'Douala, Cameroun'
      }
    ];

    const mockSessions = [
      {
        id: '1',
        user_email: 'admin@geocasa.com',
        ip_address: '192.168.1.100',
        device: 'Windows Desktop',
        location: 'Douala, Cameroun',
        last_activity: new Date().toISOString(),
        is_current: true
      },
      {
        id: '2',
        user_email: 'user@geocasa.com',
        ip_address: '192.168.1.102',
        device: 'iPhone Safari',
        location: 'Yaoundé, Cameroun',
        last_activity: new Date(Date.now() - 1800000).toISOString(),
        is_current: false
      }
    ];

    setSecurityLogs(mockLogs);
    setActiveSessions(mockSessions);
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      toast.success(language === 'en' ? 'Session revoked successfully' : 'Session révoquée avec succès');
    } catch (error) {
      toast.error(language === 'en' ? 'Error revoking session' : 'Erreur lors de la révocation');
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      localStorage.setItem('geocasa_security_settings', JSON.stringify(securitySettings));
      toast.success(language === 'en' ? 'Security settings saved!' : 'Paramètres de sécurité sauvegardés !');
    } catch (error) {
      toast.error(language === 'en' ? 'Error saving settings' : 'Erreur lors de la sauvegarde');
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login_success':
        return 'bg-green-100 text-green-800';
      case 'login_failed':
        return 'bg-red-100 text-red-800';
      case 'property_created':
      case 'property_updated':
        return 'bg-blue-100 text-blue-800';
      case 'user_created':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login_success':
        return <UserCheck className="h-4 w-4" />;
      case 'login_failed':
        return <UserX className="h-4 w-4" />;
      case 'property_created':
      case 'property_updated':
        return <Activity className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels = {
      login_success: language === 'en' ? 'Successful Login' : 'Connexion Réussie',
      login_failed: language === 'en' ? 'Failed Login' : 'Échec de Connexion',
      property_created: language === 'en' ? 'Property Created' : 'Propriété Créée',
      property_updated: language === 'en' ? 'Property Updated' : 'Propriété Mise à Jour',
      user_created: language === 'en' ? 'User Created' : 'Utilisateur Créé'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const tabs = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu', icon: Shield },
    { id: 'logs', label: language === 'en' ? 'Security Logs' : 'Journaux de Sécurité', icon: Eye },
    { id: 'sessions', label: language === 'en' ? 'Active Sessions' : 'Sessions Actives', icon: Monitor },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'Paramètres', icon: Lock }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{securityLogs.filter(log => log.action === 'login_success').length}</div>
                    <div className="text-gray-600">{language === 'en' ? 'Successful Logins' : 'Connexions Réussies'}</div>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{securityLogs.filter(log => log.action === 'login_failed').length}</div>
                    <div className="text-gray-600">{language === 'en' ? 'Failed Attempts' : 'Tentatives Échouées'}</div>
                  </div>
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-geocasa-blue">{activeSessions.length}</div>
                    <div className="text-gray-600">{language === 'en' ? 'Active Sessions' : 'Sessions Actives'}</div>
                  </div>
                  <Monitor className="h-8 w-8 text-geocasa-blue" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-geocasa-orange">0</div>
                    <div className="text-gray-600">{language === 'en' ? 'Security Alerts' : 'Alertes de Sécurité'}</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-geocasa-orange" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{language === 'en' ? 'Recent Security Events' : 'Événements de Sécurité Récents'}</h3>
              <div className="space-y-3">
                {securityLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mr-3 ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                      <span className="ml-1">{getActionLabel(log.action)}</span>
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{log.user_email}</div>
                      <div className="text-xs text-gray-500">{log.ip_address} • {log.location}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Security Activity Logs' : 'Journaux d\'Activité de Sécurité'}
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {securityLogs.map(log => (
                  <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mr-3 ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            <span className="ml-1">{getActionLabel(log.action)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">{language === 'en' ? 'User:' : 'Utilisateur :'}</span>
                            <div className="text-gray-900">{log.user_email}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'en' ? 'IP Address:' : 'Adresse IP :'}</span>
                            <div className="text-gray-900 font-mono">{log.ip_address}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'en' ? 'Location:' : 'Localisation :'}</span>
                            <div className="text-gray-900">{log.location}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">{language === 'en' ? 'Time:' : 'Heure :'}</span>
                            <div className="text-gray-900">{new Date(log.timestamp).toLocaleString('fr-FR')}</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">{language === 'en' ? 'User Agent:' : 'Agent Utilisateur :'}</span> {log.user_agent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Active User Sessions' : 'Sessions Utilisateur Actives'}
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {activeSessions.map(session => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mr-4">
                          {session.device.includes('iPhone') || session.device.includes('Android') ? (
                            <Smartphone className="h-5 w-5 text-white" />
                          ) : (
                            <Monitor className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{session.user_email}</div>
                          <div className="text-sm text-gray-500">{session.device}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="mr-3">{session.location}</span>
                            <Globe className="h-3 w-3 mr-1" />
                            <span>{session.ip_address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {language === 'en' ? 'Last Activity' : 'Dernière Activité'}
                          </div>
                          <div className="text-sm font-medium">
                            {new Date(session.last_activity).toLocaleString('fr-FR')}
                          </div>
                          {session.is_current && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              {language === 'en' ? 'Current' : 'Actuelle'}
                            </span>
                          )}
                        </div>

                        {!session.is_current && (
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            {language === 'en' ? 'Revoke' : 'Révoquer'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {language === 'en' ? 'Security Configuration' : 'Configuration de Sécurité'}
              </h3>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{language === 'en' ? 'Two-Factor Authentication' : 'Authentification à Deux Facteurs'}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Require 2FA for all admin accounts' : 'Exiger 2FA pour tous les comptes admin'}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enable_2fa}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, enable_2fa: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{language === 'en' ? 'Strong Password Policy' : 'Politique de Mot de Passe Fort'}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Enforce strong password requirements' : 'Appliquer des exigences de mot de passe fort'}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.require_strong_passwords}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, require_strong_passwords: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{language === 'en' ? 'Activity Logging' : 'Journalisation des Activités'}</div>
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Log all user activities for security' : 'Enregistrer toutes les activités utilisateur pour la sécurité'}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.log_user_activities}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, log_user_activities: e.target.checked }))}
                      className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      {language === 'en' ? 'Max Login Attempts' : 'Tentatives Max de Connexion'}
                    </label>
                    <input
                      type="number"
                      value={securitySettings.max_login_attempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Lockout Duration (minutes)' : 'Durée de Verrouillage (minutes)'}
                    </label>
                    <input
                      type="number"
                      value={securitySettings.lockout_duration}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockout_duration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSecuritySettings}
                  className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Save Security Settings' : 'Sauvegarder les Paramètres de Sécurité'}
                </button>
              </div>
            </div>
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
          {language === 'en' ? 'Security Management' : 'Gestion de la Sécurité'}
        </h1>
        <p className="text-gray-600">
          {language === 'en' ? 'Monitor and configure platform security' : 'Surveillez et configurez la sécurité de la plateforme'}
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

export default SecurityManagement;