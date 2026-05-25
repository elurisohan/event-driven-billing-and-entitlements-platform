import { getPlans } from "../services/plansService";
import { useState, useEffect, useContext } from "react";
import { createCheckoutSession } from "../services/createCheckoutSessionService";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function planToDisplay(apiPlan, isAuthenticated, navigate) {
  const isFree = apiPlan.name?.toUpperCase() === "FREE";
  const projectsText =
    apiPlan.maxProjects != null
      ? `${apiPlan.maxProjects} project${apiPlan.maxProjects !== 1 ? "s" : ""}`
      : "Unlimited projects";
  const tasksText =
    apiPlan.maxTasksPerProject != null
      ? `${apiPlan.maxTasksPerProject} tasks per project`
      : "Unlimited tasks per project";

  return {
    name: apiPlan.name,
    price: isFree ? "$0" : "$20",
    period: isFree ? "forever" : "per month",
    features: [projectsText, tasksText],
    cta: isFree ? "Get started" : "Upgrade to Pro",
    highlighted: !isFree,
    onCheckout: async () => {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }
      const url = await createCheckoutSession(apiPlan.stripePriceId);
      window.location.href = url;
    },
  };
}

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPlans()
      .then((data) =>
        setPlans(data.map((p) => planToDisplay(p, isAuthenticated, navigate)))
      )
      .catch((err) => setError(err?.message || "Failed to load plans"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  async function handleCheckout(plan) {
    setCheckoutLoading(plan.name);
    try {
      await plan.onCheckout();
    } finally {
      setCheckoutLoading(null);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.statusMessage}>Loading plans…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Plans</h1>
          <p style={styles.pageSubtitle}>
            Simple pricing for your workspace. No hidden fees.
          </p>
        </div>
        {!isAuthenticated && (
          <p style={styles.authHint}>
            <Link to="/login" style={styles.authLink}>
              Sign in
            </Link>{" "}
            to upgrade
          </p>
        )}
      </header>

      <div style={styles.grid}>
        {plans.map((plan) => (
          <article
            key={plan.name}
            style={{
              ...styles.card,
              ...(plan.highlighted ? styles.cardHighlighted : {}),
            }}
          >
            {plan.highlighted && <span style={styles.badge}>Popular</span>}

            <h2 style={styles.planName}>{plan.name}</h2>

            <div style={styles.priceRow}>
              <span style={styles.price}>{plan.price}</span>
              <span style={styles.period}>/{plan.period}</span>
            </div>

            <ul style={styles.featureList}>
              {plan.features.map((feature) => (
                <li key={feature} style={styles.featureItem}>
                  <span style={styles.checkmark} aria-hidden>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCheckout(plan)}
              disabled={checkoutLoading === plan.name}
              style={
                plan.highlighted ? styles.primaryButton : styles.secondaryButton
              }
            >
              {checkoutLoading === plan.name ? "Redirecting…" : plan.cta}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Plans;

const styles = {
  page: {
    flex: 1,
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px 48px",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  pageTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  pageSubtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.5,
  },
  authHint: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
    flexShrink: 0,
  },
  authLink: {
    color: "#0f172a",
    fontWeight: 500,
    textDecoration: "none",
  },
  statusMessage: {
    fontSize: "14px",
    color: "#64748b",
  },
  errorMessage: {
    fontSize: "14px",
    color: "#b91c1c",
    padding: "12px 16px",
    background: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "720px",
  },
  card: {
    position: "relative",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    display: "flex",
    flexDirection: "column",
  },
  cardHighlighted: {
    borderColor: "#0f172a",
    boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
  },
  badge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#0f172a",
    background: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "999px",
  },
  planName: {
    margin: "0 0 8px",
    fontSize: "17px",
    fontWeight: 600,
    color: "#0f172a",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
    marginBottom: "20px",
  },
  price: {
    fontSize: "32px",
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  period: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 24px",
    flex: 1,
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
    color: "#15803d",
    fontWeight: 600,
    fontSize: "13px",
  },
  primaryButton: {
    width: "100%",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    background: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
