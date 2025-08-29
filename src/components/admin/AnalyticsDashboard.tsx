import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign,
  MapPin,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Download
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { useLanguage } from '../../contexts/LanguageContext';

const AnalyticsDashboard: React.FC = () => {
  const { properties } = useProperties();
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data - in real app, this would come from your analytics service
  const analyticsData = {
    pageViews: {
      total: 45678,
      change: 12.5,
      data: [
        { date: '2024-01-01', views: 1200 },
        { date: '2024-01-02', views: 1350 },
        { date: '2024-01-03', views: 1100 },
        { date: '2024-01-04', views: 1450 },
        { date: '2024-01-05', views: 1600 },
        { date: '2024-01-06', views: 1300 },
        { date: '2024-01-07', views: 1750 }
      ]
    },
    propertyViews: {
      total: 23456,
      change: 8.3,
      topProperties: [
        { id: '1', title: 'Villa moderne 4 chambres Douala', views: 2340 },
        { id: '2', title: 'Terrain à bâtir - Zone résidentielle', views: 1890 },
        { id: '3', title: 'Appartement 3 pièces meublé Akwa', views: 1567 }
      ]
    },
    userEngagement: {
      favorites: 1234,
      inquiries: 567,
      conversions: 89
    },
    locationStats: [
      { city: 'Douala', properties: 156, views: 12340, sales: 23 },
      { city: 'Yaoundé', properties: 134, views: 9876, sales: 18 },
      { city: 'Bafoussam', properties: 89, views: 5432, sales: 12 },
      { city: 'Bamenda', properties: 67, views: 3456, sales: 8 }
    ]
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? '↗' : '↘';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Analytics Dashboard' : 'Tableau de Bord Analytics'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Monitor platform performance and user behavior' : 'Surveillez les performances de la plateforme et le comportement des utilisateurs'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="7d">{language === 'en' ? 'Last 7 days' : '7 derniers jours'}</option>
            <option value="30d">{language === 'en' ? 'Last 30 days' : '30 derniers jours'}</option>
            <option value="90d">{language === 'en' ? 'Last 3 months' : '3 derniers mois'}</option>
            <option value="1y">{language === 'en' ? 'Last year' : 'Dernière année'}</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">
                {formatNumber(analyticsData.pageViews.total)}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Page Views' : 'Vues de Pages'}</div>
              <div className={`text-sm ${getChangeColor(analyticsData.pageViews.change)}`}>
                {getChangeIcon(analyticsData.pageViews.change)} {analyticsData.pageViews.change}%
              </div>
            </div>
            <Eye className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-orange">
                {formatNumber(analyticsData.propertyViews.total)}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Property Views' : 'Vues de Biens'}</div>
              <div className={`text-sm ${getChangeColor(analyticsData.propertyViews.change)}`}>
                {getChangeIcon(analyticsData.propertyViews.change)} {analyticsData.propertyViews.change}%
              </div>
            </div>
            <Building className="h-8 w-8 text-geocasa-orange" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(analyticsData.userEngagement.favorites)}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Favorites Added' : 'Favoris Ajoutés'}</div>
              <div className="text-sm text-green-600">↗ 15.2%</div>
            </div>
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(analyticsData.userEngagement.inquiries)}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Inquiries' : 'Demandes'}</div>
              <div className="text-sm text-purple-600">↗ 23.1%</div>
            </div>
            <MessageCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Views Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Property Views Trend' : 'Tendance des Vues de Biens'}
            </h3>
            <BarChart3 className="h-5 w-5 text-geocasa-blue" />
          </div>
          
          {/* Simple bar chart visualization */}
          <div className="space-y-3">
            {analyticsData.pageViews.data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-xs text-gray-500">
                  {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange h-2 rounded-full"
                      style={{ width: `${(item.views / 2000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-xs text-gray-700 text-right">
                  {formatNumber(item.views)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Properties */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Top Viewed Properties' : 'Biens les Plus Vus'}
            </h3>
            <TrendingUp className="h-5 w-5 text-geocasa-orange" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.propertyViews.topProperties.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {property.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(property.views)} {language === 'en' ? 'views' : 'vues'}
                    </div>
                  </div>
                </div>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Performance by Location' : 'Performance par Localisation'}
          </h3>
          <button className="bg-geocasa-blue text-white px-4 py-2 rounded-lg hover:bg-geocasa-blue-dark transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Export Report' : 'Exporter le Rapport'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'City' : 'Ville'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Properties' : 'Propriétés'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Total Views' : 'Vues Totales'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Sales' : 'Ventes'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Conversion Rate' : 'Taux de Conversion'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.locationStats.map((location, index) => {
                const conversionRate = (location.sales / location.views * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-geocasa-blue" />
                        <span className="text-sm font-medium text-gray-900">{location.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-geocasa-orange" />
                        <span className="text-sm text-gray-900">{location.properties}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm text-gray-900">{formatNumber(location.views)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">{location.sales}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange h-2 rounded-full"
                            style={{ width: `${Math.min(parseFloat(conversionRate) * 10, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{conversionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Type Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'en' ? 'Property Types Distribution' : 'Répartition des Types de Biens'}
          </h3>
          
          <div className="space-y-4">
            {[
              { type: 'terrain', count: properties.filter(p => p.type === 'terrain' || p.property_type === 'terrain').length, color: 'bg-green-500' },
              { type: 'maison', count: properties.filter(p => p.type === 'maison' || p.property_type === 'maison').length, color: 'bg-blue-500' },
              { type: 'appartement', count: properties.filter(p => p.type === 'appartement' || p.property_type === 'appartement').length, color: 'bg-purple-500' },
              { type: 'lot', count: properties.filter(p => p.type === 'lot' || p.property_type === 'lot').length, color: 'bg-orange-500' }
            ].map((item) => (
              <div key={item.type} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 capitalize">{item.type}</div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${item.color} h-3 rounded-full`}
                      style={{ width: `${(item.count / properties.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-700 text-right">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'en' ? 'User Engagement' : 'Engagement des Utilisateurs'}
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-3 text-red-500" />
                <span className="text-gray-700">{language === 'en' ? 'Favorites Added' : 'Favoris Ajoutés'}</span>
              </div>
              <span className="text-xl font-bold text-red-500">
                {formatNumber(analyticsData.userEngagement.favorites)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-3 text-blue-500" />
                <span className="text-gray-700">{language === 'en' ? 'Inquiries Sent' : 'Demandes Envoyées'}</span>
              </div>
              <span className="text-xl font-bold text-blue-500">
                {formatNumber(analyticsData.userEngagement.inquiries)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-3 text-green-500" />
                <span className="text-gray-700">{language === 'en' ? 'Conversions' : 'Conversions'}</span>
              </div>
              <span className="text-xl font-bold text-green-500">
                {formatNumber(analyticsData.userEngagement.conversions)}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-geocasa-blue">
                  {((analyticsData.userEngagement.conversions / analyticsData.userEngagement.inquiries) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Overall Conversion Rate' : 'Taux de Conversion Global'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {language === 'en' ? 'Recent Activity' : 'Activité Récente'}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'New property added' : 'Nouvelle propriété ajoutée'}
              </div>
              <div className="text-xs text-gray-500">Villa moderne 4 chambres - Douala</div>
            </div>
            <div className="text-xs text-gray-500">
              {language === 'en' ? '2 hours ago' : 'Il y a 2 heures'}
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'New user registration' : 'Nouvelle inscription utilisateur'}
              </div>
              <div className="text-xs text-gray-500">marie.kouam@example.com</div>
            </div>
            <div className="text-xs text-gray-500">
              {language === 'en' ? '4 hours ago' : 'Il y a 4 heures'}
            </div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Payment received' : 'Paiement reçu'}
              </div>
              <div className="text-xs text-gray-500">{formatPrice(2500000)} - Terrain Akwa</div>
            </div>
            <div className="text-xs text-gray-500">
              {language === 'en' ? '6 hours ago' : 'Il y a 6 heures'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;