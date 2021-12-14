export const container = {
  height: 'calc(100vh - 65px)',
  backgroundColor: 'var(--body)',
  color: 'var(--light)',
  // padding: '1rem',
  width: '100%',
};

export const postBtn = {
  background: 'var(--gray-dark)',
  borderRadius: '2.5rem',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '0 2rem',
  cursor: 'pointer',
  '&:hover': {
    background: 'var(--gray-dark-hover)',
  },
};
