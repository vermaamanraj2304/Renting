import React, { useState } from 'react';
import { 
  Home, Search, Users, Wallet, Percent, Settings, LogOut, 
  Clock, Compass, Bed, PlusCircle, Calendar, TrendingUp, 
  UserCheck, Bell, Key, Check, Mail, FileText, CheckCircle, 
  MessageSquare, Plus, Award, Briefcase, RefreshCw, Eye
} from 'lucide-react';

function App() {
  // Prototype control states
  const [activeRoles, setActiveRoles] = useState({
    customer: true,
    owner: false,
    broker: false
  });
  const [currentFlow, setCurrentFlow] = useState('dashboard'); // 'auth' or 'dashboard'
  
  // Auth screen specific state
  const [authView, setAuthView] = useState('signin'); // 'signin', 'register', 'forgot', 'submitotp'
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    confirmPassword: '',
    referral: ''
  });

  // Sidebar navigation active state
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');

  // Handle dynamic role change
  const handleRoleToggle = (role) => {
    setActiveRoles(prev => {
      const updated = { ...prev, [role]: !prev[role] };
      // Keep at least one role active
      if (!updated.customer && !updated.owner && !updated.broker) {
        return prev;
      }
      return updated;
    });
  };

  // Check if multiple roles are active
  const isMultiRole = Object.values(activeRoles).filter(Boolean).length > 1;

  // Sidebar dynamic menu structure
  const getSidebarMenu = () => {
    const menu = [
      { label: 'Dashboard', icon: Home, roles: ['customer', 'owner', 'broker'] },
      { label: 'Search', icon: Search, roles: ['customer', 'owner', 'broker'] },
      { label: 'PG & Coliving', icon: Bed, roles: ['customer', 'owner', 'broker'] },
      { label: 'Flatmates', icon: Users, roles: ['customer', 'owner', 'broker'] },
      { label: 'Furniture', icon: Briefcase, roles: ['customer', 'owner', 'broker'] }
    ];

    if (activeRoles.owner && !activeRoles.broker) {
      menu.push(
        { label: 'My Listings', icon: FileText, roles: ['owner'] },
        { label: 'Leads & Clients', icon: Users, roles: ['owner'] },
        { label: 'Site Visits', icon: Calendar, roles: ['owner'] },
        { label: 'Deals & Bookings', icon: CheckCircle, roles: ['owner'] },
        { label: 'Commision', icon: Percent, roles: ['owner'] },
        { label: 'Reports', icon: TrendingUp, roles: ['owner'] }
      );
    }

    if (activeRoles.broker) {
      menu.push(
        { label: 'My Properties', icon: FileText, roles: ['broker'] },
        { label: 'Tenants', icon: UserCheck, roles: ['broker'] },
        { label: 'Rent Collection', icon: Wallet, roles: ['broker'] },
        { label: 'Maintenance', icon: Settings, roles: ['broker'] }
      );
    }

    if (activeRoles.customer) {
      menu.push(
        { label: 'Rentals', icon: Compass, roles: ['customer'] },
        { label: 'Applications', icon: FileText, roles: ['customer'] },
        { label: 'Bookings', icon: Calendar, roles: ['customer'] }
      );
    }

    // Common items at bottom
    menu.push(
      { label: 'Payments', icon: Wallet, roles: ['customer', 'owner', 'broker'] },
      { label: 'Messages', icon: MessageSquare, roles: ['customer', 'owner', 'broker'] },
      { label: 'Refer & Earn', icon: Award, roles: ['customer', 'owner', 'broker'] },
      { label: 'Support', icon: Settings, roles: ['customer', 'owner', 'broker'] },
      { label: 'Account Settings', icon: Settings, roles: ['customer', 'owner', 'broker'] }
    );

    // Remove duplicates
    const uniqueMenu = [];
    const seen = new Set();
    menu.forEach(item => {
      if (!seen.has(item.label)) {
        seen.add(item.label);
        uniqueMenu.push(item);
      }
    });

    return uniqueMenu;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🛠️ Dynamic Prototype Control Panel Header */}
      <header className="control-bar">
        <div className="control-logo">
          ✨ Renting Carnival Prototype Settings
        </div>
        <div className="control-options">
          <div className="flex gap-4 items-center">
            <span className="text-xs text-gray-400">Toggle User Roles:</span>
            <label className="role-checkbox-label">
              <input 
                type="checkbox" 
                checked={activeRoles.customer} 
                onChange={() => handleRoleToggle('customer')} 
              />
              Customer
            </label>
            <label className="role-checkbox-label">
              <input 
                type="checkbox" 
                checked={activeRoles.owner} 
                onChange={() => handleRoleToggle('owner')} 
              />
              Owner
            </label>
            <label className="role-checkbox-label">
              <input 
                type="checkbox" 
                checked={activeRoles.broker} 
                onChange={() => handleRoleToggle('broker')} 
              />
              Broker
            </label>
          </div>
          <button 
            className="btn-view-toggle flex items-center gap-2"
            onClick={() => setCurrentFlow(prev => prev === 'dashboard' ? 'auth' : 'dashboard')}
          >
            <RefreshCw size={14} />
            Switch to {currentFlow === 'dashboard' ? 'Authentication Flow' : 'Dashboard view'}
          </button>
        </div>
      </header>

      {/* 🚀 Main Presentation Screen */}
      {currentFlow === 'auth' ? (
        <div className="auth-wrapper">
          <div className="auth-container">
            {/* Left Card: Dynamic Forms */}
            <div className="auth-left-panel">
              {/* Tab selector */}
              {(authView === 'signin' || authView === 'register') && (
                <div className="auth-tabs">
                  <button 
                    className={`auth-tab ${authView === 'signin' ? 'active' : ''}`}
                    onClick={() => setAuthView('signin')}
                  >
                    Sign-In
                  </button>
                  <button 
                    className={`auth-tab ${authView === 'register' ? 'active' : ''}`}
                    onClick={() => setAuthView('register')}
                  >
                    Register
                  </button>
                </div>
              )}

              {authView === 'signin' && (
                <form onSubmit={(e) => { e.preventDefault(); setCurrentFlow('dashboard'); }}>
                  <div className="auth-input-group">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="auth-input" 
                      required 
                      value={authForm.email}
                      onChange={e => setAuthForm({...authForm, email: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="auth-input" 
                      required 
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                    />
                  </div>
                  <div className="auth-checkbox-group">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">
                      I agree to Renting Carnival <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                  <button type="submit" className="btn-auth-submit">
                    <Key size={16} /> Login
                  </button>
                  <div className="auth-footer-links">
                    <button 
                      type="button" 
                      className="auth-footer-link"
                      onClick={() => setAuthView('forgot')}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}

              {authView === 'register' && (
                <form onSubmit={(e) => { e.preventDefault(); setAuthView('signin'); }}>
                  <div className="auth-input-group">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="auth-input" 
                      required 
                      value={authForm.fullName}
                      onChange={e => setAuthForm({...authForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="auth-input" 
                      required 
                      value={authForm.email}
                      onChange={e => setAuthForm({...authForm, email: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="auth-input" 
                      required 
                      value={authForm.mobile}
                      onChange={e => setAuthForm({...authForm, mobile: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="auth-input" 
                      required 
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      className="auth-input" 
                      required 
                      value={authForm.confirmPassword}
                      onChange={e => setAuthForm({...authForm, confirmPassword: e.target.value})}
                    />
                  </div>
                  <div className="auth-input-group">
                    <input 
                      type="text" 
                      placeholder="Referral Id (If any)" 
                      className="auth-input" 
                      value={authForm.referral}
                      onChange={e => setAuthForm({...authForm, referral: e.target.value})}
                    />
                  </div>
                  <div className="auth-checkbox-group">
                    <input type="checkbox" id="terms-reg" required />
                    <label htmlFor="terms-reg">
                      I agree to Boss Algo <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                  <button type="submit" className="btn-auth-submit">
                    Register
                  </button>
                  <div className="auth-footer-links">
                    <button 
                      type="button" 
                      className="auth-footer-link"
                      onClick={() => setAuthView('forgot')}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}

              {authView === 'forgot' && (
                <div>
                  <h3 className="text-white text-base font-semibold mb-6 text-center">
                    Please provide your registered email to receive an OTP
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); setAuthView('submitotp'); }}>
                    <div className="auth-input-group">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="auth-input" 
                        required 
                        value={authForm.email}
                        onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="btn-auth-submit">
                      Send OTP
                    </button>
                    <div className="auth-footer-links">
                      <button 
                        type="button" 
                        className="auth-footer-link"
                        onClick={() => setAuthView('signin')}
                      >
                        ALREADY HAVE ACCOUNT?
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {authView === 'submitotp' && (
                <div>
                  <h2 className="onboarding-title" style={{ marginBottom: '16px' }}>FORGOT PASSWORD</h2>
                  <h3 className="text-white text-xs font-normal mb-6 text-center opacity-80">
                    Please provide your registered email to receive an OTP
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); setAuthView('signin'); }}>
                    <div className="auth-input-group">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="auth-input" 
                        required 
                        value={authForm.email}
                        onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      />
                    </div>
                    <div className="auth-input-group">
                      <input 
                        type="text" 
                        placeholder="Enter Otp" 
                        className="auth-input" 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn-auth-submit">
                      <Key size={16} /> Submit OTP
                    </button>
                    <div className="auth-footer-links">
                      <button 
                        type="button" 
                        className="auth-footer-link"
                        onClick={() => setAuthView('signin')}
                      >
                        ALREADY HAVE ACCOUNT?
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Card: Onboarding Side Graphic illustration */}
            <div className="auth-right-panel">
              <h2 className="onboarding-title">
                WELCOME TO RENTING CARNIVAL 👋
              </h2>

              <div className="illustration-arc-container">
                <div className="circle-path-connector"></div>
                
                {/* PG/Coliving */}
                <div className="arc-node node-left">
                  <Bed className="text-purple-600" size={24} />
                </div>
                <div className="node-label label-left">
                  PG / Co-living
                </div>

                {/* Rent properties */}
                <div className="arc-node node-center">
                  <Home className="text-emerald-600" size={24} />
                </div>
                <div className="node-label label-center">
                  Rent Properties
                </div>

                {/* Find Flatmates */}
                <div className="arc-node node-right">
                  <Users className="text-orange-500" size={24} />
                </div>
                <div className="node-label label-right">
                  Find Flatmates
                </div>

                {/* Chair illustration simulation */}
                <div className="armchair-svg-container">
                  <svg className="armchair-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="45" width="60" height="35" rx="10" fill="#7c3aed" />
                    <rect x="15" y="55" width="15" height="25" rx="5" fill="#6d28d9" />
                    <rect x="70" y="55" width="15" height="25" rx="5" fill="#6d28d9" />
                    <rect x="30" y="25" width="40" height="40" rx="8" fill="#7c3aed" />
                    <circle cx="40" cy="35" r="2" fill="#5b21b6" />
                    <circle cx="60" cy="35" r="2" fill="#5b21b6" />
                    <circle cx="50" cy="45" r="2" fill="#5b21b6" />
                    <rect x="25" y="80" width="8" height="10" rx="2" fill="#1f2937" />
                    <rect x="67" y="80" width="8" height="10" rx="2" fill="#1f2937" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-wrapper">
          {/* 1. Left Sidebar Navigation */}
          <aside className="sidebar">
            <div className="sidebar-logo">
              <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
                RC
              </span>
              <span className="sidebar-logo-text">Renting Carnival</span>
            </div>
            
            <ul className="sidebar-menu">
              {getSidebarMenu().map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSidebarItem === item.label;
                return (
                  <li key={index}>
                    <button 
                      className={`sidebar-item-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveSidebarItem(item.label)}
                    >
                      <IconComponent size={18} />
                      <span className="sidebar-text">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="sidebar-footer">
              <div>V1.0 Enterprise Mode</div>
            </div>
          </aside>

          {/* 2. Main Content Dashboard Container */}
          <main className="dashboard-content">
            {/* Header */}
            <header className="dash-header">
              <div className="dash-header-left">
                <h1>Hello Aakash</h1>
                <p>May 19, 2023</p>
              </div>

              <div className="dash-header-right">
                <div className="search-container">
                  <Search className="search-icon-inside" size={16} />
                  <input type="text" placeholder="Search here..." className="search-input" />
                </div>

                <button className="header-action-btn">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="dash-main-container">
              
              {/* Dynamic Actions Grid Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Quick actions</h3>
                <div className="actions-grid">
                  {/* Customer Quick Actions */}
                  {activeRoles.customer && (
                    <>
                      <button className="action-card">
                        <div className="action-card-icon"><Search size={20} /></div>
                        Search Property
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Users size={20} /></div>
                        Find Flatmate
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Briefcase size={20} /></div>
                        Rent Furniture
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><PlusCircle size={20} /></div>
                        Post Flatmate Listing
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><FileText size={20} /></div>
                        My Applications
                      </button>
                    </>
                  )}

                  {/* Owner Quick Actions (Excluding duplicate Broker actions) */}
                  {activeRoles.owner && (
                    <>
                      <button className="action-card">
                        <div className="action-card-icon"><UserCheck size={20} /></div>
                        Become Broker
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Plus size={20} /></div>
                        Add Property
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Home size={20} /></div>
                        My Properties
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Wallet size={20} /></div>
                        Collect Rent
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Users size={20} /></div>
                        Tenant Requests
                      </button>
                    </>
                  )}

                  {/* Broker Quick Actions */}
                  {activeRoles.broker && (
                    <>
                      <button className="action-card">
                        <div className="action-card-icon"><Plus size={20} /></div>
                        Add Listings
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><UserCheck size={20} /></div>
                        Add Client
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Calendar size={20} /></div>
                        Schedule Visit
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Users size={20} /></div>
                        My Leads
                      </button>
                      <button className="action-card">
                        <div className="action-card-icon"><Percent size={20} /></div>
                        View Commission
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Stats Row */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Metrics Overview</h3>
                
                {isMultiRole ? (
                  // Multi role grouped stats
                  <div className="flex flex-col gap-6">
                    {activeRoles.customer && (
                      <div>
                        <div className="role-section-header">As a Customer</div>
                        <div className="stats-grid mt-3">
                          <div className="stat-card">
                            <div className="stat-card-title">Saved Items</div>
                            <div className="stat-card-value">16</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Applications</div>
                            <div className="stat-card-value">4</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Bookings</div>
                            <div className="stat-card-value">1</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Active Rentals</div>
                            <div className="stat-card-value">1</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeRoles.owner && (
                      <div>
                        <div className="role-section-header">As an Owner</div>
                        <div className="stats-grid mt-3">
                          <div className="stat-card">
                            <div className="stat-card-title">Properties</div>
                            <div className="stat-card-value">16</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Occupied</div>
                            <div className="stat-card-value">4</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Monthly Income</div>
                            <div className="stat-card-value">1</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Pending Rent</div>
                            <div className="stat-card-value">1</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeRoles.broker && (
                      <div>
                        <div className="role-section-header">As a Broker</div>
                        <div className="stats-grid mt-3">
                          <div className="stat-card">
                            <div className="stat-card-title">Active Listing</div>
                            <div className="stat-card-value">16</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">New Leads</div>
                            <div className="stat-card-value">4</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Deals Closed</div>
                            <div className="stat-card-value">1</div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-card-title">Commission</div>
                            <div className="stat-card-value">1</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Single role flat stats
                  <div className="stats-grid">
                    {activeRoles.customer && (
                      <>
                        <div className="stat-card">
                          <div className="stat-card-title">Saved Items</div>
                          <div className="stat-card-value">24</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Applications Sent</div>
                          <div className="stat-card-value">5</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Bookings</div>
                          <div className="stat-card-value">2</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Active Rental</div>
                          <div className="stat-card-value">1</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Reward Points</div>
                          <div className="stat-card-value">680</div>
                        </div>
                      </>
                    )}

                    {activeRoles.owner && (
                      <>
                        <div className="stat-card">
                          <div className="stat-card-title">My Properties</div>
                          <div className="stat-card-value">8</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Occupied</div>
                          <div className="stat-card-value">6</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Vacant</div>
                          <div className="stat-card-value">2</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Monthly Rental Income</div>
                          <div className="stat-card-value">99,999</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Pending Rent</div>
                          <div className="stat-card-value">58,600</div>
                        </div>
                      </>
                    )}

                    {activeRoles.broker && (
                      <>
                        <div className="stat-card">
                          <div className="stat-card-title">Active Listing</div>
                          <div className="stat-card-value">8</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">New Leads</div>
                          <div className="stat-card-value">6</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Site Visit</div>
                          <div className="stat-card-value">2</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Deals Closed</div>
                          <div className="stat-card-value">9</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-card-title">Month Contribution</div>
                          <div className="stat-card-value">58,600</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Bottom Panels Split Columns */}
              <div className="dash-two-columns">
                
                {/* Panel 1: Activity Feed or Leads Overview */}
                {activeRoles.broker ? (
                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Leads Overview</h4>
                    </div>
                    <div className="leads-donut-section">
                      <div className="donut-placeholder">
                        <div className="donut-hole"></div>
                      </div>
                      <div className="donut-legend">
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#3b82f6'}}></span>
                          <span className="legend-label">New</span>
                          <span className="legend-val">12</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#10b981'}}></span>
                          <span className="legend-label">Contacted</span>
                          <span className="legend-val">8</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#f59e0b'}}></span>
                          <span className="legend-label">Site Visit Scheduled</span>
                          <span className="legend-val">5</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#ec4899'}}></span>
                          <span className="legend-label">Negotiation</span>
                          <span className="legend-val">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Recent Activity</h4>
                      <a href="#" className="panel-action-link">View all activity</a>
                    </div>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon-container">
                          <PlusCircle size={16} className="text-teal-600" />
                        </div>
                        <div className="activity-details">
                          <p className="activity-text">Your Application for Comfort Coliving PG has been submitted</p>
                          <span className="activity-time">Just Now</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon-container">
                          <CheckCircle size={16} className="text-emerald-600" />
                        </div>
                        <div className="activity-details">
                          <p className="activity-text">Booking Confirmed for Cozy Coliving Space</p>
                          <span className="activity-time">1 hour ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon-container">
                          <MessageSquare size={16} className="text-blue-600" />
                        </div>
                        <div className="activity-details">
                          <p className="activity-text">New Message from Priya Singh</p>
                          <span className="activity-time">1.5 hour ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon-container">
                          <Home size={16} className="text-purple-600" />
                        </div>
                        <div className="activity-details">
                          <p className="activity-text">You Saved two new properties in Saket, Delhi</p>
                          <span className="activity-time">2 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 2: Recommendations or Recent Leads */}
                {activeRoles.broker ? (
                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Recent Leads</h4>
                      <a href="#" className="panel-action-link">View all</a>
                    </div>
                    <div className="leads-list">
                      <div className="lead-row">
                        <div className="lead-profile-card">
                          <div className="lead-avatar" style={{background: '#a855f7'}}>AV</div>
                          <div>
                            <span className="lead-name">Amit Verma</span>
                            <p className="lead-descr">Looking for 2 BHK in HSR Saket</p>
                          </div>
                        </div>
                        <span className="badge-lead-status new">New</span>
                        <span className="lead-time">Just Now</span>
                      </div>
                      <div className="lead-row">
                        <div className="lead-profile-card">
                          <div className="lead-avatar" style={{background: '#3b82f6'}}>VS</div>
                          <div>
                            <span className="lead-name">Vikram Singh</span>
                            <p className="lead-descr">Looking for PG in Vasant Kunj</p>
                          </div>
                        </div>
                        <span className="badge-lead-status contacted">Contacted</span>
                        <span className="lead-time">1 hour ago</span>
                      </div>
                      <div className="lead-row">
                        <div className="lead-profile-card">
                          <div className="lead-avatar" style={{background: '#10b981'}}>NS</div>
                          <div>
                            <span className="lead-name">Neha Singh</span>
                            <p className="lead-descr">Looking for 1 RK in Laxmi Nagar</p>
                          </div>
                        </div>
                        <span className="badge-lead-status visit">Site Visits</span>
                        <span className="lead-time">1.5 hour ago</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Recommended For You</h4>
                      <a href="#" className="panel-action-link">View all</a>
                    </div>
                    <div className="reco-list">
                      <div className="reco-item">
                        <div className="reco-thumb"><Home size={20} /></div>
                        <div className="reco-info">
                          <span className="reco-title">Comfort Stay PG</span>
                          <p className="reco-meta">Saket, Delhi</p>
                          <div className="reco-price">₹8,600 / Month</div>
                        </div>
                        <div className="reco-rating">★ ★ ★</div>
                      </div>
                      <div className="reco-item">
                        <div className="reco-thumb"><Home size={20} /></div>
                        <div className="reco-info">
                          <span className="reco-title">Urban Stay Coliving</span>
                          <p className="reco-meta">Vasant Kunj, Delhi</p>
                          <div className="reco-price">₹18,600 / Month</div>
                        </div>
                        <div className="reco-rating">★ ★ ★ ★</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Broker Special Panel: Earnings & Top Listings */}
              {activeRoles.broker && (
                <div className="dash-two-columns">
                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Earnings Overview</h4>
                    </div>
                    <div className="stats-grid">
                      <div className="stat-card" style={{background: '#f0fdf4', border: '1px solid #bbf7d0'}}>
                        <div className="stat-card-title">Previous Commission</div>
                        <div className="stat-card-value" style={{color: '#166534'}}>2,318</div>
                      </div>
                      <div className="stat-card" style={{background: '#f0fdf4', border: '1px solid #bbf7d0'}}>
                        <div className="stat-card-title">Pending Commission</div>
                        <div className="stat-card-value" style={{color: '#166534'}}>2,318</div>
                      </div>
                      <div className="stat-card" style={{background: '#f0fdf4', border: '1px solid #bbf7d0'}}>
                        <div className="stat-card-title">Total Commission (This Year)</div>
                        <div className="stat-card-value" style={{color: '#166534'}}>2,318</div>
                      </div>
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-title-container">
                      <h4 className="panel-title">Top Performing Listings</h4>
                    </div>
                    <div className="listings-mini-table">
                      <div className="table-listing-item">
                        <span className="flex items-center gap-2"><Home size={14} /> Sunrise Apartment</span>
                        <span className="font-bold text-gray-800">₹10,000</span>
                      </div>
                      <div className="table-listing-item">
                        <span className="flex items-center gap-2"><Home size={14} /> Green View Residency</span>
                        <span className="font-bold text-gray-800">₹15,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
