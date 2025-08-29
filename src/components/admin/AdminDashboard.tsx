import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import PropertyManagement from './PropertyManagement';
import UserManagement from './UserManagement';
import TransactionManagement from './TransactionManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import { 
  BarChart3, 
  Users, 
  Building, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { properties, loading, error } = useProperties();

  useEffect(() => {
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('geocasa_admin');
    if (storedAdmin) {
      try {
        const adminInfo = JSON.parse(storedAdmin);
        setAdminData(adminInfo);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('geocasa_admin');
      }
    }
  }, []);

  const handleLoginSuccess = (adminInfo: any) => {
    setAdminData(adminInfo);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('geocasa_admin');
    setAdminData(null);
    setIsAuthenticated(false);
    toast.success('Déconnexion réussie');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Mock stats - in real app, these would come from API
  const stats = {
    total_properties: properties.length,
    total_users: 1247,
    total_sales: 89,
    monthly_revenue: 2450000,
    pending_reservations: 12,
    conversion_rate: 7.2
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-gray-600">
                  Bienvenue {adminData?.full_name || `${adminData?.first_name} ${adminData?.last_name}` || adminData?.email} - {adminData?.role}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => setActiveSection('properties')}
                  className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-4 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Bien
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-geocasa-blue to-geocasa-blue-light p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_properties}</div>
                    <div className="text-blue-100">Biens disponibles</div>
                  </div>
                  <Building className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-geocasa-orange to-geocasa-orange-light p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_users}</div>
                    <div className="text-orange-100">Utilisateurs</div>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_sales}</div>
                    <div className="text-purple-100">Ventes réalisées</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.conversion_rate}%</div>
                    <div className="text-orange-100">Taux de conversion</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Actions Rapides
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveSection('properties')}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-3 text-green-600" />
                    Ajouter un bien
                  </button>
                  <button 
                    onClick={() => setActiveSection('users')}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Users className="h-4 w-4 mr-3 text-blue-600" />
                    Gérer les utilisateurs
                  </button>
                  <button 
                    onClick={() => setActiveSection('analytics')}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-3 text-purple-600" />
                    Voir les analytics
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Alertes
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-sm font-medium text-orange-800">
                      {stats.pending_reservations} réservations en attente
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-800">
                      Système opérationnel
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Revenus du Mois
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(stats.monthly_revenue)}
                </div>
                <div className="text-sm text-gray-600">+12% vs mois dernier</div>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Dernières Propriétés Ajoutées</h3>
                <button 
                  onClick={() => setActiveSection('properties')}
                  className="text-geocasa-blue hover:text-geocasa-blue-dark font-medium"
                >
                  Voir tout
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.slice(0, 3).map(property => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img 
                      src={property.property_images?.[0]?.image_url || 
                           property.images?.[0] || 
                           'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-geocasa-blue">
                        {formatPrice(property.price || 0)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'disponible' ? 'bg-green-100 text-green-800' :
                        property.status === 'réservé' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'properties':
        return <PropertyManagement />;

      case 'users':
        return <UserManagement />;

      case 'payments':
        return <TransactionManagement />;

      case 'analytics':
        return <AnalyticsDashboard />;

      case 'reservations':
        return <TransactionManagement />;

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">Fonctionnalité en développement</div>
              <p>Cette section sera bientôt disponible</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      adminData={adminData}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;