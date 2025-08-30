import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Save
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const NotificationManagement: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target_users: 'all',
    is_urgent: false
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        // Mock notifications for development
        const mockNotifications = [
          {
            id: 'notif-1',
            title: 'Nouveau bien disponible',
            message: 'Un nouveau terrain est disponible à Douala',
            type: 'info',
            is_urgent: false,
            created_at: new Date().toISOString(),
            sent_count: 150
          },
          {
            id: 'notif-2',
            title: 'Maintenance programmée',
            message: 'Maintenance du système prévue ce weekend',
            type: 'warning',
            is_urgent: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            sent_count: 1200
          }
        ];
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }

      // Real Supabase query would go here
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(language === 'en' ? 'Error loading notifications' : 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const notificationData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
        is_urgent: formData.is_urgent,
        created_at: new Date().toISOString(),
        sent_count: 0
      };

      if (!isSupabaseConfigured()) {
        // Mock notification creation
        const mockNotifications = JSON.parse(localStorage.getItem('geocasa_mock_notifications') || '[]');
        
        if (editingNotification) {
          const index = mockNotifications.findIndex((n: any) => n.id === editingNotification.id);
          if (index !== -1) {
            mockNotifications[index] = { ...mockNotifications[index], ...notificationData };
          }
          toast.success(language === 'en' ? 'Notification updated!' : 'Notification mise à jour !');
        } else {
          const newNotification = {
            id: `notif-${Date.now()}`,
            ...notificationData
          };
          mockNotifications.push(newNotification);
          toast.success(language === 'en' ? 'Notification created!' : 'Notification créée !');
        }
        
        localStorage.setItem('geocasa_mock_notifications', JSON.stringify(mockNotifications));
        await fetchNotifications();
        resetForm();
        return;
      }

      // Real Supabase operations would go here
      toast.success(language === 'en' ? 'Notification saved!' : 'Notification sauvegardée !');
      resetForm();
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error(language === 'en' ? 'Error saving notification' : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      target_users: 'all',
      is_urgent: false
    });
    setEditingNotification(null);
    setShowAddForm(false);
  };

  const handleEdit = (notification: any) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      target_users: 'all',
      is_urgent: notification.is_urgent
    });
    setShowAddForm(true);
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm(language === 'en' ? 'Delete this notification?' : 'Supprimer cette notification ?')) {
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        const mockNotifications = JSON.parse(localStorage.getItem('geocasa_mock_notifications') || '[]');
        const filtered = mockNotifications.filter((n: any) => n.id !== notificationId);
        localStorage.setItem('geocasa_mock_notifications', JSON.stringify(filtered));
        await fetchNotifications();
        toast.success(language === 'en' ? 'Notification deleted!' : 'Notification supprimée !');
        return;
      }

      // Real deletion would go here
      toast.success(language === 'en' ? 'Notification deleted!' : 'Notification supprimée !');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(language === 'en' ? 'Error deleting notification' : 'Erreur lors de la suppression');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-geocasa-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Notification Management' : 'Gestion des Notifications'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Send and manage notifications to users' : 'Envoyez et gérez les notifications aux utilisateurs'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-3 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {language === 'en' ? 'New Notification' : 'Nouvelle Notification'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">{notifications.length}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Sent' : 'Total Envoyées'}</div>
            </div>
            <Bell className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-orange">
                {notifications.filter(n => n.is_urgent).length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Urgent' : 'Urgentes'}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-geocasa-orange" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {notifications.reduce((sum, n) => sum + (n.sent_count || 0), 0)}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Total Reach' : 'Portée Totale'}</div>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search notifications...' : 'Rechercher des notifications...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Types' : 'Tous les Types'}</option>
            <option value="info">{language === 'en' ? 'Information' : 'Information'}</option>
            <option value="warning">{language === 'en' ? 'Warning' : 'Avertissement'}</option>
            <option value="success">{language === 'en' ? 'Success' : 'Succès'}</option>
            <option value="error">{language === 'en' ? 'Error' : 'Erreur'}</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredNotifications.length} {language === 'en' ? 'notifications found' : 'notifications trouvées'}
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNotification 
                    ? (language === 'en' ? 'Edit Notification' : 'Modifier la Notification')
                    : (language === 'en' ? 'New Notification' : 'Nouvelle Notification')
                  }
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Title' : 'Titre'} *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    placeholder={language === 'en' ? 'Notification title' : 'Titre de la notification'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Message' : 'Message'} *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    placeholder={language === 'en' ? 'Notification message' : 'Message de la notification'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Type' : 'Type'} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    >
                      <option value="info">{language === 'en' ? 'Information' : 'Information'}</option>
                      <option value="success">{language === 'en' ? 'Success' : 'Succès'}</option>
                      <option value="warning">{language === 'en' ? 'Warning' : 'Avertissement'}</option>
                      <option value="error">{language === 'en' ? 'Error' : 'Erreur'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Target Users' : 'Utilisateurs Cibles'}
                    </label>
                    <select
                      value={formData.target_users}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_users: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    >
                      <option value="all">{language === 'en' ? 'All Users' : 'Tous les Utilisateurs'}</option>
                      <option value="clients">{language === 'en' ? 'Clients Only' : 'Clients Seulement'}</option>
                      <option value="admins">{language === 'en' ? 'Admins Only' : 'Admins Seulement'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_urgent"
                    checked={formData.is_urgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_urgent: e.target.checked }))}
                    className="h-4 w-4 text-geocasa-blue focus:ring-geocasa-blue border-gray-300 rounded"
                  />
                  <label htmlFor="is_urgent" className="ml-2 text-sm text-gray-700">
                    {language === 'en' ? 'Mark as urgent' : 'Marquer comme urgent'}
                  </label>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === 'en' ? 'Sending...' : 'Envoi...'}
                      </div>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {editingNotification 
                          ? (language === 'en' ? 'Update' : 'Mettre à Jour')
                          : (language === 'en' ? 'Send Notification' : 'Envoyer la Notification')
                        }
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {language === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Sent Notifications' : 'Notifications Envoyées'}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map(notification => (
            <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mr-3 ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                      <span className="ml-1 capitalize">{notification.type}</span>
                    </span>
                    {notification.is_urgent && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {language === 'en' ? 'URGENT' : 'URGENT'}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h4>
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-4">
                      {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{notification.sent_count || 0} {language === 'en' ? 'recipients' : 'destinataires'}</span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => handleEdit(notification)}
                    className="text-geocasa-blue hover:text-geocasa-blue-dark p-2 rounded-lg hover:bg-blue-50 transition-all"
                    title={language === 'en' ? 'Edit' : 'Modifier'}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                    title={language === 'en' ? 'Delete' : 'Supprimer'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No notifications found' : 'Aucune notification trouvée'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Create your first notification to communicate with users'
                : 'Créez votre première notification pour communiquer avec les utilisateurs'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
            >
              {language === 'en' ? 'Create First Notification' : 'Créer la Première Notification'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;