import { useState, useEffect } from "react";

function ReadingControlsSidebar({
  viewMode,
  onViewModeChange,
  showTranslation,
  onToggleTranslation,
  jumpInput,
  onJumpInputChange,
  onJump,
  jumpPlaceholder,
  scrollCount,
  onScrollCountChange,
  onCommitScrollCount,
  modes = ["scroll", "page", "memorize"],
  info,
  pageNav,
  navLinks,
  memorizeControls,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const modeLabels = { scroll: "Scroll", page: "Page", memorize: "Memorize" };

  useEffect(() => {
    document.body.style.transition = "padding-left 0.25s ease";
    return () => {
      document.body.style.paddingLeft = "";
      document.body.style.transition = "";
    };
  }, []);

  useEffect(() => {
    document.body.style.paddingLeft = isOpen ? "330px" : "0px";
  }, [isOpen]);

  return (
    <>
      <button
        className={`sidebar-toggle-tab${isOpen ? " sidebar-tab-open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close controls" : "Open controls"}
      >
        {isOpen ? "◀" : "▶"}
      </button>

      <div className={`reading-sidebar${isOpen ? "" : " reading-sidebar--closed"}`}>
        {navLinks?.length > 0 && (
          <div className="sidebar-nav-links">
            {navLinks.map(({ label, icon, onClick }) => (
              <button key={label} className="sidebar-nav-link" onClick={onClick}>
                {icon && <span className="sidebar-nav-link-icon">{icon}</span>}
                {label}
              </button>
            ))}
          </div>
        )}

        {info && (
          <div className="sidebar-info-card">
            {info.number != null && (
              <div className="sidebar-info-badge">{info.number}</div>
            )}
            {info.arabicName && (
              <div className="sidebar-info-arabic">{info.arabicName}</div>
            )}
            {info.englishName && (
              <div className="sidebar-info-english">{info.englishName}</div>
            )}
            {info.subtitle && (
              <div className="sidebar-info-subtitle">{info.subtitle}</div>
            )}
            {info.details?.length > 0 && (
              <>
                <div className="sidebar-info-divider" />
                <div className="sidebar-info-details">
                  {info.details.map(({ label, value }) => (
                    <div key={label} className="sidebar-info-detail-row">
                      <span className="sidebar-info-detail-label">{label}</span>
                      <span className="sidebar-info-detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="sidebar-header">
          <span className="sidebar-title">Reading Controls</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">View Mode</div>
          <div className="sidebar-mode-group">
            {modes.map((mode) => (
              <button
                key={mode}
                className={`sidebar-mode-btn${viewMode === mode ? " sidebar-mode-active" : ""}`}
                onClick={() => onViewModeChange(mode)}
              >
                {modeLabels[mode] ?? mode}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Translation</div>
          <button
            className={`sidebar-ctrl-btn${showTranslation ? " sidebar-ctrl-active" : ""}`}
            onClick={onToggleTranslation}
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </button>
        </div>

        {onJump && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Jump to Page</div>
            <div className="sidebar-input-row">
              <input
                type="text"
                inputMode="numeric"
                className="sidebar-input"
                placeholder={jumpPlaceholder ?? "Page #"}
                value={jumpInput}
                onChange={(e) => onJumpInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onJump()}
              />
              <button className="sidebar-go-btn" onClick={onJump}>Go</button>
            </div>
          </div>
        )}

        {pageNav && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Page Navigation</div>
            <div className="sidebar-page-nav">
              <button className="sidebar-nav-btn" onClick={pageNav.onPrev} disabled={pageNav.prevDisabled}>← Prev</button>
              <span className="sidebar-nav-label">{pageNav.label}</span>
              <button className="sidebar-nav-btn" onClick={pageNav.onNext} disabled={pageNav.nextDisabled}>Next →</button>
            </div>
          </div>
        )}

        {memorizeControls && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Memorization</div>
            <div className="sidebar-page-nav">
              <button className="sidebar-nav-btn" onClick={memorizeControls.onHide} disabled={memorizeControls.hideDisabled}>← Hide</button>
              <button className="sidebar-nav-btn" onClick={memorizeControls.onReveal} disabled={memorizeControls.revealDisabled}>Reveal →</button>
            </div>
          </div>
        )}

        {onCommitScrollCount && viewMode === "scroll" && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Pages to Load</div>
            <div className="sidebar-input-row">
              <input
                type="text"
                inputMode="numeric"
                className="sidebar-input"
                value={scrollCount}
                onChange={(e) => onScrollCountChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onCommitScrollCount()}
              />
              <button className="sidebar-go-btn" onClick={onCommitScrollCount}>Load</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReadingControlsSidebar;
