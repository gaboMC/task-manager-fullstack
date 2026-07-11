type FooterProps = {
  total: number;
  completed: number;
  pending: number;
};

function Footer({ total, completed, pending }: FooterProps) {
  return (
    <footer className="app-footer">
      <div className="stat-item">Total: <span className="stat-count">{total}</span></div>
      <div className="stat-item">Completadas: <span className="stat-count completed">{completed}</span></div>
      <div className="stat-item">Pendientes: <span className="stat-count pending">{pending}</span></div>
    </footer>
  );
}

export default Footer;
