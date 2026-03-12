import { Platform } from 'react-native';

// Possible API hosts
const POSSIBLE_HOSTS = [
  'localhost:8080',
  '127.0.0.1:8080',
  '192.168.1.123:8080',
  '10.68.243.159:8080', // EPITECH
  '10.0.2.2:8080',
];

let detectedApiUrl: string | null = null;

const testApiHost = async (host: string): Promise<boolean> => {
  try {
    const testUrl = `http://${host}/api/auth`;
    console.log(`API: Testing ${host}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(testUrl, {
      method: 'OPTIONS',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log(`API: ${host} is reachable (status: ${response.status})`);
    return true;
  } catch (error) {
    console.log(`API: ${host} failed - ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

const detectApiHost = async (): Promise<string> => {
  if (detectedApiUrl) {
    return detectedApiUrl;
  }

  console.log('API: Starting auto-detection of API server...');

  const hostsToTry = Platform.OS === 'android' 
    ? ['10.0.2.2:8080', ...POSSIBLE_HOSTS.filter(h => h !== '10.0.2.2:8080')]
    : POSSIBLE_HOSTS;

  for (const host of hostsToTry) {
    const isReachable = await testApiHost(host);
    if (isReachable) {
      detectedApiUrl = `http://${host}`;
      console.log(`API: Successfully detected API at ${detectedApiUrl}`);
      return detectedApiUrl;
    }
  }

  // Fallback to localhost if nothing works
  const fallback = 'http://localhost:8080';
  console.warn(`API: Auto-detection failed, using fallback: ${fallback}`);
  detectedApiUrl = fallback;
  return fallback;
};

let apiBaseUrl: string | null = null;

const getApiBaseUrl = async (): Promise<string> => {
  if (!apiBaseUrl) {
    apiBaseUrl = await detectApiHost();
  }
  return apiBaseUrl;
};

let initPromise: Promise<string> | null = null;

const initializeApi = async (): Promise<string> => {
  if (!initPromise) {
    initPromise = getApiBaseUrl();
  }
  return initPromise;
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
};

export { initializeApi };
