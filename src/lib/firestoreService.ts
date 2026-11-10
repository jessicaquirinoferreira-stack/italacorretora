import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Development, LandingPage, Lead, SiteSettings, AnalyticsEvent } from '../types';
import { initialDevelopments, initialLandingPage, initialSiteSettings } from './seedData';

const SETTINGS_COLLECTION = 'settings';
const DEVELOPMENTS_COLLECTION = 'developments';
const LANDING_PAGES_COLLECTION = 'landingPages';
const LEADS_COLLECTION = 'leads';
const ANALYTICS_COLLECTION = 'analyticsEvents';
const MAIN_SETTINGS_ID = 'main_config';

/**
 * Fetch or auto-seed site settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const path = `${SETTINGS_COLLECTION}/${MAIN_SETTINGS_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MAIN_SETTINGS_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }

    // Auto-seed initial settings to Firestore
    try {
      await setDoc(docRef, initialSiteSettings);
      return initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  } catch (error) {
    console.warn('Error reading settings, using default profile:', error);
    return initialSiteSettings;
  }
}

/**
 * Update site settings (Admin only)
 */
export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/${MAIN_SETTINGS_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MAIN_SETTINGS_ID);
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch developments (published only for visitors, or all for admin)
 */
export async function getDevelopments(onlyPublished = false): Promise<Development[]> {
  try {
    const colRef = collection(db, DEVELOPMENTS_COLLECTION);
    const q = onlyPublished ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await getDocs(q);

    if (snap.empty) {
      // Auto-seed if empty
      try {
        for (const dev of initialDevelopments) {
          await setDoc(doc(db, DEVELOPMENTS_COLLECTION, dev.id), dev);
        }
        return initialDevelopments.filter((d) => !onlyPublished || d.published);
      } catch {
        return initialDevelopments.filter((d) => !onlyPublished || d.published);
      }
    }

    const items: Development[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Development, 'id'>) });
    });

    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Error loading developments from Firestore, using initial luxury catalogue:', error);
    return initialDevelopments.filter((d) => !onlyPublished || d.published);
  }
}

/**
 * Save or update development
 */
export async function saveDevelopment(development: Development): Promise<void> {
  const path = `${DEVELOPMENTS_COLLECTION}/${development.id}`;
  try {
    const docRef = doc(db, DEVELOPMENTS_COLLECTION, development.id);
    await setDoc(docRef, {
      ...development,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete development
 */
export async function deleteDevelopment(id: string): Promise<void> {
  const path = `${DEVELOPMENTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, DEVELOPMENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetch landing pages
 */
export async function getLandingPages(): Promise<LandingPage[]> {
  try {
    const colRef = collection(db, LANDING_PAGES_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      try {
        await setDoc(doc(db, LANDING_PAGES_COLLECTION, initialLandingPage.id), initialLandingPage);
        return [initialLandingPage];
      } catch {
        return [initialLandingPage];
      }
    }

    const items: LandingPage[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...(docSnap.data() as Omit<LandingPage, 'id'>) });
    });
    return items;
  } catch (error) {
    console.warn('Error loading landing pages:', error);
    return [initialLandingPage];
  }
}

/**
 * Get landing page by slug
 */
export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  try {
    const colRef = collection(db, LANDING_PAGES_COLLECTION);
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as Omit<LandingPage, 'id'>) };
    }
    if (initialLandingPage.slug === slug) {
      return initialLandingPage;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching landing page by slug:', error);
    if (initialLandingPage.slug === slug) return initialLandingPage;
    return null;
  }
}

/**
 * Save or update landing page
 */
export async function saveLandingPage(landingPage: LandingPage): Promise<void> {
  const path = `${LANDING_PAGES_COLLECTION}/${landingPage.id}`;
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPage.id);
    await setDoc(docRef, {
      ...landingPage,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete landing page
 */
export async function deleteLandingPage(id: string): Promise<void> {
  const path = `${LANDING_PAGES_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Capture new lead (Public write)
 */
export async function saveLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<string> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `${LEADS_COLLECTION}/${leadId}`;
  const newLead: Lead = {
    ...leadData,
    id: leadId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, LEADS_COLLECTION, leadId);
    await setDoc(docRef, newLead);
    return leadId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return leadId;
  }
}

/**
 * Get all leads (Admin only)
 */
export async function getLeads(): Promise<Lead[]> {
  const path = LEADS_COLLECTION;
  try {
    const colRef = collection(db, LEADS_COLLECTION);
    const snap = await getDocs(colRef);
    const leads: Lead[] = [];
    snap.forEach((d) => {
      leads.push({ id: d.id, ...(d.data() as Omit<Lead, 'id'>) });
    });
    return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Leads fetch restricted or empty:', error);
    return [];
  }
}

/**
 * Update lead status or notes
 */
export async function updateLead(leadId: string, updates: Partial<Lead>): Promise<void> {
  const path = `${LEADS_COLLECTION}/${leadId}`;
  try {
    const docRef = doc(db, LEADS_COLLECTION, leadId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete lead
 */
export async function deleteLead(leadId: string): Promise<void> {
  const path = `${LEADS_COLLECTION}/${leadId}`;
  try {
    const docRef = doc(db, LEADS_COLLECTION, leadId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Track analytics event
 */
export async function logAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'createdAt'>): Promise<void> {
  const eventId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, eventId);
    await setDoc(docRef, {
      ...event,
      createdAt: new Date().toISOString(),
    });
  } catch {
    // Non-blocking telemetry
  }
}
