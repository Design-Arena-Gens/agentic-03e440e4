import Chat from "@/components/Chat";

export default function Page() {
  return (
    <main>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }} />
        <h1 style={{ margin: 0 }}>Personal Agent</h1>
      </header>
      <Chat />
    </main>
  );
}
