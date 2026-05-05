import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Signup</h2>
        {error && <p className="mb-3 rounded bg-rose-100 p-2 text-sm text-rose-600">{error}</p>}
        <input
          name="name"
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={onChange}
          className="mb-3 w-full rounded border p-2"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          className="mb-3 w-full rounded border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          className="mb-3 w-full rounded border p-2"
          required
        />
        <button type="submit" className="w-full rounded bg-slate-900 p-2 text-white">
          Create Account
        </button>
        <p className="mt-3 text-sm">
          Already registered?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
