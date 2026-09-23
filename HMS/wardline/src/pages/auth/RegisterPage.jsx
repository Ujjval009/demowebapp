import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "receptionist" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    register(form.name, form.email, form.password, form.role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-alt">
      <div className="w-[400px] max-w-[90vw] bg-paper border border-rule p-8">
        <div className="text-center mb-8">
          <div className="w-[36px] h-[36px] bg-blue text-paper rounded-sm flex items-center justify-center font-semibold text-lg mx-auto mb-3">+</div>
          <h1 className="font-serif text-xl font-semibold">Create your account</h1>
          <p className="text-ink-soft text-sm mt-1">Join the Wardline team</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Full name" placeholder="Dr. Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email address" type="email" placeholder="jane@wardline.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select label="Role" options={["admin", "doctor", "receptionist", "pharmacist"]} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />

          {error && <p className="text-brick text-xs mb-3">{error}</p>}

          <Button type="submit" className="w-full justify-center mt-2">Create account</Button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-ink-soft">Already have an account? </span>
          <Link to="/login" className="text-blue">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
