import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccountTree } from './api';
import { Network, Plus, RefreshCw, FolderTree, Folder } from 'lucide-react';

export default function AccountsTree() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchAccounts();
  }, [source]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAccountTree(source);
      setAccounts(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Helper to structure flat list into a tree
  const buildTree = (items) => {
    const map = {};
    const roots = [];
    
    // First pass: map all items
    items.forEach(item => {
      map[item.account_code] = { ...item, children: [] };
    });
    
    // Second pass: connect children to parents
    items.forEach(item => {
      const node = map[item.account_code];
      const parentCode = item.account_code.length > 1 
        ? item.account_code.substring(0, item.account_code.length - 1)
        : null;
        
      if (parentCode && map[parentCode]) {
        map[parentCode].children.push(node);
      } else {
        roots.push(node);
      }
    });
    
    return roots;
  };

  const tree = buildTree(accounts);

  const renderNode = (node) => (
    <div key={node.account_code} className="ml-6 mt-2 border-l-2 border-border/50 pl-4">
      <div className="flex items-center justify-between p-3 glass rounded-xl hover:border-cyan-500/30 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="text-cyan-500">
            {node.children.length > 0 ? <FolderTree size={18} /> : <Folder size={18} />}
          </div>
          <div>
            <span className="font-semibold text-foreground">{node.account_name_ar}</span>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{node.account_code}</span>
          </div>
        </div>
        <div className="font-bold text-cyan-500">
          {node.account_start_money ? \\ EGP\ : ''}
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map(child => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl">
            <Network size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {t('menus.public_accounts')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Chart of Accounts hierarchy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={source} 
            onChange={(e) => setSource(e.target.value)}
            className="input max-w-[150px]"
          >
            <option value="elsanta">{t('branches.elsanta')}</option>
            <option value="mashala">{t('branches.mashala')}</option>
          </select>
          <button className="btn bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 border-0">
            <Plus size={18} className="mr-2" />
            Add Account
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-border/50 p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-cyan-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="-ml-6">
            {tree.length > 0 ? tree.map(root => renderNode(root)) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground ml-6">
                <Network size={48} className="mb-4 opacity-20" />
                <p>No accounts found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
