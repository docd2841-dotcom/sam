import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const TransactionManagement: React.FC = () => {
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        // Mock transactions for development
        const mockTransactions = [
          {
            id: 'txn-1',
            user: { first_name: 'Jean', last_name: 'Dupont', email: 'jean@example.com' },
            property: { title: 'Terrain à bâtir - Zone résidentielle Douala', location: 'Akwa, Douala' },
            transaction_type: 'achat',
            total_amount: 15000000,
            amount_paid: 5000000,
            amount_remaining: 10000000,
            status: 'en cours',
            installments_allowed: true,
            number_of_installments: 10,
            next_payment_date: '2024-02-15',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 'txn-2',
            user: { first_name: 'Marie', last_name: 'Martin', email: 'marie@example.com' },
            property: { title: 'Villa moderne 4 chambres Douala', location: 'Bonneko, Douala' },
            transaction_type: 'réservation',
            total_amount: 45000000,
            amount_paid: 2250000,
            amount_remaining: 42750000,
            status: 'en attente',
            installments_allowed: false,
            number_of_installments: 1,
            next_payment_date: '2024-02-01',
            created_at: '2024-01-20T14:30:00Z'
          }
        ];
        setTransactions(mockTransactions);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email,
            phone
          ),
          properties (
            title,
            location,
            city,
            type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(language === 'en' ? 'Error loading transactions' : 'Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock status update
        setTransactions(prev => prev.map(txn => 
          txn.id === transactionId ? { ...txn, status: newStatus } : txn
        ));
        toast.success(language === 'en' ? 'Transaction status updated' : 'Statut de transaction mis à jour');
        return;
      }

      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId);

      if (error) throw error;

      await fetchTransactions();
      toast.success(language === 'en' ? 'Transaction status updated' : 'Statut de transaction mis à jour');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(language === 'en' ? 'Error updating transaction' : 'Erreur lors de la mise à jour');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
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
      case 'completé':
        return 'bg-green-100 text-green-800';
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completé':
        return <CheckCircle className="h-4 w-4" />;
      case 'en cours':
        return <Clock className="h-4 w-4" />;
      case 'en attente':
        return <Clock className="h-4 w-4" />;
      case 'annulé':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalRevenue = transactions
    .filter(t => t.status === 'completé')
    .reduce((sum, t) => sum + (t.amount_paid || 0), 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'en attente' || t.status === 'en cours')
    .reduce((sum, t) => sum + (t.amount_remaining || 0), 0);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Transaction Management' : 'Gestion des Transactions'}
        </h1>
        <p className="text-gray-600">
          {language === 'en' ? 'Monitor all transactions and payments' : 'Surveillez toutes les transactions et paiements'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">{transactions.length}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Transactions' : 'Total Transactions'}</div>
            </div>
            <CreditCard className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.status === 'completé').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Completed' : 'Terminées'}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-geocasa-orange">{formatPrice(totalRevenue)}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Revenue' : 'Revenus Totaux'}</div>
            </div>
            <DollarSign className="h-8 w-8 text-geocasa-orange" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-yellow-600">{formatPrice(pendingAmount)}</div>
              <div className="text-gray-600">{language === 'en' ? 'Pending Amount' : 'Montant en Attente'}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
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
              placeholder={language === 'en' ? 'Search transactions...' : 'Rechercher des transactions...'}
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
            <option value="achat">{language === 'en' ? 'Purchase' : 'Achat'}</option>
            <option value="réservation">{language === 'en' ? 'Reservation' : 'Réservation'}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
            <option value="en attente">{language === 'en' ? 'Pending' : 'En Attente'}</option>
            <option value="en cours">{language === 'en' ? 'In Progress' : 'En Cours'}</option>
            <option value="completé">{language === 'en' ? 'Completed' : 'Terminé'}</option>
            <option value="annulé">{language === 'en' ? 'Cancelled' : 'Annulé'}</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredTransactions.length} {language === 'en' ? 'transactions found' : 'transactions trouvées'}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Transaction' : 'Transaction'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Client' : 'Client'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Property' : 'Propriété'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Amount' : 'Montant'}
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
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.transaction_type === 'achat' 
                          ? (language === 'en' ? 'Purchase' : 'Achat')
                          : (language === 'en' ? 'Reservation' : 'Réservation')
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.user?.first_name} {transaction.user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{transaction.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-geocasa-blue" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {transaction.property?.title}
                        </div>
                        <div className="text-sm text-gray-500">{transaction.property?.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-geocasa-blue">
                        {formatPrice(transaction.total_amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'en' ? 'Paid:' : 'Payé:'} {formatPrice(transaction.amount_paid)}
                      </div>
                      {transaction.amount_remaining > 0 && (
                        <div className="text-xs text-geocasa-orange">
                          {language === 'en' ? 'Remaining:' : 'Restant:'} {formatPrice(transaction.amount_remaining)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-geocasa-blue hover:text-geocasa-blue-dark p-2 rounded-lg hover:bg-blue-50 transition-all"
                        title={language === 'en' ? 'View Details' : 'Voir les Détails'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {transaction.status === 'en attente' && (
                        <button 
                          onClick={() => updateTransactionStatus(transaction.id, 'en cours')}
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-all"
                          title={language === 'en' ? 'Approve' : 'Approuver'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(transaction.status === 'en attente' || transaction.status === 'en cours') && (
                        <button 
                          onClick={() => updateTransactionStatus(transaction.id, 'annulé')}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all"
                          title={language === 'en' ? 'Cancel' : 'Annuler'}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button 
                        className="text-geocasa-orange hover:text-geocasa-orange-dark p-2 rounded-lg hover:bg-orange-50 transition-all"
                        title={language === 'en' ? 'Download Receipt' : 'Télécharger le Reçu'}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No transactions found' : 'Aucune transaction trouvée'}
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
    </div>
  );
};

export default TransactionManagement;