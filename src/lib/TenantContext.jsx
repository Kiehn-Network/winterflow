import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const TenantContext = createContext();

/**
 * Detects the current company based on subdomain.
 * e.g. "muster.winterflow.de" → looks up company with subdomain "muster"
 * On localhost or winterflow.de itself → no company filter (superadmin mode)
 */
const detectSubdomain = () => {
  const host = window.location.hostname;
  // localhost or main domain → no subdomain
  if (host === 'localhost' || host === 'winterflow.de' || host === 'www.winterflow.de') {
    return null;
  }
  // Extract subdomain from e.g. "firma1.winterflow.de"
  const parts = host.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
};

export const TenantProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    initTenant();
  }, []);

  const initTenant = async () => {
    const subdomain = detectSubdomain();
    if (!subdomain) {
      setLoadingTenant(false);
      return;
    }
    try {
      const results = await base44.entities.Company.filter({ subdomain });
      if (results && results.length > 0) {
        setCompany(results[0]);
        setCompanyId(results[0].id);
      }
    } catch (e) {
      console.error('Tenant lookup failed', e);
    }
    setLoadingTenant(false);
  };

  const loginAsCompany = (c) => {
    setCompany(c);
    setCompanyId(c.id);
    setImpersonating(true);
  };

  const logoutFromCompany = () => {
    setCompany(null);
    setCompanyId(null);
    setImpersonating(false);
  };

  return (
    <TenantContext.Provider value={{ company, companyId, loadingTenant, setCompany, setCompanyId, impersonating, loginAsCompany, logoutFromCompany }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);