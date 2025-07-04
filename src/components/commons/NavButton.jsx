const NavButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: active ? 'white' : 'rgba(255,255,255,0.1)',
      color: active ? '#1e3799' : 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '20px',
      border: '1px solid white',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    {children}
  </button>
);

export default NavButton;
