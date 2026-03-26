import { getPlans } from "../services/plansService";
import { useState, useEffect, useContext } from "react";
import { createCheckoutSession } from "../services/createCheckoutSessionService";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContext } from "../context/AuthContext";
import {useNavigate } from "react-router-dom";

/*
 * Transforms API plan data to display format.
 * API shape: { name, stripePriceId, maxProjects, maxTasksPerProject }
 * 
 * In React, an event handler like onClick={...} is not run immediately; 
 * React stores that function and later calls it with a single argument: the event.
 * 
 * 
 * Three important concepts here,
 * 1. Data transformation. We changed tha
 * 
 */
function planToDisplay(apiPlan, index,isAuthenticated,navigate) {
  const isFree = apiPlan.name?.toUpperCase() === "FREE";
  const projectsText =
    apiPlan.maxProjects != null
      ? `${apiPlan.maxProjects} Project${apiPlan.maxProjects !== 1 ? "s" : ""}`
      : "Unlimited Projects";
  const tasksText =
    apiPlan.maxTasksPerProject != null
      ? `${apiPlan.maxTasksPerProject} Tasks per project`
      : "Unlimited tasks per project";

  return {
    name: apiPlan.name,
    price: isFree ? "$0" : "20$",
    period: isFree ? "forever" : "per month",
    features: [projectsText, tasksText],
    cta: isFree ? "Get Started" : "Get Pro",
    highlighted: !isFree,
    stripePriceId:apiPlan.stripePriceId,
    //You cannot destructure or access a property directly in the parameter list like apiPlan.stripePriceId; that is treated as an invalid assignment target (hence “Assigning to rvalue”)
    onCheckout: async () =>{
      if (!isAuthenticated){
        navigate("/login",{replace:true})
      return 
      }
      console.log("User logged in")
    const url=await createCheckoutSession(apiPlan.stripePriceId);
    console.log(url)
    window.location.href=url;
  }
  };
}

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isAuthenticated}=useContext(AuthContext);
  const navigate=useNavigate();

  useEffect(() => {
    getPlans()
      .then((data) => setPlans(data.map((p, i) => planToDisplay(p, i,isAuthenticated,navigate))))
      .catch((err) => setError(err?.message || "Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>PRICING</p>
        <h1 style={styles.title}>Simple, honest pricing</h1>
        <p style={styles.subtitle}>No hidden fees. Cancel anytime.</p>
      </div>

      <div style={styles.grid}>
        {plans.map((plan) => {
          console.log(plan)

          return (
          <div key={plan.name} style={styles.card}>
            <p style={styles.planName}>{plan.name}</p>

            <div style={styles.priceRow}>
              <span style={styles.price}>{plan.price}</span>
              <span style={styles.period}>/{plan.period}</span>
            </div>

            <hr style={styles.divider} />

            <ul style={styles.featureList}>
              {plan.features.map((f) => (
                <li key={f} style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={()=>{plan.onCheckout()}}
              style={{
                ...styles.button,
                ...(plan.highlighted ? styles.buttonHighlighted : styles.buttonDefault),
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {plan.cta}
            </button>
          </div>)
})}
      </div>
    </div>
  );
}

export default Plans;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.15em",
    color: "#6366f1",
    marginBottom: "8px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  loading: {
    fontSize: "18px",
    color: "#64748b",
  },
  error: {
    fontSize: "16px",
    color: "#dc2626",
  },
  grid: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "32px",
    width: "300px",
    position: "relative",
    boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
  },
  planName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
    marginBottom: "20px",
  },
  price: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#0f172a",
  },
  period: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f1f5f9",
    margin: "0 0 20px",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 28px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#334155",
  },
  checkmark: {
    color: "#22c55e",
    fontWeight: "700",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  buttonDefault: {
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
  },
  buttonHighlighted: {
    backgroundColor: "#6366f1",
    color: "#ffffff",
  },
};
