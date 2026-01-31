import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [copied, setCopied] = useState(false);

  const installCommand = "code --install-extension fixora-0.0.1.vsix";

  const copyCommand = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (<div>
     <header className="header">
      <h1>
        <span className="red">FIXORA </span>AI CYBER OPS
      </h1>
      <p>Threat Analysis • Red Team • AI Assistant</p>
    </header>
    <nav className="navbar">
      <div className="logo">Fixora</div>

      <div className="nav-actions">
        <button className="copy-btn" onClick={copyCommand}>
          {copied ? "✅ Copied" : "📋 Copy Install Command"}
        </button>

        <a
          href="/fixora-0.0.1.vsix"
          download
          className="download-btn"
        >
          ⬇️ Download Extension
        </a>
      </div>
    </nav>
 </div> );
}
