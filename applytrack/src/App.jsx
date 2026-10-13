
import { useEffect, useState } from "react";
import "./App.css";

const initialApplications = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer Intern",
    date: "2026-10-10",
    status: "Interview",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Software Engineer Intern",
    date: "2026-10-08",
    status: "Applied",
  },
  {
    id: 3,
    company: "bKash",
    role: "Junior Developer",
    date: "2026-10-05",
    status: "Offer",
  },
  {
    id: 4,
    company: "Pathao",
    role: "React Developer Intern",
    date: "2026-10-02",
    status: "Rejected",
  },
];

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("applytrack-applications");
      return saved ? JSON.parse(saved) : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    company: "",
    role: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Applied",
  });

  useEffect(() => {
    localStorage.setItem(
      "applytrack-applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const total = applications.length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === "All" || app.status === filter;

    return matchesSearch && matchesStatus;
  });

  function handleSubmit(event) {
    event.preventDefault();

    const newApplication = {
      id: Date.now(),
      company: form.company.trim(),
      role: form.role.trim(),
      date: form.date,
      status: form.status,
    };

    setApplications((previous) => [
      newApplication,
      ...previous,
    ]);

    setForm({
      company: "",
      role: "",
      date: new Date().toISOString().slice(0, 10),
      status: "Applied",
    });

    setShowForm(false);
  }

  
function editApplication(id) {
  const app = applications.find((item) => item.id === id);

  if (!app) return;

  const company = window.prompt("Company name:", app.company);
  if (company === null || !company.trim()) return;

  const role = window.prompt("Job position:", app.role);
  if (role === null || !role.trim()) return;

  const status = window.prompt(
    "Status: Applied, Assessment, Interview, Offer, Rejected",
    app.status
  );

  const validStatuses = [
    "Applied",
    "Assessment",
    "Interview",
    "Offer",
    "Rejected",
  ];

  if (status === null || !validStatuses.includes(status.trim())) {
    window.alert("Please enter a valid status.");
    return;
  }

  setApplications((previous) =>
    previous.map((item) =>
      item.id === id
        ? {
            ...item,
            company: company.trim(),
            role: role.trim(),
            status: status.trim(),
          }
        : item
    )
  );
}


  function deleteApplication(id) {
    const confirmed = window.confirm(
      "Delete this application?"
    );

    if (confirmed) {
      setApplications((previous) =>
        previous.filter((app) => app.id !== id)
      );
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">ApplyTrack<span>.</span></h2>

        <p className="menu-label">MENU</p>
        <div className="nav-item active">▦ Dashboard</div>
        <div className="nav-item">▤ Applications</div>
        <div className="nav-item">◷ Upcoming</div>

        <div className="sidebar-bottom">
          <div className="avatar">J</div>
          <div>
            <strong>My Workspace</strong>
            <p>Job seeker</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR CAREER, ORGANIZED</p>
            <h1>Dashboard</h1>
          </div>

          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            + Add application
          </button>
        </header>

        {showForm && (
          <section className="form-card">
            <h2>Add a new application</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Company name
                <input
                  required
                  maxLength={100}
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      company: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Job position
                <input
                  required
                  maxLength={120}
                  placeholder="e.g. Frontend Developer Intern"
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Application date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value,
                    })
                  }
                >
                  <option>Applied</option>
                  <option>Assessment</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>

              <div className="form-actions">
                <button type="button" className="cancel-button"
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  Save application
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR JOB SEARCH</p>
            <h2>Keep moving forward. ✨</h2>
            <p>
              Every application is a step toward your next opportunity.
            </p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <p>Total applications</p>
            <h2>{total}</h2>
            <span>All tracked opportunities</span>
          </div>
          <div className="stat-card">
            <p>Interviews</p>
            <h2>{interviews}</h2>
            <span>Opportunities to shine</span>
          </div>
          <div className="stat-card">
            <p>Offers received</p>
            <h2>{offers}</h2>
            <span>Celebrate your progress</span>
          </div>
        </section>

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Keep an eye on your opportunities.</p>
            </div>
            <span className="count-badge">{total} total</span>
          </div>

          <div className="toolbar">
            <input
              className="search-input"
              placeholder="Search company or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="filter-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="application-list">
            {filteredApplications.map((app) => (
              <article className="application-row" key={app.id}>
                <div className="company-icon">
                  {app.company.charAt(0).toUpperCase()}
                </div>

                <div className="job-info">
                  <strong>{app.company}</strong>
                  <p>{app.role}</p>
                </div>

                <div className="job-date">{app.date}</div>

                <span
                  className={`status status-${app.status.toLowerCase()}`}
                >
                  {app.status}
                </span>

                
<button
  className="edit-button"
  onClick={() => editApplication(app.id)}
  aria-label={`Edit ${app.company}`}
>
  Edit
</button>


                <button 
                  className="delete-button"
                  title={`Delete ${app.company}`}
                  aria-label={`Delete ${app.company}`}
                  onClick={() => deleteApplication(app.id)}
                >
                  ×
                </button>
              </article>
            ))}

            {filteredApplications.length === 0 && (
              <p className="empty-state">
                No applications found. Try another search or add one!
              </p>
            )}
          </div>
        </section>

        <footer>Made with care for your next career move. 💜</footer>
      </main>
    </div>
  );
}

export default App;
