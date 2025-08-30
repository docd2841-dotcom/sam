import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Shield,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';
import { supabase, isSupabaseConfigured, mockUsers } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const { language } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'client'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        // Use mock users for development
        const storedUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const allUsers = [...mockUsers, ...storedUsers];
        setUsers(allUsers);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          admins (
            role,
            department,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(language === 'en' ? 'Error loading users' : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock user status toggle
        const storedUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const allUsers = [...mockUsers, ...storedUsers];
        const updatedUsers = allUsers.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        );
        
        // Update stored users (excluding mock users)
        const updatedStoredUsers = updatedUsers.filter(user => 
          !mockUsers.find(mockUser => mockUser.id === user.id)
        );
        localStorage.setItem('geocasa_mock_users', JSON.stringify(updatedStoredUsers));
        
        setUsers(updatedUsers);
        toast.success(language === 'en' ? 'User status updated' : 'Statut utilisateur mis à jour');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      toast.success(language === 'en' ? 'User status updated' : 'Statut utilisateur mis à jour');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(language === 'en' ? 'Error updating user' : 'Erreur lors de la mise à jour');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        // Mock user deletion
        const storedUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const filteredUsers = storedUsers.filter((user: any) => user.id !== userId);
        localStorage.setItem('geocasa_mock_users', JSON.stringify(filteredUsers));
        
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success(language === 'en' ? 'User deleted successfully' : 'Utilisateur supprimé avec succès');
        return;
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      toast.success(language === 'en' ? 'User deleted successfully' : 'Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(language === 'en' ? 'Error deleting user' : 'Erreur lors de la suppression');
    }
  };

  const handleViewUser = (user: any) => {
    setViewingUser(user);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isSupabaseConfigured()) {
        // Mock user creation
        const storedUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const newUser = {
          id: `user-${Date.now()}`,
          ...newUserForm,
          password_hash: newUserForm.password,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('geocasa_mock_users', JSON.stringify(storedUsers));
        
        await fetchUsers();
        setShowAddUserForm(false);
        setNewUserForm({
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone: '',
          role: 'client'
        });
        toast.success(language === 'en' ? 'User added successfully' : 'Utilisateur ajouté avec succès');
        return;
      }

      const { error } = await supabase
        .from('users')
        .insert({
          username: newUserForm.username,
          email: newUserForm.email,
          password_hash: newUserForm.password,
          first_name: newUserForm.first_name,
          last_name: newUserForm.last_name,
          phone: newUserForm.phone
        });

      if (error) throw error;

      // Add admin role if needed
      if (newUserForm.role !== 'client') {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', newUserForm.email)
          .single();

        if (userData) {
          await supabase
            .from('admins')
            .insert({
              user_id: userData.id,
              role: newUserForm.role
            });
        }
      }

      await fetchUsers();
      setShowAddUserForm(false);
      setNewUserForm({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'client'
      });
      toast.success(language === 'en' ? 'User added successfully' : 'Utilisateur ajouté avec succès');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(language === 'en' ? 'Error adding user' : 'Erreur lors de l\'ajout');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = user.admins?.[0]?.role || 'client';
    const matchesRole = filterRole === 'all' || userRole === filterRole;
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserRole = (user: any) => {
    return user.admins?.[0]?.role || 'client';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
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
            {language === 'en' ? 'User Management' : 'Gestion des Utilisateurs'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Manage all platform users' : 'Gérez tous les utilisateurs de la plateforme'}
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-3 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Add User' : 'Ajouter un Utilisateur'}
          onClick={() => setShowAddUserForm(true)}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">{users.length}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Users' : 'Total Utilisateurs'}</div>
            </div>
            <Users className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Active Users' : 'Utilisateurs Actifs'}</div>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => getUserRole(u) === 'admin').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Administrators' : 'Administrateurs'}</div>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-orange">
                {users.filter(u => getUserRole(u) === 'client').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Clients' : 'Clients'}</div>
            </div>
            <Users className="h-8 w-8 text-geocasa-orange" />
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
              placeholder={language === 'en' ? 'Search users...' : 'Rechercher des utilisateurs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Roles' : 'Tous les Rôles'}</option>
            <option value="client">{language === 'en' ? 'Clients' : 'Clients'}</option>
            <option value="admin">{language === 'en' ? 'Administrators' : 'Administrateurs'}</option>
            <option value="manager">{language === 'en' ? 'Managers' : 'Gestionnaires'}</option>
            <option value="staff">{language === 'en' ? 'Staff' : 'Personnel'}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
            <option value="active">{language === 'en' ? 'Active' : 'Actifs'}</option>
            <option value="inactive">{language === 'en' ? 'Inactive' : 'Inactifs'}</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredUsers.length} {language === 'en' ? 'users found' : 'utilisateurs trouvés'}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'User' : 'Utilisateur'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Contact' : 'Contact'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Role' : 'Rôle'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Status' : 'Statut'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Joined' : 'Inscription'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Actions' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => {
                const role = getUserRole(user);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mr-4">
                          {user.profile_image_url ? (
                            <img 
                              src={user.profile_image_url} 
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
                        {role === 'client' ? (language === 'en' ? 'Client' : 'Client') :
                         role === 'admin' ? (language === 'en' ? 'Admin' : 'Admin') :
                         role === 'manager' ? (language === 'en' ? 'Manager' : 'Gestionnaire') :
                         role === 'staff' ? (language === 'en' ? 'Staff' : 'Personnel') : role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${user.is_active ? 'text-green-800' : 'text-red-800'}`}>
                          {user.is_active 
                            ? (language === 'en' ? 'Active' : 'Actif')
                            : (language === 'en' ? 'Inactive' : 'Inactif')
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-geocasa-blue hover:text-geocasa-blue-dark p-2 rounded-lg hover:bg-blue-50 transition-all"
                          title={language === 'en' ? 'View Details' : 'Voir les Détails'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-geocasa-orange hover:text-geocasa-orange-dark p-2 rounded-lg hover:bg-orange-50 transition-all"
                          title={language === 'en' ? 'Edit User' : 'Modifier l\'Utilisateur'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`p-2 rounded-lg transition-all ${
                            user.is_active 
                              ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                          title={user.is_active 
                            ? (language === 'en' ? 'Deactivate User' : 'Désactiver l\'Utilisateur')
                            : (language === 'en' ? 'Activate User' : 'Activer l\'Utilisateur')
                          }
                        >
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                          title={language === 'en' ? 'Delete User' : 'Supprimer l\'Utilisateur'}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No users found' : 'Aucun utilisateur trouvé'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Try adjusting your filters'
                : 'Essayez d\'ajuster vos filtres'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'Add New User' : 'Ajouter un Nouvel Utilisateur'}
                </h2>
                <button
                  onClick={() => setShowAddUserForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Username' : 'Nom d\'utilisateur'} *
                    </label>
                    <input
                      type="text"
                      value={newUserForm.username}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'First Name' : 'Prénom'} *
                    </label>
                    <input
                      type="text"
                      value={newUserForm.first_name}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Last Name' : 'Nom'} *
                    </label>
                    <input
                      type="text"
                      value={newUserForm.last_name}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Phone' : 'Téléphone'}
                    </label>
                    <input
                      type="tel"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Role' : 'Rôle'} *
                    </label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                    >
                      <option value="client">{language === 'en' ? 'Client' : 'Client'}</option>
                      <option value="staff">{language === 'en' ? 'Staff' : 'Personnel'}</option>
                      <option value="manager">{language === 'en' ? 'Manager' : 'Gestionnaire'}</option>
                      <option value="admin">{language === 'en' ? 'Administrator' : 'Administrateur'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Password' : 'Mot de passe'} *
                  </label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white py-3 px-6 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
                  >
                    {language === 'en' ? 'Add User' : 'Ajouter l\'Utilisateur'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
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

      {/* User View Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'User Details' : 'Détails de l\'Utilisateur'}
                </h2>
                <button
                  onClick={() => setViewingUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Profile */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    {viewingUser.profile_image_url ? (
                      <img 
                        src={viewingUser.profile_image_url} 
                        alt={`${viewingUser.first_name} ${viewingUser.last_name}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {viewingUser.first_name?.[0]}{viewingUser.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {viewingUser.first_name} {viewingUser.last_name}
                  </h3>
                  <p className="text-gray-600">@{viewingUser.username}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(getUserRole(viewingUser))}`}>
                    {getUserRole(viewingUser)}
                  </span>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{viewingUser.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Phone' : 'Téléphone'}
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{viewingUser.phone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Registration Date' : 'Date d\'inscription'}
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{new Date(viewingUser.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Status' : 'Statut'}
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full mr-2 ${viewingUser.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{viewingUser.is_active ? (language === 'en' ? 'Active' : 'Actif') : (language === 'en' ? 'Inactive' : 'Inactif')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => toggleUserStatus(viewingUser.id, viewingUser.is_active)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                      viewingUser.is_active 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {viewingUser.is_active ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                    {viewingUser.is_active 
                      ? (language === 'en' ? 'Deactivate' : 'Désactiver')
                      : (language === 'en' ? 'Activate' : 'Activer')
                    }
                  </button>
                  <button
                    onClick={() => {
                      setViewingUser(null);
                      deleteUser(viewingUser.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Delete' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;