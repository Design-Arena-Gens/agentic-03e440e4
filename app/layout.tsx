export const metadata = {
  title: "Personal Agent",
  description: "A simple personal AI agent with tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        background: '#0b1020',
        color: '#e6eaf2'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
