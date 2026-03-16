import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authApi from "@/lib/authApi";
import { getAccessToken } from "@/lib/api";

export type UserRole =
  | "user"
  | "agent"
  | "owner"
  | "developer"
  | "admin";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: UserRole;
  country_code?: string | null;
  kyc_status?: string | null;
  wallet_address?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOtp: (phone: string, countryCode?: string, purpose?: "login" | "register") => Promise<{ devOtp?: string }>;
  checkOtp: (phone: string, otp: string, countryCode?: string, purpose?: "login" | "register") => Promise<{ valid: boolean; error?: string }>;
  verifyOtpAndLogin: (
    phone: string,
    otp: string,
    countryCode?: string,
    registerPayload?: {
      name: string;
      email: string;
      role: UserRole;
      kyc_type?: string;
      kyc_id?: string;
      wallet_message: string;
      wallet_signature: string;
    }
  ) => Promise<User>;
  verifyOtpAndRegisterDeveloper: (
    phone: string,
    otp: string,
    payload: {
      company_name: string;
      gstin?: string;
      license_number?: string;
      email: string;
      name?: string;
      wallet_message: string;
      wallet_signature: string;
    },
    countryCode?: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  linkWallet: (message: string, signature: string) => Promise<User>;
  loginWithWallet: (message: string, signature: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "fractoland_user";

function mapApiUserToUser(apiUser: authApi.ApiUser): User {
  const role = apiUser.role === "customer" ? "user" : apiUser.role;
  return {
    id: apiUser.id,
    phone: apiUser.phone,
    email: apiUser.email ?? null,
    name: apiUser.name ?? null,
    role: role as UserRole,
    country_code: apiUser.country_code ?? null,
    kyc_status: apiUser.kyc_status ?? null,
    wallet_address: apiUser.wallet_address ?? null,
    email_verified_at: apiUser.email_verified_at ?? null,
    created_at: apiUser.created_at,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      persistUser(mapApiUserToUser(me));
    } catch {
      persistUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [persistUser]);

  useEffect(() => {
    if (getAccessToken()) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const sendOtp = useCallback(
    async (
      phone: string,
      countryCode = "+91",
      purpose: "login" | "register" = "login"
    ) => {
      const cleaned = phone.replace(/\D/g, "");
      const result = await authApi.sendOtp({
        phone: cleaned,
        country_code: countryCode,
        purpose,
      });
      return { devOtp: result.devOtp };
    },
    []
  );

  const checkOtp = useCallback(
    async (
      phone: string,
      otp: string,
      countryCode = "+91",
      purpose: "login" | "register" = "login"
    ) => {
      const cleaned = phone.replace(/\D/g, "");
      return authApi.checkOtp({
        phone: cleaned,
        country_code: countryCode,
        otp: otp.replace(/\D/g, "").slice(0, 6),
        purpose,
      });
    },
    []
  );

  const verifyOtpAndLogin = useCallback(
    async (
      phone: string,
      otp: string,
      countryCode = "+91",
      registerPayload?: {
        name: string;
        email: string;
        role: UserRole;
        kyc_type?: string;
        kyc_id?: string;
        wallet_message: string;
        wallet_signature: string;
      }
    ): Promise<User> => {
      const cleaned = phone.replace(/\D/g, "");
      const payload: authApi.VerifyOtpLoginPayload | authApi.VerifyOtpRegisterPayload = registerPayload
        ? {
            phone: cleaned,
            country_code: countryCode,
            otp,
            purpose: "register",
            register: true,
            name: registerPayload.name,
            email: registerPayload.email,
            role: authApi.roleToApi(registerPayload.role),
            kyc_type: registerPayload.kyc_type,
            kyc_id: registerPayload.kyc_id,
            wallet_message: registerPayload.wallet_message,
            wallet_signature: registerPayload.wallet_signature,
          }
        : {
            phone: cleaned,
            country_code: countryCode,
            otp,
            purpose: "login",
          };
      const res = await authApi.verifyOtp(payload);
      const u = mapApiUserToUser(res.user);
      persistUser(u);
      return u;
    },
    [persistUser]
  );

  const verifyOtpAndRegisterDeveloper = useCallback(
    async (
      phone: string,
      otp: string,
      payload: {
        company_name: string;
        gstin?: string;
        license_number?: string;
        email: string;
        name?: string;
        wallet_message: string;
        wallet_signature: string;
      },
      countryCode = "+91"
    ): Promise<User> => {
      const cleaned = phone.replace(/\D/g, "");
      const res = await authApi.verifyOtp({
        phone: cleaned,
        country_code: countryCode,
        otp,
        purpose: "register",
        developer: true,
        company_name: payload.company_name,
        gstin: payload.gstin,
        license_number: payload.license_number,
        email: payload.email,
        name: payload.name,
        wallet_message: payload.wallet_message,
        wallet_signature: payload.wallet_signature,
      });
      const u = mapApiUserToUser(res.user);
      persistUser(u);
      return u;
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    await authApi.logoutApi();
    persistUser(null);
  }, [persistUser]);

  const linkWallet = useCallback(
    async (message: string, signature: string): Promise<User> => {
      const res = await authApi.linkWallet({ message, signature });
      const u = mapApiUserToUser(res.user);
      persistUser(u);
      return u;
    },
    [persistUser]
  );

  const loginWithWallet = useCallback(
    async (message: string, signature: string): Promise<User> => {
      const res = await authApi.loginWithWallet({ message, signature });
      const u = mapApiUserToUser(res.user);
      persistUser(u);
      return u;
    },
    [persistUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sendOtp,
        checkOtp,
        verifyOtpAndLogin,
        verifyOtpAndRegisterDeveloper,
        logout,
        linkWallet,
        loginWithWallet,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
