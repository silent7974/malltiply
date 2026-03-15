"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChangePasswordForm({ email }) {
  const [form, setForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const logs = {};

    // Old password required
    if (!form.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    // New password checks
    if (!form.password) {
      newErrors.password = "Password is required";
      logs.length = false;
      logs.complexity = false;
      logs.emailCheck = false;
      logs.notSameAsOld = false;
    } else {
      // length
      if (form.password.length < 8) {
        logs.length = false;
        newErrors.password = "Password must be at least 8 characters";
      } else {
        logs.length = true;
      }

      // complexity
      if (
        !/[A-Za-z]/.test(form.password) ||
        !/\d/.test(form.password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
      ) {
        logs.complexity = false;
        newErrors.password = "Password must include letters, numbers, and symbols";
      } else {
        logs.complexity = true;
      }

      // email prefix check
      if (
        email &&
        form.password.toLowerCase().includes(email.split("@")[0].toLowerCase())
      ) {
        logs.emailCheck = false;
        newErrors.password = "Password should not include your email prefix";
      } else {
        logs.emailCheck = true;
      }

      // must not be same as old
      if (form.password && form.oldPassword && form.password === form.oldPassword) {
        logs.notSameAsOld = false;
        newErrors.password = "New password cannot be the same as old password";
      } else {
        logs.notSameAsOld = true;
      }
    }

    // Confirm password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setValidations(logs);

    return Object.keys(newErrors).length === 0;
  };

  // run validation live on every form change
  useEffect(() => {
    const handler = setTimeout(() => validate(), 200); // debounce
    return () => clearTimeout(handler);
  }, [form]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setStatus(null);

    try {
      await axios.put(
        "/api/seller/profile",
        {
          oldPassword: form.oldPassword,
          newPassword: form.password,
        },
        { withCredentials: true }
      );
      setStatus({ type: "success", message: "Password updated successfully" });
      setForm({ oldPassword: "", password: "", confirmPassword: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    form.oldPassword &&
    form.password &&
    form.confirmPassword;

  return (
    <div className="flex justify-center">
      <div
        className="bg-white w-[321px] rounded-md 
        shadow-[-2px_2px_4px_rgba(0,0,0,0.25)] 
        flex flex-col mt-8 mx-auto px-[12px] py-[16px]"
      >
        <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Title */}
            <h3 className="text-[16px] text-center font-inter text-black/50 mb-[12px]">
              Change Password
            </h3>

            {/* Old password */}
            <label className="text-[12px] font-inter font-medium text-[#000000] mb-[4px]">
              Confirm old password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] font-inter font-medium text-[#000000]/80 rounded-[4px]"
            />
            {errors.oldPassword && (
              <p className="text-black/30 text-[8px] mt-1">{errors.oldPassword}</p>
            )}

            {/* New password */}
            <label className="text-[12px] font-inter font-medium text-[#000000] mt-[8px] mb-[4px]">
              New password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] font-inter font-medium text-[#000000]/80 rounded-[4px]"
            />

            {/* Validation logs */}
            <div className="mt-1 space-y-1">
              <p
                className={`text-[8px] ${
                  validations.length ? "text-[#1A7709]" : "text-black/30"
                }`}
              >
                Must be at least 8 characters
              </p>
              <p
                className={`text-[8px] ${
                  validations.complexity ? "text-[#1A7709]" : "text-black/30"
                }`}
              >
                Must include letters, numbers, and symbols
              </p>
              <p
                className={`text-[8px] ${
                  validations.emailCheck ? "text-[#1A7709]" : "text-black/30"
                }`}
              >
                Should not contain your email prefix
              </p>
              <p
                className={`text-[8px] ${
                  validations.notSameAsOld ? "text-[#1A7709]" : "text-black/30"
                }`}
              >
                Must not be the same as old password
              </p>
            </div>

            {/* Confirm password */}
            <label className="text-[12px] font-inter font-medium text-[#000000] mt-[8px] mb-[4px]">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] font-inter font-medium text-[#000000]/80 rounded-[4px]"
            />
            {errors.confirmPassword && (
              <p className="text-black/30 text-[8px] mt-1">{errors.confirmPassword}</p>
            )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`mt-[12px] w-full h-[32px] rounded-[4px] text-white font-inter font-semibold text-[12px] ${
                  !isFormValid || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2A9CBC]"
                }`}
              >
                {loading ? "Updating..." : "Update password"}
              </button>
        </form>

        {/* Status message */}
        {status && (
          <p
            className={`mt-2 text-[8px] text-center ${
              status.type === "success" ? "text-[#1A7709]" : "text-red-500"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}