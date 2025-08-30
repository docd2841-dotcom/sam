import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  MapPin,
  Home,
  Building,
  TreePine,
  TrendingUp,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';

const PropertyManagement: React.FC = () => {
  const { properties, loading, fetchProperties } = useProperties();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingProperty, setViewingProperty] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'terrain',
    location: '',
    city: 'Douala',
    area_sqm: '',
    price: '',
    latitude: '',
    longitude: '',
    features: '',
    images: '',
    presentation_video_url: '',
    status: 'disponible'
  });

  const propertyTypes = [
    { value: 'terrain', label: language === 'en' ? 'Land' : 'Terrain', icon: TreePine },
    { value: 'maison', label: language === 'en' ? 'House' : 'Maison', icon: Home },
    { value: 'appartement', label: language === 'en' ? 'Apartment' : 'Appartement', icon: Building },
    { value: 'studio', label: 'Studio', icon: Building },
    { value: 'chambre', label: language === 'en' ? 'Room' : 'Chambre', icon: Building },
    { value: 'lot', label: 'Lot', icon: TrendingUp },
    { value: 'commercial', label: language === 'en' ? 'Commercial' : 'Commercial', icon: Building }
  ];

  const cities = [
    'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi'
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'terrain',
      location: '',
      city: 'Douala',
      area_sqm: '',
      price: '',
      latitude: '',
      longitude: '',
      features: '',
      images: '',
      presentation_video_url: '',
      status: 'disponible'
    });
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const handleView = (property: any) => {
    setViewingProperty(property);
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      type: property.type || 'terrain',
      location: property.location || '',
      city: property.city || 'Douala',
      area_sqm: property.area_sqm?.toString() || '',
      price: property.price?.toString() || '',
      latitude: property.latitude?.toString() || '',
      longitude: property.longitude?.toString() || '',
      features: Array.isArray(property.features) ? property.features.join(', ') : '',
      images: Array.isArray(property.images) ? property.images.join(', ') : '',
      presentation_video_url: property.presentation_video_url || '',
      status: property.status || 'disponible'
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        location: formData.location.trim(),
        city: formData.city,
        area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
        price: parseFloat(formData.price),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        images: formData.images ? formData.images.split(',').map(img => img.trim()).filter(img => img) : [],
        presentation_video_url: formData.presentation_video_url.trim() || null,
        status: formData.status
      };

      if (!isSupabaseConfigured()) {
        // Mock property management for development
        const mockProperties = JSON.parse(localStorage.getItem('geocasa_mock_properties') || '[]');
        
        if (editingProperty) {
          // Update existing property
          const index = mockProperties.findIndex((p: any) => p.id === editingProperty.id);
          if (index !== -1) {
            mockProperties[index] = {
              ...mockProperties[index],
              ...propertyData,
              updated_at: new Date().toISOString()
            };
          }
          toast.success(language === 'en' ? 'Property updated successfully!' : 'Propriété mise à jour avec succès !');
        } else {
          // Add new property
          const newProperty = {
            id: `prop-${Date.now()}`,
            ...propertyData,
            created_by: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockProperties.push(newProperty);
          toast.success(language === 'en' ? 'Property added successfully!' : 'Propriété ajoutée avec succès !');
        }
        
        localStorage.setItem('geocasa_mock_properties', JSON.stringify(mockProperties));
        await fetchProperties(); // Refresh the properties list
        resetForm();
        return;
      }

      if (editingProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Property updated successfully!' : 'Propriété mise à jour avec succès !');
      } else {
        // Add new property
        const { error } = await supabase
          .from('properties')
          .insert(propertyData);

        if (error) throw error;
        toast.success(language === 'en' ? 'Property added successfully!' : 'Propriété ajoutée avec succès !');
      }

      await fetchProperties(); // Refresh the properties list
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(language === 'en' ? 'Error saving property' : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this property?' : 'Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        // Mock property deletion
        const mockProperties = JSON.parse(localStorage.getItem('geocasa_mock_properties') || '[]');
        const filtered = mockProperties.filter((p: any) => p.id !== propertyId);
        localStorage.setItem('geocasa_mock_properties', JSON.stringify(filtered));
        await fetchProperties();
        toast.success(language === 'en' ? 'Property deleted successfully!' : 'Propriété supprimée avec succès !');
        return;
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      await fetchProperties();
      toast.success(language === 'en' ? 'Property deleted successfully!' : 'Propriété supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(language === 'en' ? 'Error deleting property' : 'Erreur lors de la suppression');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType || property.property_type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'réservé':
        return 'bg-yellow-100 text-yellow-800';
      case 'vendu':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = propertyTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Home;
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
            {language === 'en' ? 'Property Management' : 'Gestion des Propriétés'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Manage all properties on the platform' : 'Gérez toutes les propriétés de la plateforme'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-3 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Add Property' : 'Ajouter un Bien'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">{properties.length}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Properties' : 'Total des Biens'}</div>
            </div>
            <Building className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.status === 'disponible').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Available' : 'Disponibles'}</div>
            </div>
            <TreePine className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {properties.filter(p => p.status === 'réservé').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Reserved' : 'Réservés'}</div>
            </div>
            <Home className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {properties.filter(p => p.status === 'vendu').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Sold' : 'Vendus'}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search properties...' : 'Rechercher des propriétés...'}
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
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
            <option value="disponible">{language === 'en' ? 'Available' : 'Disponible'}</option>
            <option value="réservé">{language === 'en' ? 'Reserved' : 'Réservé'}</option>
            <option value="vendu">{language === 'en' ? 'Sold' : 'Vendu'}</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredProperties.length} {language === 'en' ? 'properties found' : 'propriétés trouvées'}
          </div>
        </div>
      </div>

      {/* Add/Edit Property Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProperty 
                    ? (language === 'en' ? 'Edit Property' : 'Modifier le Bien')
                    : (language === 'en' ? 'Add New Property' : 'Ajouter un Nouveau Bien')
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Basic Information' : 'Informations de Base'}
                    </h3>
                    
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
                        placeholder={language === 'en' ? 'Property title' : 'Titre de la propriété'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Description' : 'Description'}
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                        placeholder={language === 'en' ? 'Property description' : 'Description de la propriété'}
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
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Status' : 'Statut'} *
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                        >
                          <option value="disponible">{language === 'en' ? 'Available' : 'Disponible'}</option>
                          <option value="réservé">{language === 'en' ? 'Reserved' : 'Réservé'}</option>
                          <option value="vendu">{language === 'en' ? 'Sold' : 'Vendu'}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Location & Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'en' ? 'Location & Details' : 'Localisation & Détails'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'City' : 'Ville'} *
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                        >
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Area (m²)' : 'Surface (m²)'}
                        </label>
                        <input
                          type="number"
                          value={formData.area_sqm}
                          onChange={(e) => setFormData(prev => ({ ...prev, area_sqm: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                          placeholder="500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Location' : 'Localisation'} *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                        placeholder={language === 'en' ? 'Specific location/neighborhood' : 'Localisation spécifique/quartier'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Price (XAF)' : 'Prix (FCFA)'} *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                        placeholder="15000000"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Latitude' : 'Latitude'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                          placeholder="4.051056"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Longitude' : 'Longitude'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                          placeholder="9.767869"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media & Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'en' ? 'Media & Features' : 'Médias & Caractéristiques'}
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Images (URLs separated by commas)' : 'Images (URLs séparées par des virgules)'}
                    </label>
                    <textarea
                      value={formData.images}
                      onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Presentation Video URL' : 'URL Vidéo de Présentation'}
                    </label>
                    <input
                      type="url"
                      value={formData.presentation_video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, presentation_video_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Features (separated by commas)' : 'Caractéristiques (séparées par des virgules)'}
                    </label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                      placeholder={language === 'en' ? 'water, electricity, security, garden' : 'eau courante, électricité, sécurité, jardin'}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === 'en' ? 'Saving...' : 'Sauvegarde...'}
                      </div>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        {editingProperty 
                          ? (language === 'en' ? 'Update Property' : 'Mettre à Jour')
                          : (language === 'en' ? 'Add Property' : 'Ajouter le Bien')
                        }
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <X className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Property' : 'Bien'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Type' : 'Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Location' : 'Localisation'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Price' : 'Prix'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Status' : 'Statut'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Actions' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map(property => {
                const TypeIcon = getTypeIcon(property.type || property.property_type);
                return (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={property.property_images?.[0]?.image_url || 
                               property.images?.[0] || 
                               'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                          alt={property.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.area_sqm ? `${property.area_sqm} m²` : 'Surface non spécifiée'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="h-4 w-4 mr-2 text-geocasa-blue" />
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {property.property_type || property.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-1 text-geocasa-orange" />
                        <div>
                          <div className="font-medium">{property.city}</div>
                          <div className="text-gray-500 text-xs">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-geocasa-blue">
                      {formatPrice(property.price || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status || 'disponible')}`}>
                        {property.status || 'disponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(property)}
                          className="text-geocasa-blue hover:text-geocasa-blue-dark p-2 rounded-lg hover:bg-blue-50 transition-all"
                          title={language === 'en' ? 'View' : 'Voir'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(property)}
                          className="text-geocasa-orange hover:text-geocasa-orange-dark p-2 rounded-lg hover:bg-orange-50 transition-all"
                          title={language === 'en' ? 'Edit' : 'Modifier'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                          title={language === 'en' ? 'Delete' : 'Supprimer'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No properties found' : 'Aucune propriété trouvée'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Try adjusting your filters or add a new property'
                : 'Essayez d\'ajuster vos filtres ou ajoutez une nouvelle propriété'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
            >
              {language === 'en' ? 'Add First Property' : 'Ajouter la Première Propriété'}
            </button>
          </div>
        )}
      </div>

      {/* Property View Modal */}
      {viewingProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'Property Details' : 'Détails de la Propriété'}
                </h2>
                <button
                  onClick={() => setViewingProperty(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {(viewingProperty.property_images || viewingProperty.images || []).slice(0, 4).map((image: string, index: number) => (
                      <img 
                        key={index}
                        src={typeof image === 'string' ? image : image.image_url}
                        alt={`${viewingProperty.title} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  
                  {viewingProperty.presentation_video_url && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={viewingProperty.presentation_video_url}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Property Video"
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{viewingProperty.title}</h3>
                    <p className="text-gray-700">{viewingProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Type' : 'Type'}</div>
                      <div className="font-semibold capitalize">{viewingProperty.type || viewingProperty.property_type}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Status' : 'Statut'}</div>
                      <div className="font-semibold capitalize">{viewingProperty.status}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Area' : 'Surface'}</div>
                      <div className="font-semibold">{viewingProperty.area_sqm} m²</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">{language === 'en' ? 'Price' : 'Prix'}</div>
                      <div className="font-semibold text-geocasa-blue">{formatPrice(viewingProperty.price || 0)}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">{language === 'en' ? 'Location' : 'Localisation'}</div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-geocasa-orange" />
                      <span className="font-semibold">{viewingProperty.location}, {viewingProperty.city}</span>
                    </div>
                  </div>

                  {viewingProperty.features && viewingProperty.features.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">{language === 'en' ? 'Features' : 'Caractéristiques'}</div>
                      <div className="flex flex-wrap gap-2">
                        {viewingProperty.features.map((feature: string, index: number) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setViewingProperty(null);
                        handleEdit(viewingProperty);
                      }}
                      className="flex-1 bg-geocasa-blue text-white py-2 px-4 rounded-lg hover:bg-geocasa-blue-dark transition-colors flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Edit' : 'Modifier'}
                    </button>
                    <button
                      onClick={() => {
                        setViewingProperty(null);
                        handleDelete(viewingProperty.id);
                      }}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Delete' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;