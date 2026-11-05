import { X } from "lucide-react";

export function PixelButton({ children, variant = "primary", className = "", ...props }) {
  return <button className={`button pixel-button ${variant === "secondary" ? "button-secondary" : ""} ${className}`} {...props}>{children}</button>;
}

export function PixelPanel({ title, eyebrow, children, className = "", action }) {
  return (
    <section className={`pixel-panel ${className}`}>
      {(title || eyebrow || action) && <div className="pixel-panel-heading">
        <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2>{title}</h2>}</div>
        {action}
      </div>}
      {children}
    </section>
  );
}

export function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section className="modal-window window-frame" onMouseDown={e => e.stopPropagation()}>
      <div className="window-titlebar"><span>{title}</span><button onClick={onClose} aria-label="Close"><X size={15}/></button></div>
      <div className="modal-content">{children}</div>
    </section>
  </div>;
}

export function EmptyState({ icon = "✧", title = "Nothing here yet!", text = "Your little archive is waiting for something lovely." }) {
  return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{text}</p></div>;
}
