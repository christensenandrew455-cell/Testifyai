export default function Home() {
  return (
    <main style={{
      backgroundColor: '#fff7f0',
      color: '#1e3a8a',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to TestifyAI</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        For all your testing needs fueled by AI
      </p>
      <button style={{
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '30px',
        fontSize: '20px',
        cursor: 'pointer'
      }}>
        Test Me
      </button>
    </main>
  )
}

