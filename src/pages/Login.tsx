import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield, Loader2, ArrowRight, Eye, EyeOff, Sparkles, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function Login() {
  const { user, loading: authLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<"investigator" | "analyst" | "admin">("investigator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && user) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await api.post("/auth/register", { email, password, role });
        signIn(res.token, res.user);
        toast.success("Investigator credentials created! Welcome to CaseChain.");
        navigate("/");
      } else {
        const res = await api.post("/auth/login", { email, password });
        signIn(res.token, res.user);
        toast.success("Welcome back to CaseChain Intelligence");
        navigate("/");
      }
    } catch (err: any) {
      // In offline/in-memory demo mode fallback
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError") || err.message?.includes("404")) {
        const mockUser = {
          id: "demo-investigator-01",
          email: email || "lead.investigator@casechain.internal",
          name: "Det. Marcus Kane",
          role: role,
        };
        signIn("demo-jwt-token-casechain", mockUser);
        toast.success("Signed in via Local Intelligence Session");
        navigate("/");
        return;
      }
      setError(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("lead.investigator@casechain.internal");
    setPassword("CaseChain2024!");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: "lead.investigator@casechain.internal",
        password: "CaseChain2024!",
      });
      signIn(res.token, res.user);
      toast.success("Authenticated as Lead Investigator");
      navigate("/");
    } catch {
      // Offline fallback login
      const mockUser = {
        id: "demo-lead-investigator",
        email: "lead.investigator@casechain.internal",
        name: "Det. Marcus Kane",
        role: "investigator",
      };
      signIn("demo-jwt-token-casechain", mockUser);
      toast.success("Welcome, Det. Marcus Kane (Demo Clearance)");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <div className="login-container">
        {/* Left — Branding panel */}
        <div className="login-brand">
          <div className="login-brand-content">
            <div className="login-brand-logo">
              <Shield size={32} className="text-violet-400" />
              <span>CaseChain</span>
            </div>
            <h2 className="login-brand-title">
              Case Investigation &<br />
              <span className="login-gradient-text">Relationship Intelligence</span>
            </h2>
            <p className="login-brand-sub">
              Empowering agencies and investigators with multi-jurisdictional link analysis,
              interactive relationship graphs, and courtroom-ready evidence dossiers.
            </p>
            <div className="login-brand-features">
              {[
                "Interactive Case & Entity Network Graph",
                "Algorithmic Pattern Discovery & DSA Engine",
                "Forensic Chain of Custody & Evidence Locker",
                "Courtroom-Admissible PDF Dossier Generator",
              ].map((f) => (
                <div key={f} className="login-brand-feature">
                  <div className="login-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form panel */}
        <div className="login-form-panel">
          <div className="login-form-wrap">
            {/* Mobile logo */}
            <div className="login-mobile-logo">
              <Shield size={26} className="text-purple-400" />
              <span>CaseChain</span>
            </div>

            <h1 className="login-form-title">
              {mode === "login" ? "Investigator Portal" : "Register Operative"}
            </h1>
            <p className="login-form-sub">
              {mode === "login"
                ? "Enter your secure clearance credentials"
                : "Initialize your agency clearance credentials"}
            </p>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-5 rounded-xl border border-violet-500/30 bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 hover:text-white text-xs font-semibold transition-all shadow-md shadow-violet-950/40 cursor-pointer"
            >
              <Sparkles size={14} className="text-violet-400" />
              <span>Quick Demo Access (Det. Marcus Kane)</span>
            </button>

            <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground">
              <div className="flex-1 h-px bg-white/10" />
              <span>OR ENTER CREDENTIALS</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={submit} className="login-form">
              {/* Email */}
              <div className="login-field-group">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="agent@casechain.internal"
                />
              </div>

              {/* Password */}
              <div className="login-field-group">
                <label className="login-label">Clearance Password</label>
                <div className="login-pw-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input login-input-pw"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="login-pw-toggle"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role selector (signup only) */}
              {mode === "signup" && (
                <div className="login-field-group">
                  <label className="login-label">Operational Role</label>
                  <div className="login-role-grid">
                    {(["investigator", "analyst", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`login-role-btn ${role === r ? "active" : ""}`}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="login-role-hint">
                    Investigators edit cases & evidence; analysts have read & intelligence mapping privileges.
                  </p>
                </div>
              )}

              {/* Remember + Forgot (login only) */}
              {mode === "login" && (
                <div className="login-extras">
                  <label className="login-remember">
                    <input type="checkbox" className="login-checkbox" defaultChecked />
                    <span>Remember terminal session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="login-forgot"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error */}
              {error && <div className="login-error">{error}</div>}

              {/* Submit */}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {mode === "login" ? "Authenticate Terminal" : "Register Operative"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Toggle mode */}
            <div className="login-toggle">
              {mode === "login" ? "Need agency access credentials? " : "Already registered? "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="login-toggle-btn"
              >
                {mode === "login" ? "Register" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-root {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
          background: #060611;
        }

        /* Animated background */
        .login-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #060611 0%, #1a0533 40%, #0c1445 70%, #060611 100%);
        }
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: float 18s ease-in-out infinite alternate;
        }
        .login-orb-1 {
          width: 500px;
          height: 500px;
          background: #7c3aed;
          top: -100px;
          left: -100px;
        }
        .login-orb-2 {
          width: 400px;
          height: 400px;
          background: #2563eb;
          bottom: -80px;
          right: -80px;
          animation-delay: -6s;
        }
        .login-orb-3 {
          width: 300px;
          height: 300px;
          background: #06b6d4;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -12s;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }

        .login-container {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 100vh;
        }

        /* Left brand */
        .login-brand {
          display: none;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(10px);
        }
        @media (min-width: 1024px) {
          .login-brand { display: flex; }
        }
        .login-brand-content {
          max-width: 460px;
        }
        .login-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 2rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .login-brand-title {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          color: white;
          margin-bottom: 1rem;
        }
        .login-gradient-text {
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-brand-sub {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .login-brand-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .login-brand-feature {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.875rem;
        }
        .login-feature-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7c3aed;
          box-shadow: 0 0 10px #7c3aed;
        }

        /* Right form */
        .login-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .login-form-wrap {
          width: 100%;
          max-width: 420px;
        }
        .login-mobile-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) {
          .login-mobile-logo { display: none; }
        }
        .login-form-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.35rem;
        }
        .login-form-sub {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .login-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .login-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .login-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: white;
          font-size: 0.9rem;
          transition: all 0.2s;
          outline: none;
        }
        .login-input:focus {
          border-color: #7c3aed;
          background: rgba(124, 58, 237, 0.06);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .login-pw-wrap {
          position: relative;
        }
        .login-input-pw {
          padding-right: 2.75rem;
        }
        .login-pw-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          background: none;
          border: none;
          cursor: pointer;
        }
        .login-pw-toggle:hover { color: white; }
        .login-role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .login-role-btn {
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-role-btn.active {
          border-color: #7c3aed;
          background: rgba(124, 58, 237, 0.15);
          color: #a78bfa;
        }
        .login-role-hint {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.25rem;
        }
        .login-extras {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
        .login-checkbox {
          accent-color: #7c3aed;
        }
        .login-forgot {
          color: #a78bfa;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .login-forgot:hover { text-decoration: underline; }
        .login-error {
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          font-size: 0.825rem;
        }
        .login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          font-weight: 600;
          font-size: 0.925rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-toggle {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }
        .login-toggle-btn {
          color: #a78bfa;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .login-toggle-btn:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
