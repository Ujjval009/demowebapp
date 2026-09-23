import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-alt">
      <div className="w-[400px] max-w-[90vw] bg-paper border border-rule p-8">
        <div className="text-center mb-8">
          <div className="w-[36px] h-[36px] bg-blue text-paper rounded-sm flex items-center justify-center font-semibold text-lg mx-auto mb-3">+</div>
          <h1 className="font-serif text-xl font-semibold">Sign in to Wardline</h1>
          <p className="text-ink-soft text-sm mt-1">Staff access only</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Email address" type="email" placeholder="admin@wardline.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-brick text-xs mb-3">{error}</p>}

          <Button type="submit" className="w-full justify-center mt-2">Sign in</Button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          Demo: use any email and password to sign in.
        </p>

        <div className="text-center mt-4 text-sm">
          <span className="text-ink-soft">New here? </span>
          <Link to="/register" className="text-blue">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
