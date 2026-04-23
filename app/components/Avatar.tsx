export default function Avatar({ initial, size = 40 }: { initial: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#91C6FF,#A29AFF,#E66BFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        color: 'white',
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
