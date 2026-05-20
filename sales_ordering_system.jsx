import React, { useState, useEffect } from 'react';

export default function SalesOrderingSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    customerName: '',
    sampleDetails: '',
    quantity: '',
    contactPerson: '',
    notes: ''
  });

  // Load orders from storage
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await window.storage.get('sales-orders');
        if (result?.value) {
          setOrders(JSON.parse(result.value));
        }
      } catch (e) {
        console.log('Starting with empty orders');
      }
    };
    loadOrders();
  }, []);

  // Save orders to storage
  const saveOrders = async (newOrders) => {
    setOrders(newOrders);
    try {
      await window.storage.set('sales-orders', JSON.stringify(newOrders));
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  // Order statuses representing the sales process
  const ORDER_STATUSES = [
    'Sample Collection',
    'In R&D',
    'Product Testing',
    'Order Confirmed',
    'Dispatch',
    'Completed'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Sample Collection': '#EF9F27',
      'In R&D': '#378ADD',
      'Product Testing': '#E24B4A',
      'Order Confirmed': '#3B6D11',
      'Dispatch': '#534AB7',
      'Completed': '#0F6E56'
    };
    return colors[status] || '#888780';
  };

  const addOrder = () => {
    if (!formData.customerName.trim() || !formData.sampleDetails.trim()) {
      alert('Please fill in customer name and sample details');
      return;
    }

    const order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: formData.customerName,
      contactPerson: formData.contactPerson,
      sampleDetails: formData.sampleDetails,
      quantity: formData.quantity || '-',
      notes: formData.notes,
      status: 'Sample Collection',
      createdDate: new Date().toLocaleDateString('en-IN'),
      createdTime: new Date().toLocaleTimeString('en-IN'),
      updatedDate: new Date().toLocaleDateString('en-IN')
    };

    saveOrders([...orders, order]);
    setFormData({ customerName: '', sampleDetails: '', quantity: '', contactPerson: '', notes: '' });
    setShowForm(false);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    saveOrders(orders.map(o =>
      o.id === orderId
        ? { ...o, status: newStatus, updatedDate: new Date().toLocaleDateString('en-IN') }
        : o
    ));
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const deleteOrder = (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      saveOrders(orders.filter(o => o.id !== orderId));
    }
  };

  // Calculate metrics
  const metrics = {
    total: orders.length,
    pending: orders.filter(o => !['Order Confirmed', 'Completed'].includes(o.status)).length,
    confirmed: orders.filter(o => o.status === 'Order Confirmed').length,
    inDispatch: orders.filter(o => o.status === 'Dispatch').length,
    customers: new Set(orders.map(o => o.customerName)).size
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = order.customerName.toLowerCase().includes(search) ||
                         order.id.toLowerCase().includes(search) ||
                         order.contactPerson.toLowerCase().includes(search);
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  // Status breakdown for chart
  const getStatusBreakdown = () => {
    const breakdown = {};
    ORDER_STATUSES.forEach(status => {
      breakdown[status] = orders.filter(o => o.status === status).length;
    });
    return breakdown;
  };

  const statusBreakdown = getStatusBreakdown();

  return (
    <div style={{ width: '100%', background: 'var(--color-background-primary)', minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; }
        .app-header { background: linear-gradient(135deg, var(--color-background-secondary), var(--color-background-secondary)); border-bottom: 1px solid var(--color-border-tertiary); padding: 20px; }
        .header-content h1 { margin: 0; font-size: 24px; font-weight: 500; color: var(--color-text-primary); }
        .header-sub { font-size: 13px; color: var(--color-text-secondary); margin-top: 4px; }
        .navigation { display: flex; background: var(--color-background-primary); border-bottom: 1px solid var(--color-border-tertiary); }
        .nav-btn { flex: 1; padding: 12px 16px; border: none; background: transparent; color: var(--color-text-secondary); cursor: pointer; font-size: 14px; font-weight: 500; border-bottom: 3px solid transparent; transition: 0.2s; text-align: center; }
        .nav-btn.active { color: var(--color-text-info); border-bottom-color: var(--color-text-info); }
        .nav-btn:hover { background: var(--color-background-secondary); }
        .main-content { padding: 20px; max-width: 1400px; margin: 0 auto; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .metric-card { background: var(--color-background-secondary); padding: 18px; border-radius: var(--border-radius-lg); border: 1px solid var(--color-border-tertiary); }
        .metric-card h3 { margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 32px; font-weight: 500; color: var(--color-text-primary); }
        .metric-change { font-size: 12px; color: var(--color-text-secondary); margin-top: 6px; }
        .section-title { font-size: 16px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 16px; }
        .controls { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .search-box { flex: 1; min-width: 220px; padding: 9px 12px; border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); font-size: 14px; background: var(--color-background-primary); color: var(--color-text-primary); }
        .filter-box { padding: 9px 12px; border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); font-size: 14px; background: var(--color-background-primary); color: var(--color-text-primary); cursor: pointer; }
        .btn { padding: 10px 16px; border: none; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .btn-primary { background: var(--color-text-info); color: white; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary { background: var(--color-background-secondary); color: var(--color-text-primary); border: 1px solid var(--color-border-secondary); }
        .btn-secondary:hover { background: var(--color-border-tertiary); }
        .btn-small { padding: 6px 10px; font-size: 12px; }
        .btn-danger { background: var(--color-text-danger); color: white; }
        .btn-danger:hover { opacity: 0.9; }
        .table-container { overflow-x: auto; border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); background: var(--color-background-primary); }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background: var(--color-background-secondary); padding: 12px 14px; text-align: left; font-size: 12px; font-weight: 500; color: var(--color-text-secondary); border-bottom: 1px solid var(--color-border-tertiary); white-space: nowrap; }
        .table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border-tertiary); font-size: 13px; color: var(--color-text-primary); }
        .table tbody tr:hover { background: var(--color-background-secondary); }
        .order-id { font-family: var(--font-mono); font-weight: 500; color: var(--color-text-info); }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; color: white; }
        .action-buttons { display: flex; gap: 6px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-box { background: var(--color-background-primary); padding: 24px; border-radius: var(--border-radius-lg); max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
        .modal-title { font-size: 18px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 6px; }
        .form-input { width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); font-size: 14px; background: var(--color-background-secondary); color: var(--color-text-primary); }
        .form-input:focus { outline: none; border-color: var(--color-text-info); }
        .form-input::placeholder { color: var(--color-text-tertiary); }
        .form-buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .status-options { display: flex; flex-direction: column; gap: 8px; }
        .status-option { padding: 12px; border: 1px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); cursor: pointer; text-align: center; transition: 0.2s; }
        .status-option:hover { background: var(--color-background-secondary); }
        .empty-state { text-align: center; padding: 60px 20px; color: var(--color-text-secondary); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .breakdown-list { list-style: none; padding: 0; margin: 0; }
        .breakdown-item { padding: 10px 0; display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-tertiary); font-size: 14px; }
        .breakdown-item:last-child { border-bottom: none; }
        .breakdown-bar { flex: 1; margin: 0 12px; background: var(--color-background-secondary); height: 20px; border-radius: 3px; overflow: hidden; }
        .breakdown-fill { height: 100%; background: var(--color-text-info); }
      `}
      </style>

      <div className="app-header">
        <div className="header-content">
          <h1>Sales Ordering Center</h1>
          <div className="header-sub">Manage orders, track samples, and monitor fulfillment</div>
        </div>
      </div>

      <div className="navigation">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          All Orders
        </button>
        <button
          className={`nav-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Order
        </button>
      </div>

      <div className="main-content">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="dashboard-grid">
              <div className="metric-card">
                <h3>Total Orders</h3>
                <div className="metric-value">{metrics.total}</div>
                <div className="metric-change">All orders in system</div>
              </div>
              <div className="metric-card">
                <h3>Pending Orders</h3>
                <div className="metric-value" style={{ color: '#D85A30' }}>{metrics.pending}</div>
                <div className="metric-change">Awaiting completion</div>
              </div>
              <div className="metric-card">
                <h3>Confirmed Orders</h3>
                <div className="metric-value" style={{ color: '#3B6D11' }}>{metrics.confirmed}</div>
                <div className="metric-change">Ready for fulfillment</div>
              </div>
              <div className="metric-card">
                <h3>In Dispatch</h3>
                <div className="metric-value" style={{ color: '#534AB7' }}>{metrics.inDispatch}</div>
                <div className="metric-change">Being shipped</div>
              </div>
              <div className="metric-card">
                <h3>Unique Customers</h3>
                <div className="metric-value">{metrics.customers}</div>
                <div className="metric-change">Total customer base</div>
              </div>
            </div>

            <div className="section-title">Order Status Breakdown</div>
            <div style={{ background: 'var(--color-background-secondary)', padding: '20px', borderRadius: 'var(--border-radius-lg)', marginBottom: '20px' }}>
              <ul className="breakdown-list">
                {ORDER_STATUSES.map(status => (
                  <li className="breakdown-item" key={status}>
                    <span style={{ minWidth: '140px' }}>{status}</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{
                          width: orders.length > 0 ? `${(statusBreakdown[status] / orders.length) * 100}%` : '0%',
                          background: getStatusColor(status)
                        }}
                      ></div>
                    </div>
                    <span style={{ minWidth: '30px', textAlign: 'right' }}>{statusBreakdown[status]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="section-title">Recent Orders</div>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No orders yet. Create your first order to get started.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('new')}>
                  Create New Order
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td><span className="order-id">{order.id}</span></td>
                        <td>{order.customerName}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.createdDate}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <div className="controls">
              <input
                type="text"
                className="search-box"
                placeholder="Search by customer name, order ID, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-box"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {ORDER_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setActiveTab('new');
                  setShowForm(true);
                }}
              >
                + New Order
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>{searchTerm || filterStatus !== 'all' ? 'No orders match your filters.' : 'No orders created yet.'}</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Sample Details</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td><span className="order-id">{order.id}</span></td>
                        <td><strong>{order.customerName}</strong></td>
                        <td>{order.contactPerson || '-'}</td>
                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.sampleDetails}
                        </td>
                        <td>{order.quantity}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.createdDate}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary btn-small"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowStatusModal(true);
                              }}
                              title="Update Status"
                            >
                              ⚙️
                            </button>
                            <button
                              className="btn btn-danger btn-small"
                              onClick={() => deleteOrder(order.id)}
                              title="Delete Order"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        )}

        {/* NEW ORDER TAB */}
        {activeTab === 'new' && (
          <div>
            <div className="section-title">Create New Order</div>
            <div style={{ background: 'var(--color-background-secondary)', padding: '24px', borderRadius: 'var(--border-radius-lg)', maxWidth: '600px' }}>
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Name of contact person"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sample Details *</label>
                <textarea
                  className="form-input"
                  placeholder="Describe the sample (color, size, texture, requirements, etc.)"
                  rows="4"
                  value={formData.sampleDetails}
                  onChange={(e) => setFormData({ ...formData, sampleDetails: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 100 units, 50 kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-input"
                  placeholder="Any special instructions or notes"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setFormData({ customerName: '', contactPerson: '', sampleDetails: '', quantity: '', notes: '' })}
                >
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={addOrder}
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => { setShowStatusModal(false); setSelectedOrder(null); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Update Order Status</div>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-md)', fontSize: '13px' }}>
              <div><strong>{selectedOrder.customerName}</strong></div>
              <div style={{ color: 'var(--color-text-secondary)' }}>{selectedOrder.id}</div>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Current: {selectedOrder.status}</div>
            </div>

            <div className="section-title" style={{ fontSize: '14px', marginBottom: '12px' }}>Select New Status</div>
            <div className="status-options">
              {ORDER_STATUSES.map(status => (
                <button
                  key={status}
                  className="status-option"
                  onClick={() => updateOrderStatus(selectedOrder.id, status)}
                  style={{
                    backgroundColor: selectedOrder.status === status ? getStatusColor(status) + '20' : 'transparent',
                    borderColor: selectedOrder.status === status ? getStatusColor(status) : 'var(--color-border-tertiary)',
                    color: selectedOrder.status === status ? getStatusColor(status) : 'var(--color-text-primary)'
                  }}
                >
                  <strong style={{ fontSize: '13px' }}>{status}</strong>
                </button>
              ))}
            </div>

            <div className="form-buttons" style={{ marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => { setShowStatusModal(false); setSelectedOrder(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}